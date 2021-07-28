const API = require('../datasource.js');

describe('DataSource API', () => {
  it('tasks gets data from correct URL', async () => {
    const datasource = new API()
    datasource.get = jest.fn().mockResolvedValue("tasks:[{id:1,title:\"Test\"}]");
   	await datasource.getAllTasks()
    expect(datasource.get).toBeCalledWith('tasks')
  })

  it('Users gets data from correct URL', async () => {
    const datasource = new API()
    datasource.get = jest.fn().mockResolvedValue("");
   	await datasource.getAllUsers()
    expect(datasource.get).toBeCalledWith('users')
  })

  it('task gets data from correct URL', async () => {
    const datasource = new API()
    datasource.get = jest.fn().mockResolvedValue("");
   	await datasource.getTask(2);
    expect(datasource.get).toBeCalledWith('task/2')
  })

  it('checkuser post data to the correct URL', async () => {
    const datasource = new API()
    datasource.post = jest.fn().mockResolvedValue("");
   	const input={
    	"email":"Test",
    	"password":"Test2"
    }
    await datasource.checkUser(input);
    expect(datasource.post).toBeCalledWith('login',input)
  })

  it('createTask post data to the correct URL', async () => {
    const datasource = new API()
    datasource.post = jest.fn().mockResolvedValue("");
   	const input={
    	"title":"Test",
    	"description":"Test2"
    }
    await datasource.createTask(input);
    expect(datasource.post).toBeCalledWith('tasks',input)
  })

  it('createUser post data to the correct URL', async () => {
    const datasource = new API()
    datasource.post = jest.fn().mockResolvedValue("");
   	const input={
    	"title":"Test",
    	"description":"Test2"
    }
    await datasource.createUser(input);
    expect(datasource.post).toBeCalledWith('register',input)
  })

  it('updateUser patch data to the correct URL', async () => {
    const datasource = new API()
    datasource.patch = jest.fn().mockResolvedValue("");
   	const input={
    	data:{
    		id:1,
    		name:"Hasmukh"
    	}
    }
    await datasource.updateUser(input);
    expect(datasource.patch).toBeCalledWith('users/1',input)
  })

  it('setpassword post data to the correct URL', async () => {
    const datasource = new API()
    datasource.post = jest.fn().mockResolvedValue("");
   	const input={
    	id:"1",
    	newpassword:"123",
    	oldpassword:"1234"
    }
    await datasource.setPassword(input);
    expect(datasource.post).toBeCalledWith('setpassword/1',input)
  })
})
