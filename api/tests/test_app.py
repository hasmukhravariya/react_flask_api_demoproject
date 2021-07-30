import sys
sys.path.insert(0, '/home/hasmukh/Desktop/react-flask-project/react-flask-app/api/test')
from api import app
from flask import json

def test_task_by_id():
    response = app.test_client().get('/api/task/21')
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == True

def test_update_task():
    request_data={
        "id":"99",
        "title":"TESTING Update",
        "creater":"Hasmukh",
        "assigned":"Hasmukh",
        "description":"Python Test",
        "status":"Open"
    }
    response = app.test_client().patch('/api/task/99', data=json.dumps(request_data), content_type='application/json')
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == True

def test_delete_task():
    response = app.test_client().delete('/api/task/97')
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == False

def test_get_tasks():
    response = app.test_client().get('/api/tasks')
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == True

def test_post_task():
    request_data={
        "title":"TESTING",
        "creater":"Hasmukh",
        "assigned":"Hasmukh",
        "description":"Python Test",
        "status":""
    }
    response = app.test_client().post('/api/tasks', data=json.dumps(request_data), content_type='application/json',)
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == False

def test_login_successfull():
    request_data={
        "email":"Hasmukh16000@gmail.com",
        "password":"Hasmukh@16000"
    }
    response = app.test_client().post('/api/login', data=json.dumps(request_data), content_type='application/json',)
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == True

def test_login_unsuccessfull():
    request_data={
        "email":"Hasmukh16000@gmail.com",
        "password":"Hasmukh@1600"
    }
    response = app.test_client().post('/api/login', data=json.dumps(request_data), content_type='application/json',)
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == False
    assert data['error'] == 'Invalid Password'

def test_register_user():
    request_data={
        "type":"email",
        "user":{
            "email":"Hasmukh16000@gmail.com",
            "name":"Hasmukh",
            "password":"Hasmukh@16699",
            "username":"Hasmukh@16699"
        }
    }
    response = app.test_client().post('/api/register', data=json.dumps(request_data), content_type='application/json',)
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == False

def test_user_update():
    request_data={
        "data":{
            "address": "Mumbai",
            "email": "hasmukh16000@gmail.com",
            "id": "3",
            "image": "http://localhost:5000/api/image/3",
            "name": "Hasmukh Ravariya",
            "password": "true",
            "phone": "9820115228",
            "username": None,
        }
    }
    response = app.test_client().patch('/api/users/3', data=json.dumps(request_data), content_type='application/json',)
    data = json.loads(response.data)
    print(data)
    assert response.status_code == 200
    assert data['status'] == True
