import sys
sys.path.insert(0, '/home/hasmukh/Desktop/react-flask-project/react-flask-app/api/test')
from models import Task
from schemas import TaskSchema


def test_Task():
	task=Task("Title","Hasmukh","Aman","Description","Hold")
	assert task.title == 'Title'
	assert task.creater != 'FlaskIsAwesome'
	assert task.assigned == 'Aman'
	assert task.description == 'Description'
	assert task.status == 'Hold'

def test_Task_gettaskbyid():
	task=Task.gettaskbyid(101)
	assert task.title == 'TESTING'
	assert task.creater == 'Hasmukh'
	assert task.assigned == 'Hasmukh'
	assert task.description == 'Python Test'
	assert task.status == 'Open'

def test_Task_getalltask():
	tasks=Task.getalltasks()
	new_tasks=TaskSchema(many=True).dump(tasks)
	task=new_tasks[0]
	assert task['id'] == "21"
