from config import db

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