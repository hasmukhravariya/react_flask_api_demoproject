from flask import Flask, request, flash, url_for, redirect, render_template, jsonify  
from flask_sqlalchemy import SQLAlchemy  
from marshmallow import Schema, fields, validate, ValidationError
from flask_marshmallow import Marshmallow
from marshmallow.validate import Length
from passlib.hash import sha256_crypt

app = Flask(__name__)  
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/react'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['SECRET_KEY'] = "secret key"  

db = SQLAlchemy(app) 
ma = Marshmallow(app)

class Task(db.Model): 
    __tablename__='task' 
    id = db.Column(db.Integer, primary_key = True)  
    title = db.Column(db.String(50))
    creater = db.Column(db.String(50))  
    assigned = db.Column(db.String(50))
    description = db.Column(db.String(500))
    status = db.Column(db.String(50))

    def __init__(self, title, creater, assigned, description, status):
        self.title = title
        self.creater = creater
        self.assigned = assigned
        self.description= description
        self.status = status

    def __repr__(self):
       return f"{self.id}"
     
    def getalltasks():
        return Task.query.all()

    def gettaskbyid(id):
        return Task.query.get(id) 

class User(db.Model): 
    __tablename__='users' 
    id = db.Column(db.Integer, primary_key = True)  
    name = db.Column(db.String(255))
    username = db.Column(db.String(255))
    email = db.Column(db.String(255))  
    password = db.Column(db.String(255))

    def __init__(self, name, username, email, password):
        self.name = name
        self.username=username
        self.email = email
        self.password = password

    def __repr__(self):
       return f"{self.id}"

    def checkuser(value):
        email=User.query.filter(User.email == value).first()
        username=User.query.filter(User.username == value).first()

        if email is not None:
            return True,email
        elif username is not None:
            return True,username
        else:
            return False,email 

      

class TaskSchema(ma.Schema):
    class Meta:
        # model=Task
        fields = ("id","title", "creater", 'assigned', "description", "status")
    id = fields.String(dump_only=True)
    title = fields.String(required=True, validate=[validate.Length(1,50)])
    creater = fields.String(required=True, validate=[validate.Length(1,50)])
    assigned = fields.String(required=True, validate=[validate.Length(1,50)])
    description = fields.String(required=True, validate=[validate.Length(1,500)])
    status = fields.String(required=True, validate=[validate.OneOf(["Open", "In Progress", "Hold", "Closed"])])

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)


class UserSchema(ma.Schema):
    def validate_email(value):
        email=User.query.filter(User.email == value).first() is None
        if email:
            return True
        else:
            raise ValidationError("Email already registered")

    def validate_username(value):
        username=User.query.filter(User.username == value).first() is None
        if username:
            return True
        else:
            raise ValidationError("Username not available")
        # return User.query.filter(User.username == value).first() is None

    class Meta:
        # model=Task
        fields = ("id","name", "username", "email", "password")
        # exclude = ("password")
    id = fields.String(dump_only=True)
    name = fields.String(required=True, validate=[validate.Length(1,255)])
    username = fields.String(required=True, validate=[validate_username,validate.Length(min=8,max=30,error="Username length must be between 8 to 20")])
    email = fields.Email(required=True, validate=[validate_email,validate.Length(1,255)])
    password = fields.String(required=True, validate=[validate.Length(min=8,max=20,error="Password length must be between 8 to 20")])

user_schema=UserSchema()

@app.route('/api/tasks', methods=['POST','GET'])
def get_tasks():
    if request.method=="GET":
        data=Task.getalltasks()
        tasks=tasks_schema.dump(data)
        result={"status": True,"tasks":tasks}
        return result

    if request.method=="POST":
        error=task_schema.validate(request.json)
        if error:
            return {"status":False,"errors": error}
        # task=task_schema.load(request.json)
        task=Task(
            title=request.json['title'],
            creater=request.json['creater'],
            assigned=request.json['assigned'],
            description=request.json['description'],
            status=request.json['status']
        )
        db.session.add(task)
        db.session.commit()
        result={"status": True,"task":task_schema.dump(task)}
        return result

@app.route('/api/task/<int:num>', methods=["DELETE",'GET','PATCH'])
def get_task_byId(num):
    if request.method=="GET":
        task=Task.gettaskbyid(num)
        if task is None:
            return {"status":False,"msg":"Id Not present in the database"}
        else:
            result={"status": True,"task":task_schema.dump(task)}
            return result

@app.route('/api/register', methods=['POST','GET'])
def add_user():
    if request.method=="POST":
        error=user_schema.validate(request.json)
        if error:
            return {"status":False,"errors": error}
        # task=task_schema.load(request.json)
        password = sha256_crypt.hash(request.json['password'])
        email=request.json['email'];
        user=User(
            name=request.json['name'],
            username=request.json['username'],
            email=email,
            password=password,
        )
        db.session.add(user)
        db.session.commit()
        data=UserSchema(exclude=['password']).dump(user)
        result={"status": True, "result":data}
        return result

@app.route('/api/login', methods=['POST','GET'])
def check_user():
    if request.method=="POST":
        email=request.json["email"]
        password = request.json['password']

        status,data=User.checkuser(email)
        if status:
            temp=user_schema.dump(data)
            if (sha256_crypt.verify(password,temp['password'])):
                result=UserSchema(exclude=['password']).dump(temp)
                return {"status":True,"result": result}
            else:
                return {"status":False,"error": "Invalid Password"}
        else:
            return{"status":False,"error": "Invalid Username/Email"}

        # data=user_schema.dump(User.checkuser(email))
        # if( not bool(data)):
        #     return{"status":False,"error": "Invalid User"}
        # elif(sha256_crypt.verify(password,data['password'])):
        #     result={
        #         "name":data['name'],
        #         "email":data['email']
        #     }
        #     return {"status":True,"result": result}
        # else:
        #     return {"status":False,"error": "Invalid Password"}