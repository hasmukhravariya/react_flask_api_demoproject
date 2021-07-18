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
    email = db.Column(db.String(255))
    username = db.Column(db.String(255))  
    password = db.Column(db.String(255))
    image = db.Column(db.String(255))
    address = db.Column(db.String(255))
    phone = db.Column(db.String(13))

    def __init__(self, name, email, username=None, password=None, image=None, address=None, phone=None):
        self.name = name
        self.email = email
        self.username=username
        self.password = password
        self.image=image
        self.address=address
        self.phone=phone

    def __repr__(self):
       return f"{self.id}"

    def getallusers():
        return User.query.all() 

    def checkemail(value):
        email=User.query.filter(User.email == value).first()
        if email is not None:
            return True,email
        else:
            return False,email

    def checkuser(value):
        email=User.query.filter(User.email == value).first()
        username=User.query.filter(User.username == value).first()

        if email is not None:
            return True,email
        elif username is not None:
            return True,username
        else:
            return False,email 
