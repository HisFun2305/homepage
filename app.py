import os
import json

from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

import sqlite3
from sqlite3 import Error

DB_PATH = os.getcwd() + "\data.sqlite"

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

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def index():
    return render_template("index.html", active1 = "active")

@app.route("/to-do")
def todo():
    return render_template("to-do.html", active2 = "active")

@app.route("/plans", methods = ["GET", "POST"])
def plans():
    if request.method == "POST":
        print(request.json)
        return "success"
    else:
        return render_template("plans.html", active3 = "active", test_res = "yeet")

@app.route("/plans/data")
def data():
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