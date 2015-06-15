//defined in charsheet.html, passed from url via flask template
//var SHEET_ID = {{sheetid}} 

function ajaxupdatestat() {
    $.getJSON("/ajax/charsheet/"+SHEET_ID,function(sheetjson){
        charsheet.set({"sheet":sheetjson});
        var mod = charsheet.get("sheet").Module;
        if (charsheet.get("module").layout.length == 0) {
            $.getJSON("/ajax/module/"+mod, function(modjson){
                charsheet.set({"module":modjson});
            })
        }
    });
}

//SECURITY NIGHTMARE, AYY
function ajaxsendstat(statname, value) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/ajax/charsheet/"+SHEET_ID,
        data: JSON.stringify({
            statname: statname,
            newvalue: value
        }),
        dataType: "json",
        success: function(r){
            ajaxupdatestat()
        }
    });
}

var App = new Marionette.Application();

App.addRegions({
    headReg: "#head-reg",
    nameReg: "#name-reg",
    charsheetReg: "#charsheet-reg",
    //#############
    newStatReg: "#new-stat"
    //#############
});

App.on("start",function(){
    var charsheetView = new App.CharsheetView({model:charsheet, 
                                               collection:stats});
    App.charsheetReg.show(charsheetView);
    
    //#############
    //var newStatView = new App.NewStatView(SOMETHING HERE?)
    //#############

    Backbone.history.start();
});

App.NewStatView = Marionette.ItemView.extend({
    template: "#new-stat-template",
    tagname: "div",
    events:{
	"click #submit": function(){
	    //AFTER WE FIX THE STAT ARRAY (GET RID OF DERIVEDSTATS) EVALUATE FUNCTION HERE   
	    //var formula = $("#formula").val();
	    //var result  = evaluate(formula);
	    //var notError = !(result == "Error: Formula Invalid")
	    var notError = true;
	    //if notError{
		//tell them ok its submitted
		//var name = $("#name")
		//submit name, formula
		//submit the damn thing
	    //}
	    //else{
		//tell them screw you
		//some error message or the other
	    //}
	}
    },
    modelEvents: {
        "change": function() {
            this.render();
        }
    }
})	

App.StatView = Marionette.ItemView.extend({
    template: "#stat-template",
    initialize: function() {
        var att = this.model.attributes
        var stattype = att.type;
        var formula = att.formula;
        
        this.on("statspanevent",function(e) {
            if (att.nochange) {return;}
            var statname = e.model.attributes.name;
            var span=$("span[id='"+statname+"'][class=statspan]")[0];
            span.className = "statchange";
            if (stattype == "int" && !formula) {
                spanstr = '<input type="text" value="'+att.baseval+'">';
                spanstr += "<button class='submitstat'>Submit</button>";
                span.innerHTML = spanstr;
            } else if (stattype == "str") {
                spanstr = '<input type="text" value="'+att.baseval+'">';
                spanstr += "<button class='submitstat'>Submit</button>";
                span.innerHTML = spanstr;
            } else if (stattype == "choice") {
                spanstr = "<select>";
                for (var i=0; i<att.choices.length; i++) {
                    var c = att.choices[i];
                    if (c.name == att.baseval) {
                        spanstr += "<option selected='selected' ";
                        spanstr += "value='"+c.name+"'>";
                        spanstr += c.name+"</option>";
                    } else {
                        spanstr += "<option value='"+c.name+"'>";
                        spanstr += c.name+"</option>";
                    }
                }
                spanstr += "</select>";
                spanstr += "<button class='submitstat'>Submit</button>";
                span.innerHTML = spanstr;
            } 
            this.$("input").focus();
            //how to move cursor to end of text box?
        });
    },
    triggers: {
        "click .statspan": "statspanevent"
    },
    events: {
        "keypress .statchange": "statchangeevent",
        "click .submitstat": "statsubmitevent"
    },
    submitstat: function(span) {
        var att = this.model.attributes;

        var statname = span.attributes.id.value;
        var instr = span.children[0].value; //dear god why
        
        if (att.type == "int") {
            var invalue = +instr; //don't try this at home, kids
            //if instr does not represent number, invalue->NaN
            // ^^^ http://stackoverflow.com/questions/175739/
            if (instr!="" && !isNaN(invalue)) {
                span.className = "statspan";
                span.innerHTML = invalue;
                this.model.set({value: invalue});
                ajaxsendstat(statname, invalue);
            }
        } else if (att.type == "str") {
            if (instr!="") {
                span.className = "statspan";
                span.innerHTML = instr;
                this.model.set({value: instr});
                ajaxsendstat(statname, instr);
            }
        } else if (att.type == "choice") {
            span.className = "statspan";
            span.innerHTML = instr;
            this.model.set({value: instr});
            ajaxsendstat(statname, instr);
        }
    },
    statsubmitevent: function(e) {
        var span = e.target.parentElement;
        //var statname = span.attributes.id.value;
        //var instr = e.target.value;
        this.submitstat(span);
    },
    statchangeevent: function(e) {
        if (e.keyCode==13) {
            var span = e.currentTarget;
            //var statname = span.attributes.id.value;
            //var instr = e.target.value;
            this.submitstat(span);
        }
    },
    modelEvents: {
        "change": function() {
            this.render();
            this.triggerMethod("regenSheet");
        }
    }
});

