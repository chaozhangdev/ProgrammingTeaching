from flask import Flask, render_template, url_for

import os

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def home():
	return render_template("home.html")

@app.route("/scratch/")
def scratch():
	return render_template("scratch.html")

@app.route("/python/")
def python():
	return render_template("python.html")

@app.route("/python_office/")
def python_office():
	return render_template("python_office.html")

@app.route("/web/")
def web():
	return render_template("web.html")

if __name__ == '__main__':
	app.run(debug = True)

    