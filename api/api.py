from config import app, db
from flask import request  
from passlib.hash import sha256_crypt
from models import Task, User
from schemas import TaskSchema, UserSchema

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

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
