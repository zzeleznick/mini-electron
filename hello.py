#!/usr/bin/env python
from __future__ import print_function
from datetime import datetime
from time import sleep
import os, sys
from flask import Flask, flash, render_template, jsonify, request, redirect, url_for
# live reloading
from livereload import Server
# redirect
import webbrowser

app = Flask(__name__)

@app.route('/')
def hello():
    now = datetime.now().strftime("%m-%d-%Y %H:%M:%S")
    return render_template("index.html", timestamp = now)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return 'You want path: %s' % path


def main():
    sys.stdout.flush()
    # app.run()
    server = Server(app.wsgi_app)
    server.serve(port=5000, host='localhost', open_url=False, debug=True)

if __name__ == "__main__":
    sys.stdout.write("data")
    sys.stderr.write("err")
    main()