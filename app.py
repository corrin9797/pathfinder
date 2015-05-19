from flask import Flask, session, redirect, url_for, escape, request, render_template, flash, jsonify, json
from functools import wraps
from pymongo import MongoClient, Connection
import bson.json_util
#import base


app = Flask(__name__)

conn = Connection()
stat = conn['stat']

@app.route ("/")
def index():
    return "yolo"

@app.route ("/input_reset")
def input_reset():
    stat.stattable.drop()
    i = {"user":"hello", "stats":[1,2,3,4]}
    stat.stattable.insert(i)
    return redirect (url_for ("input"))

@app.route("/input", methods=['GET', 'POST'])
def input():
    if request.method == 'POST':
        i = {"user": request.form ["name"], "stats":request.form [
        "stat"]}
        stat.stattable.insert(i)
    cres = stat.stattable.find()
    for r in cres:
        print r
    return """<form method = "POST"><input type = "text" name = name id="input"></input><input type = "text" name = stat id="input"></input><input type = "submit"></input></form>"""

################################################################
#mongoclient

client = MongoClient()
db = client['pathfinder']
chatdb = db['chat']
moddb = db['module']
sheetdb = db['charsheet']

@app.route("/test")
def test():
     ###
    cres = chatdb.usertable.find()
    #{}, {'_id':False})
    #print cres
    #res = [r
    for l in cres:
        print l
    print "yolo"
    print chatdb.find_one({"title":"test".replace("%20"," ")})
    return "hi"

@app.route('/on_test')
def on_test():
    initeverything() #sweet jesus why
    return render_template("test/on_test.html")

@app.route("/ajax/chat/<channel>",methods=['GET','POST'])
def ajax_chat(channel):
    curChan = chatdb.find_one({"title":channel.replace("%20"," ")})
    if request.method == "POST":
        pdat = json.loads(request.data)
        newChat = {"author":pdat["author"],
                    "content":pdat["content"]}
        curChan["chat"].append(newChat)
        if len(curChan["chat"]) > 200:
            curChan["chat"] = curChan["chat"][len(curChan["chat"])-200:]
        chatdb.save(curChan)
    r = ""
    for msg in curChan["chat"]:

        r+="&lt;%s&gt; %s<br>\n" % (msg["author"],msg["content"])
    return jsonify(content=r)

@app.route("/ajax/module/<name>",methods=['GET','POST'])
def ajax_module(name):
    mod = moddb.find_one({"title":name.replace("%20"," ")})
    if request.method == "POST":
        pass #uh
    return bson.json_util.dumps(mod)

@app.route("/ajax/charsheet/<username>/<charname>",
           methods=['GET','POST'])
def ajax_charsheet(username,charname):
    sheet = sheetdb.find_one({"User":username.replace("%20"," "),
                              "Name":charname.replace("%20"," ")})
    if request.method == "POST":
        pass #uh
    return bson.json_util.dumps(sheet)

#JESUS
def initchatdb():
    testChan = chatdb.find_one({"title":"test"})
    if not testChan:
        testChan = {"title":"test",
                    "chat":[]}
        chatdb.insert(testChan)

#DEFINITELY NOT PRODUCTION CODE :^(
def initmoddb():
    pmod = moddb.find_one({"title":"Pathfinder"})
    print moddb.find_one({})
    #if not pmod:
    if True: #testy
        moddb.remove({}) #blood for the blood god
        pjsonf = open("static/test/pathfinder.json")
        pjson = json.load(pjsonf)
        pjsonf.close()
        moddb.insert(pjson)

#ALSO DEFINITELY NOT PRODUCTION CODE :^((((
def initsheetdb():
    #bob = sheetdb.find_one({"Name":"Bob","User":"Jamal"})
    #if not bob:
    if True: #testy
        sheetdb.remove({}) #blood for the blood god
        bobjsonf = open("static/test/bob.json")
        bobjson = json.load(bobjsonf)
        bobjsonf.close()
        sheetdb.insert(bobjson)

def initeverything():
    initchatdb()
    initmoddb()
    initsheetdb()

initeverything()

# set the secret key.  keep this really secret:
#this is fake very fake oooh
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == "__main__":
    app.debug = True
    app.run(host = "127.0.0.1", port = 1247)
