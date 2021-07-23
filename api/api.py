from config import app, db, UPLOAD_FOLDER
from flask import request, render_template, send_from_directory, jsonify 
from passlib.hash import sha256_crypt
from models import Task, User
from schemas import TaskSchema, UserSchema
import phonenumbers
import re
import os 
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

CORS(app)
cors=CORS(app, resources={
    r"/*":{
        "origins":"http://localhost:3000"
    }
})

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

user_schema=UserSchema()

def validate_phone(value):
    data=phonenumbers.parse(value, "IN")
    result=str(data).split()
    number=result[5]
    if phonenumbers.is_valid_number(data):
        return True,number
    else:
        return False,number

def validate_username(value):
    username=User.query.filter(User.username == value).first()
    if username is None:
        return True
    else:
        return False

def validate_password(value):
    reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"
    pat = re.compile(reg)
    mat = re.search(pat, value)
    if mat:
        return True
    else:
        return False

def register_user(value):
    error=user_schema.validate(value)
    if error:
        return {"status":False,"errors": error}
    temp=UserSchema(partial=True).load(value)
    user=User(**temp)
    if user.password==None:
        hasheduser=User(**temp)
    else:
        hashedpassword = sha256_crypt.hash(user.password)
        temp['password']=hashedpassword
        hasheduser=User(**temp)
    db.session.add(hasheduser)
    db.session.commit()
    data=UserSchema(exclude=["password"]).dump(hasheduser)
    if hasheduser.password is None:
        data['password']=False
    else:
         data['password']=True
    result={"status": True, "result":data}
    return result

def update_user(data,user,id):
    if data['password'] is not None:
        del data['password']
    if data['phone'] is not None:
        temp,phone=validate_phone(data['phone'])
        if temp:
            data['phone']=phone
            for k, v in data.items():
                setattr(user, k, v)
            db.session.commit()
            result=UserSchema(exclude=['password']).dump(User.query.get(id))
            if user.password is None:
                result['password']=False
            else:
                 result['password']=True
            return {"status":True,"user":result}
        else:
             return {"status":False,"errors":"Phone Number is not valid for country India"}
    else:
        for k, v in data.items():
            setattr(user, k, v)
        db.session.commit()
        result=UserSchema(exclude=['password']).dump(User.query.get(id))
        if user.password is None:
            result['password']=False
        else:
             result['password']=True
        return {"status":True,"user":result}



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

@app.route('/api/users')
def get_users():
    if request.method=="GET":
        data=User.getallusers()
        tasks=UserSchema(partial=True, many=True).dump(data)
        result={"users":tasks}
        return result

@app.route('/api/register', methods=['POST','GET'])
def add_user():
    if request.method=="POST":
        if(request.json['type']=="google"):
            user=UserSchema(partial=True).dump(request.json['user'])
            status,result=User.checkemail(user['email'])
            if status:
                data=user_schema.dump(result)
                if data['password'] is None:
                    data['password']=False
                else:
                    data['password']=True
                return {"status":True,"result": data}
            else:
                return register_user(request.json['user'])

        elif(request.json['type']=="email"):
            return register_user(request.json['user'])

        else:
            return {"status":False,"errors": "Invalid Json Data Posted"}
        

@app.route('/api/login', methods=['POST','GET'])
def check_user():
    if request.method=="POST":
        email=request.json["email"]
        password = request.json['password']

        status,data=User.checkuser(email)
        if status:
            temp=user_schema.dump(data)
            if temp['password'] is None:
                return {"status":False,"error": "User registered with google Account! Login with Google Button"}
            else:
                if (sha256_crypt.verify(password,temp['password'])):
                    result=UserSchema(exclude=['password'],partial=True).dump(temp)
                    result['password']=True
                    return {"status":True,"result": result}
                else:
                    return {"status":False,"error": "Invalid Password"}
        else:
            return{"status":False,"error": "Invalid Username/Email"}

@app.route('/api/users/<int:id>', methods=['PATCH'])
def user_op(id):
    if request.method=="PATCH":
        user=User.query.get(id)
        test=UserSchema().dump(user)
        if user is None:
            return {"status":False,"errors":"Id Not present in the database"}
        elif user.username is None:
            data=request.json['data']
            if data['username'] is not None:
                if validate_username(data['username']):
                    return update_user(data,user,id)
                else:
                    return {"status":False,"errors":"username already taken"}
            else:  
                return update_user(data,user,id)
        else:
            data=request.json['data']
            return update_user(data,user,id)
        

@app.route('/api/setpassword/<int:id>', methods=['POST'])
def set_password(id):
    if request.method=="POST":
        user=User.query.get(id)
        if user is None:
            return {"status":False,"errors":"Id Not present in the database"}
        else:
            if user.password is not None:
                oldpassword=request.json['oldpassword']
                newpassword=request.json['newpassword']
                if (sha256_crypt.verify(oldpassword,user.password)):
                    if validate_password(newpassword):
                        hashedpassword = sha256_crypt.hash(newpassword)
                        user.password=hashedpassword
                        db.session.commit()
                        result=UserSchema(exclude=['password']).dump(User.query.get(id))
                        result["password"]=True
                        return {"status":True,"user":result}
                    else:
                        return {"status":False, "errors":"Password should have at least one numeral,one uppercase letter,one lowercase letter,one of the symbols $@#"}
                else:
                    return {"status":False, "errors":"Old Password do not match"}
            else:
                newpassword=request.json['newpassword']
                if validate_password(newpassword):
                    hashedpassword = sha256_crypt.hash(newpassword)
                    user.password=hashedpassword
                    db.session.commit()
                    result=UserSchema(exclude=['password']).dump(User.query.get(id))
                    result["password"]=True
                    return {"status":True,"user":result}
                else:
                    return {"status":False, "errors":"Password should have at least one numeral,one uppercase letter,one lowercase letter,one of the symbols $@#"}

            
@app.route('/api/upload', methods=['POST'])
def fileUpload():
    target = os.path.join(app.config['UPLOAD_FOLDER'])
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    data=request.form['id']+".png"
    filename = secure_filename(data)
    destination="/".join([target,filename])
    file.save(destination)
    user=User.query.get(request.form['id'])
    image="http://localhost:5000/api/image/"+request.form['id']
    user.image=image
    db.session.commit()
    result=UserSchema(exclude=['password']).dump(user)
    if user.password is None:
        result['password']=False
    else:
         result['password']=True
    return {"status":True,"user":result}

@app.route('/api/image/<int:id>')
def serve(id):
    filename=str(id)+".png"
    return send_from_directory(UPLOAD_FOLDER, filename)

