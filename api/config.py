from flask_marshmallow import Marshmallow
from flask import Flask
from flask_sqlalchemy import SQLAlchemy  

app = Flask(__name__)  
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/react'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['SECRET_KEY'] = "secret key"  

db = SQLAlchemy(app) 
ma = Marshmallow(app)