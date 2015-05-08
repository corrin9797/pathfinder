from flask import Flask, session, redirect, url_for, escape, request, render_template, flash, jsonify, json
from functools import wraps
from pymongo import MongoClient
import bson.json_util
import base


app = Flask(__name__)

client = MongoClient()
db = client['pathfinder']
chatdb = db['chat']
moddb = db['module']

stat = db['stat']

def validate(func):
    @wraps(func)
    def inner (*args, **kwargs):
        error = None
        if request.method == 'POST':
            if base.validate (request.form['username'], request.form['password']):
                session['username'] = request.form['username']
                flash('You were successfully logged in')
                return redirect(url_for('index'))
            else:
                error = "Invalid credentials"
                return render_template ("login.html", error = error)
        return func()
    return inner

@app.route('/')
def index():
    base.printData()
    if 'username' in session:
        return render_template ("index.html", 
                                corner = escape(session['username']))
    else:
        return render_template ("index2.html")

@app.route('/login', methods=['GET', 'POST'])
#@base.validate(request.form['username'], request.form['password'])
#def login():
#    error = None
#    if request.method == 'POST':
#        session['username'] = request.form['username']
#        flash('You were successfully logged in')
#        return redirect(url_for('index'))
#    else:
#        return render_template ("login.html", error = error)
@validate
def login():
    #else:
    return render_template ("login.html")

@app.route("/input", methods=['GET', 'POST'])
def input():
    
    if request.method == 'POST':
        
    return render_template("input.html")

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    flash("You have logged out")
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if 'username' in session:
        flash("You are already logged in")
        return redirect(url_for('index'))
    elif request.method == 'POST':
        if base.addUser (request.form['username'], request.form['password']):
            session['username'] = request.form['username']
            flash ("You have successfully registered")
            return redirect(url_for('index'))
        else:
            error = "That username is already taken"
            return  render_template ("register.html", error = error)
    else:
        return  render_template ("register.html", error = error)

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    error = None
    if 'username' in session:
        if request.method == 'POST':
            if base.updateUser (escape(session['username']), request.form['password'], request.form ['newpassword']):
                flash ("You have successfully changed your settings")
                return redirect(url_for('index'))
            else:
                error = "You have entered the wrong password"
                return render_template ("settings.html", 
                                        corner = escape(session['username']), 
                                        error = error)
        else:
            return render_template ("settings.html", 
                                        corner = escape(session['username']), 
                                        error = error)
    else:
        return render_template ("error.html")

@app.route('/about')
def about():
    if 'username' in session:
        return render_template  ("page1.html",
                                 corner = escape(session['username']))
    else:
        return render_template ("page1.html",
                                 corner = None)

@app.route('/love')
def love():
    if 'username' in session:
        return render_template  ("page2.html",
                                 corner = escape(session['username']))
    else:
        return render_template ("error.html")

@app.route('/death')
def death():
    if 'username' in session:
        return render_template  ("page3.html",
                                 corner = escape(session['username']))
    else:
        return render_template ("error.html")

@app.route('/illegal')
def illegal():
    if 'username' in session:
        return render_template  ("page4.html",
                                 corner = escape(session['username']))
    else:
        return render_template ("error.html")

@app.route('/reset')
def reset():
    base.restart()
    return redirect(url_for('index'))

################################################################
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
    return render_template("test/on_test.html")

@app.route("/ajax/module/<name>",methods=['GET','POST'])
def ajax_module(name):
    mod = moddb.find_one({"title":name.replace("%20"," ")})
    if request.method == "POST":
        pass #uh
    return bson.json_util.dumps(mod)
    

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

def initchatdb():
    testChan = chatdb.find_one({"title":"test"})
    if not testChan:
        testChan = {"title":"test",
                    "chat":[]}
        chatdb.insert(testChan)

#DEFINITELY NOT PRODUCTION CODE :^(
def initmoddb():
    pmod = moddb.find_one({"title":"Pathfinder Test"})
    #if not pmod:
    if True: #testy
        moddb.remove({}) #blood for the blood god
        pjsonf = open("static/test/pathfinder.json")
        pjson = json.load(pjsonf)
        pjsonf.close()
        moddb.insert(pjson)

initchatdb()
initmoddb()

# set the secret key.  keep this really secret:
#this is fake very fake oooh
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == "__main__":
    app.debug = True
    app.run(host = "127.0.0.1", port = 1247)
