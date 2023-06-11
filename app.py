import os
from datetime import datetime
import pytz

from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")