App.CharsheetView = Marionette.CompositeView.extend({
    template: "#charsheet-template",
    childView: App.StatView,
    childViewContainer: "div",
    initialize: function() {
    },
    triggers: {
    },
    serializeData: function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this,arguments);
        data.attributes = this.model.attributes
        return data;
    },
    childEvents: {
        regenSheet:function(e) {
            this.regenModel();
            this.render();
        }
    },
    regenModel: function() {
        var att = this.model.attributes;
        var module = att.module;
        var sheet = att.sheet;
        
        var charstat = {} //character base stats
        var charmod = {}  //character stat modifiers

        //init charstat from module
        for (var statname in module.stats) {
            var stat = module.stats[statname];
            var newstat = {}
            newstat.type = stat.type;
            newstat.lock = ("locked" in stat) ? stat["locked"] : false;
            

            if (stat.type=="int") {
                newstat.base = 0;
            } else if (stat.type=="str") {
                newstat.base = "[STRING]";
            } else if (stat.type=="choice") {
                newstat.base = "[CHOICE]";
            } else {
                //this shouldn't happen
                newstat.base = "[WHAT]";
            }

            charstat[statname] = newstat;
        }

        //populate charstat with sheet values
        var didUnlock = true;
        var checkedStats = [];
        while(didUnlock) {
            didUnlock = false;
            for (var statname in sheet) {
                if (checkedStats.indexOf(statname) > -1) {continue;}
                if (!(charstat[statname])) {continue;}
                if (charstat[statname].lock) {continue;}
                checkedStats.push(statname);
                
                var val = sheet[statname]
                if (!(statname in charstat)) {
                    charstat[statname] = {"type":"?"};
                }
                charstat[statname].base = val;
                
                if (charstat[statname].type=="choice") {
                    var choices = module.stats[statname].choice
                    var dbstat = {};
                    for (var i=0; i<choices.length; i++) {
                        var c = choices[i];
                        if(c.name==val) {dbstat = c; break;}
                    }
                    
                    //unlock appropriate stats
                    if ("unlock" in dbstat) {
                        didUnlock = true;
                        for (var ustat in dbstat.unlock) {
                            ustat = dbstat.unlock[ustat]; //mfwjs
                            charstat[ustat].lock = false;
                        }
                    }
                    
                    //add modifiers to list
                    if ("modifier" in dbstat) {
                        var newmod = {};
                        for (var effname in dbstat.modifier) {
                            var val = dbstat.modifier[effname];
                            newmod[effname] = val;
                        }
                        charmod[statname] = newmod;
                    }   
                            
                }   
            }
        }
        
        //generate final stats
        var charfinal = {};
        //copy base stats
        for (var statname in charstat) {
            charfinal[statname] = charstat[statname].base;
        }
        //apply modifiers
        for (var modname in charmod) {
            mod = charmod[modname];
            for (var effname in mod) {
                effval = mod[effname];
                charfinal[effname] += effval;
            }
        }
        //evaluate derived stats
        for (var statname in charstat) {
            dbstat = module.stats[statname];
            if (dbstat && "formula" in dbstat) {
                charfinal[statname] = evaluate(dbstat.formula,charfinal);
            }
        }
        //regenerate collection
        this.collection.reset();
        var layout = module.layout;
        for (var i=0; i<layout.length; i++) {
            statname = layout[i];
            if(statname in module.stats && !charstat[statname].lock) {
                choices = module.stats[statname].choice
                news = new Stat({
                    line:     i,
                    name:     statname, 
                    type:     module.stats[statname].type,
                    formula:  module.stats[statname].formula,
                    nochange: statname=="User", //lmao
                    
                    baseval:  charstat[statname].base,
                    finalval: charfinal[statname],
                    choices:  module.stats[statname].choice
                });
                this.collection.add(news);
            }
        }
        
        this.model.set({basestat:charstat});
        this.model.set({modstat:charmod});
        this.model.set({finalstat:charfinal});
    },
	modelEvents: {
		"change":function(){
            this.regenModel();
            this.render();
            
            //tooltippy stuff
            //NOTE: MAKE THESE LESS UGLY HOLY CRAP
            var att = this.model.attributes;
            $(".statspan").tooltip({content:function(){
                var dbstat = att.module.stats[this.id];
                var r = "";
                if (dbstat && "formula" in dbstat) {
                    r += "Formula: "+dbstat.formula+"<br>\n";
                    //maybe include the actual values later
                } else if (dbstat.type == "str") {
                    r += "Click to edit string value";
                } else if (dbstat.type == "int") {
                    r += "Base: "+att.basestat[this.id].base+"<br>";
                    for (var modname in att.modstat) {
                        var mod = att.modstat[modname];
                        if (this.id in mod) {
                            r += modname+": "+mod[this.id]+"<br>";
                        }
                    } 
                    r += "<br>Final: "+att.finalstat[this.id]+"<br>";
                    r += "<br>Click to edit base value";
                } else if (dbstat.type == "choice") {
                    var chc = {};
                    for (var i=0; i<dbstat.choice.length; i++) {
                        var c = dbstat.choice[i];
                        if(c.name==att.basestat[this.id].base) {
                            chc = c; break;
                        }
                    }
                    if("modifier" in chc) {
                        r += "Modifiers: <br>"
                        r += "<ul>\n"
                        var mod = chc.modifier;
                        for (var eff in mod) {
                            r += "<li>"+eff+": "+mod[eff]+"</li>";
                        }
                        r += "</ul>"
                    }
                    if("unlock" in chc) {
                        r += "Unlocks: <br>"
                        r += "<ul>"
                        var unl = chc.unlock;
                        for (var i in unl) {
                            r += "<li>"+unl[i]+"</li>";
                        }
                        r += "</ul>"   
                    }
                    r += "<br>Click to modify choice";
                }
                return r;
            }});
		}
    }
});

var User = Backbone.Model.extend();

var Stat = Backbone.Model.extend();
var Stats = Backbone.Collection.extend({
    model:Stat,
    comparator:function(){return this.get("line");}
});
var Charsheet = Backbone.Model.extend({});

var stats = new Stats();
var charsheet = new Charsheet({
    module:{layout:[]}, 
    sheet:{},
    basestat:{},
    modstat:{},
    finalstat:{}
});

ajaxupdatestat();

App.start();
