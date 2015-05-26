var App = new Marionette.Application();

App.addRegions({
    headReg: "#head-reg",
    nameReg: "#name-reg",
    chatReg: "#chat-reg",
    charsheetReg: "#charsheet-reg"
    //#############
    newStatReg: "#new-stat"
    //#############
});

App.on("start",function(){
    var headView = new App.HeadView();
    App.headReg.show(headView);
    
    var nameView = new App.NameView({model:user});
    App.nameReg.show(nameView);
    
    var chatView = new App.ChatView({collection:chats});
    App.chatReg.show(chatView);
    
    var charsheetView = new App.CharsheetView({model:charsheet});
    App.charsheetReg.show(charsheetView);
    
    //#############
    //var newStatView = new App.NewStatView(SOMETHING HERE?)
    //#############

    Backbone.history.start();
    ajaxupdatechat();
});

App.HeadView = Marionette.ItemView.extend({
    template: "#head-template"
});

App.NewStatView = marionette.ItemView.extend({
    template: "#new-stat-template",
    tagname: "div",
    events:{
	"click #submit": function(){
	    //AFTER WE FIX THE STAT ARRAY (GET RID OF DERIVEDSTATS) EVALUATE FUNCTION HERE   
	    //var formula = $("#formula").val();
	    //var result  = evaluate(formula);
	    //var notError = !(result == "Error: Formula Invalid")
	    var notError = true;
	    if notError{
		//tell them ok its submitted
		//var name = $("#name")
		//submit name, formula
		//submit the damn thing
	    }
	    else{
		//tell them screw you
		//some error message or the other
	    }
	}
    }
    modelEvents: {
        "change": function() {
            this.render();
        }
    }
})	


App.NameView = Marionette.ItemView.extend({
    template: "#name-template",
    tagName: "div",
    events: {
	"click #namesetbutton": function(){
            var newname = $("#nametext").val();
            if (newname != "") {
                this.model.set({name:newname});
            }
        },
	"keydown #nametext": function(e){
            if (e.keyCode==13) {
                var newname = $("#nametext").val();
                if (newname != "") {
                    this.model.set({name:newname});
                    this.$("#nametext").focus();
                }
            }
        }
    },
    modelEvents: {
	"change":function(){
	    this.render();
	}
    }
});

App.ChatView = Marionette.CompositeView.extend({
    template: "#chat-template",
    childView: App.MessageView,
    childViewContainer: "span",
    events: {
        "click #chatsendbutton": function() {
            var newchat = $("#chattext").val();
            if (newchat != "") {
                ajaxsendchat(newchat);
                ajaxupdatechat();
                this.$("#chattext").focus();
            }
            $("#chattext").val("");
        },
	    "keydown #chattext": function(e){
            if (e.keyCode==13) {
                var newchat = $("#chattext").val();
                if (newchat != "") {
                    ajaxsendchat(newchat);
                    ajaxupdatechat();
                    this.$("#chattext").focus();
                }
                $("#chattext").val("");
            }
        }
    },
    modelEvents: {
        "change": function() {
            this.render();
        }
    }
});

App.CharsheetView = Marionette.ItemView.extend({
    template: "#charsheet-template",
    tagName: "div",
    serializeData: function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this,arguments);
        data.attributes = this.model.attributes
        return data;
    },
    templateHelpers: function() {
        return {
            showStats: function() {
                sheet = this.attributes.sheet;
                module = this.attributes.module;
                
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
                for (var statname in sheet) {
                    var val = sheet[statname]
                    if (!(statname in charstat)) {
                        charstat[statname] = {"type":"?"};
                    }
                    charstat[statname].base = val;
                    
                    if (charstat[statname].type=="choice") {
                        var dbstat = module.stats[statname].choice[val];
                        
                        //unlock appropriate stats
                        if ("unlock" in dbstat) {
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
                
                this.attributes.basestat = charstat;
                this.attributes.modstat = charmod;
                this.attributes.finalstat = charfinal;
                
                return statformat(module.layout, charfinal);
            }
        };
    },
	events: {
        
	},
	modelEvents: {
		"change":function(){
			this.render();
            var att = this.model.attributes;
            
            $(".statspan").tooltip({content:function(){
                var dbstat = att.module.stats[this.id];
                var r = "";
                if ("formula" in dbstat) {
                    r += "Formula: "+dbstat.formula+"<br>\n";
                    //maybe include the actual values later
                } else if (dbstat.type == "int") {
                    r += "Base: "+att.basestat[this.id].base+"<br>\n";
                    for (var modname in att.modstat) {
                        var mod = att.modstat[modname];
                        if (this.id in mod) {
                            r += modname+": "+mod[this.id]+"<br>\n";
                        }
                    } 
                    r += "<br>Final: "+att.finalstat[this.id]+"<br>\n";
                } else if (dbstat.type == "choice") {
                    chc = dbstat.choice[this.innerHTML];
                    if("modifier" in chc) {
                        r += "Modifiers: <br>\n"
                        r += "<ul>\n"
                        var mod = chc.modifier;
                        for (var eff in mod) {
                            r += "<li>"+eff+": "+mod[eff]+"</li>\n";
                        }
                        r += "</ul>\n"
                    }
                    if("unlock" in chc) {
                        r += "Unlocks: <br>\n"
                        r += "<ul>\n"
                        var unl = chc.unlock;
                        for (var i in unl) {
                            r += "<li>"+unl[i]+"</li>\n";
                        }
                        r += "</ul>\n"   
                    }
                }
                return r;
            }});
		}
    }
});

var User = Backbone.Model.extend();
var Message = Backbone.Model.extend();
var Chats = Backbone.Collection.extend({
    model:Message
});
var Charsheet = Backbone.Model.extend();

var user = new User({name:"Anonymous"});
var chats = new Chats();
var charsheet = new Charsheet({
    module:{layout:""}, 
    sheet:{},
    basestat:{},
    modstat:{},
    finalstat:{}
});

$.getJSON("/ajax/module/Pathfinder",function(modjson){
    charsheet.set({"module":modjson});
})
$.getJSON("/ajax/charsheet/Jamal/Bob",function(sheetjson){
    charsheet.set({"sheet":sheetjson});
})

App.start();
