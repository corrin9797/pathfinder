var App = new Marionette.Application();

// Things that are new/untested are separated by #
// -V

App.addRegions({
    headReg: "#head-reg",
    nameReg: "#name-reg",
    chatReg: "#chat-reg",
    charsheetReg: "#charsheet-reg",
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
    var newStatView = new App.
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
    }
    modelEvents: {
        "change": function() {
            this.render();
        }
    }
);

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
                    //charstats[stat] = formulathingy(module.derivedstats[stat].formula,charstats);
		    //in evaluate.js
		    //evaluate(formula string, array of all stats)
		    //returns int if formula valid, else returns "Error: Invalid Formula"
		    charstats[stat] = module.derivedstats[stat].formula;
                }
		//hey lawrence put buttons on the do
		//next to each stat
		//events: pressing each button edits the stat FORMULA it's related to
                return strformat(module.layout, charstats);
            }
        };
    },
    events: {
	//see above
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
