import sys
sys.path.insert(0, '/home/hasmukh/Desktop/react-flask-project/react-flask-app/api/test')
from models import User
from schemas import UserSchema


def test_User():
	user=User("Hasmukh","Hasmukh@gmail.com")
	assert user.name == 'Hasmukh'
	assert user.email == 'Hasmukh@gmail.com'
	assert user.username == None

def test_User_getallusers():
	users=User.getallusers()
	new_Users=UserSchema(many=True).dump(users)
	user=new_Users[0]
	assert user['id'] == "1"
	assert user['address'] == "Mumbai"

def test_User_checkemail():
	status,email=User.checkemail("Hasmukh16000@gmail.com")
	user=UserSchema().dump(email)
	assert status == True
	assert user['id'] == "3"

def test_User_checkuser():
	status,email=User.checkuser("hasmukh.ravariya")
	user=UserSchema().dump(email)
	assert status == True
	assert user['id'] == "1" 