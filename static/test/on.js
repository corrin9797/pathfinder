var App = new Marionette.Application();

App.addRegions({
    headReg: "#head-reg",
    nameReg: "#name-reg",
    chatReg: "#chat-reg",
    charsheetReg: "#charsheet-reg"
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
    
    Backbone.history.start();
    ajaxupdatechat();
});

App.HeadView = Marionette.ItemView.extend({
    template: "#head-template"
});

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
                        console.log(dbstat);
                        charfinal[statname] = evaluate(dbstat.formula,charfinal);
                    }
                }
                //charstats[stat] = formulathingy(module.derivedstats[stat].formula,charstats);
		        //in evaluate.js
		        //evaluate(formula string, array of all stats)
		        //returns int if formula valid, else returns "Error: Invalid Formula"
                
                return strformat(module.layout, charfinal);
            }
        };
    },
	events: {
	},
	modelEvents: {
		"change":function(){
			this.render();
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
var charsheet = new Charsheet({module:{layout:""}, sheet:{}});

$.getJSON("/ajax/module/Pathfinder",function(modjson){
    charsheet.set({"module":modjson});
})
$.getJSON("/ajax/charsheet/Jamal/Bob",function(sheetjson){
    charsheet.set({"sheet":sheetjson});
})

App.start();
