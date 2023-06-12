import os
from datetime import datetime
import pytz

from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/to-do")
def todo():
    return render_template("to-do.html")

@app.route("/plans")
def plans():
    return render_template("plans.html")

@app.route("/tnw")
def tnw():
    return render_template("tnw.html")