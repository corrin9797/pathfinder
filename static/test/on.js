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
                
                charstats = {}
                for (stat in sheet) {
                    charstats[stat] = sheet[stat];
                }

                for (stat in module.derivedstats) {
                    //charstats[stat] = formulathingy(module.derivedStats[stat].formula,charstats);
                    charstats[stat] = module.derivedstats[stat].formula;
                }

                return strformat(module.layout, charstats);
            }
        };
    },
	events: {
        /*
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
        */
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
