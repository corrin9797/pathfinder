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
var charsheet = new Charsheet();

var module = {};

console.log("ayy");
$.getJSON("/static/test/pathfinder.json",function(json){
    module = json;
    console.log(json);
})
console.log("ayy");

App.start();
