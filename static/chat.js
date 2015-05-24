
var chatupdaterate = 1;
var curchan = "test";

function ajaxsendchat(text) {
    if(text.length==0) {return;}
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/ajax/chat/test",
        data: JSON.stringify({
            content: text, 
            author: user.get("name"),
            channel: curchan
        }),
        dataType: "json",
        success: function(r){
            cm = $("#chatmain");
            cm.scrollTop(cm.prop("scrollHeight"));
        }
    });
}

function ajaxupdatechat() {
    $.getJSON("/ajax/chat/test",updatechat);
}

function updatechat(r) {
    var cm = $("#chatmain")
    //toScroll = cm.scrollTop()+cm.height()==cm.prop("scrollHeight");
    toScroll = true;
    cm.html(r.content);
    if (toScroll) {cm.scrollTop(cm.prop("scrollHeight"));}
    window.setTimeout(ajaxupdatechat,1000/chatupdaterate);
    //fix this at some point
}
