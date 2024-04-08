import os
import json
import random

from flask import Flask, flash, redirect, render_template, request, session

import sqlite3
from sqlite3 import Error

DB_PATH = os.getcwd() + "/data.sqlite"
DB_PROM = os.getcwd() + "/prom.sqlite"

def create_connection(DB_PATH):
    connection = None
    try:
        connection = sqlite3.connect(DB_PATH)
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

# Configure application
app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        conn = create_connection(DB_PATH)
        db = conn.cursor()
        # dat = db.execute("SELECT * FROM sad")
        txt = request.json
        txt = ["".join(txt)]
        try:
            db.execute("INSERT INTO sad VALUES(?)", txt)
            conn.commit()
            conn.close()
            return "200_OK"
        except sqlite3.IntegrityError:
            conn.close()
            return "You've already said this! Still sounds good though :D"

    else:
        print(DB_PATH)
        conn = create_connection(DB_PATH)
        db = conn.cursor()
        dat = db.execute("SELECT * FROM sad")
        txt = []
        for t in dat:
            txt.append(t[0])
        db.close()
        return render_template("index.html", active1 = "active", SAD = txt[random.randrange(0, len(txt))])



@app.route("/to-do", methods = ["GET", "POST"])
def todo():
    if request.method == "POST":
        data = request.json
        conn = create_connection(DB_PATH)
        db = conn.cursor()
        if data[1] == 0:
            data = [data[0], 0]
            db.execute("INSERT INTO todo (txt, flag) VALUES(?, ?)", data)
            conn.commit()
        elif data[1] == 1:
            data = [1, data[0]["id"]]
            db.execute("UPDATE todo SET flag = ? WHERE id = ?", data)
            conn.commit()
        elif data[1] == 2:
            data = [2, data[0]["date"], data[0]["id"]]
            db.execute("UPDATE todo SET flag = ?, date = ? WHERE id = ?", data)
            conn.commit()
        elif data[1] == 3:
            data = [0, data[0]["id"]]
            db.execute("UPDATE todo SET flag = ? WHERE id = ?", data)
            conn.commit()
        elif data[1] == 4:
            db.execute("DELETE FROM todo WHERE flag = 2")
            conn.commit()
        conn.close()
        return "200_OK"
    else:
        return render_template("to-do.html", active2 = "active")

@app.route("/to-do/data", methods = ["GET", "POST"])
def todo_data():
    connection = create_connection(DB_PATH)
    db = connection.cursor()
    db.row_factory = dict_factory
    jsonList = []
    for out in db.execute("SELECT * FROM todo"):
        jsonList.append(out)
    out = json.dumps(jsonList)
    return out

@app.route("/plans", methods = ["GET", "POST"])
def plans():
    if request.method == "POST":
        data = request.json
        conn = create_connection(DB_PATH)
        db = conn.cursor()
        if data[1] == 0:
            data[0]["log"] = "|".join(data[0]["log"])
            data = [data[0]["txt"], data[0]["urg"], data[0]["impt"], data[0]["log"]]
            db.execute("INSERT INTO plans (txt, urg, impt, log) VALUES(?, ?, ?, ?)", data)
            conn.commit()
        elif data[1] == 1:
            data[0]["log"] = "|".join(data[0]["log"])
            data = [data[0]["txt"], data[0]["urg"], data[0]["impt"], data[0]["log"], data[0]["id"]]
            db.execute("UPDATE plans SET txt = ?, urg = ?, impt = ?, log = ? WHERE id = ? ", data)
            conn.commit()
        elif data[1] == 2:
            data = [data[0]["id"]]
            db.execute("DELETE FROM plans WHERE id = ?", data)
            conn.commit()
        conn.close()
        return "200_OK"
    else:
        return render_template("plans.html", active3 = "active", test_res = "yeet")

@app.route("/plans/data")
def plans_data():
    connection = create_connection(DB_PATH)
    db = connection.cursor()
    db.row_factory = dict_factory
    jsonList = []
    for out in db.execute("SELECT * FROM plans"):
        out["log"] = out["log"].split("|")
        jsonList.append(out)
    out = json.dumps(jsonList)
    return out

@app.route("/tnw")
def tnw():
    return render_template("tnw.html", active4 = "active")

@app.route("/prom", methods = ["GET", "POST"])
def prom():
    if request.method == "POST":
        connection = None
        try:
            connection = sqlite3.connect(DB_PROM)
            print("Connection to SQLite DB successful")
            db = connection.cursor()
            if db.fetchone() is None:
                db.execute("CREATE TABLE yes(ans TEXT)")
        except Error as e:
            print(f"The error '{e}' occurred")
        data = [request.json]
        print(request.json)
        db.execute("""INSERT INTO yes VALUES(?)""", data)
        connection.commit()
        connection.close()
        return "HTTP_200_OK"
    else:
        return render_template("prom.html")
        
def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

# data = [
#     ("test", 70, 60, "a|b"),
#     ("test2",83, 75, "c|d"),
#     ("3tset",79, 80, "z|y"),
#     ("test4", 23, 45, "y|c")
# ] 
# db.executemany("INSERT INTO plans (txt, urg, impt, log) VALUES(?, ?, ?, ?)", data)

# CREATE TABLE plans (id INTEGER PRIMARY KEY AUTOINCREMENT, txt TEXT NOT NULL, urg INT NOT NULL, impt INT NOT NULL, log TEXT NOT NULL)