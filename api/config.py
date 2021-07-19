from flask_marshmallow import Marshmallow
from flask import Flask
from flask_sqlalchemy import SQLAlchemy  
import os

UPLOAD_FOLDER ="/home/hasmukh/Desktop/react-flask-project/react-flask-app/api/static/images"
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)  
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/react'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['SECRET_KEY'] = "secret key"  
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['CORS_HEADERS'] = 'Content-Type'

db = SQLAlchemy(app) 
ma = Marshmallow(app)