const resolvers=require("../index.js")
const API = require('../../DataSource/datasource.js');

describe("Resolver Tests", () => {
	it("Query getTask Testing ", ()=>{
		const id=1;
		const temp=jest.fn()
		const dataSources={
			API: {
				getTask:temp
			}	
		}
		resolvers.Query.task(null,{id},{dataSources})
		expect(temp).toBeCalledWith(id)
	});


	it("Query getAllTasks Testing ", ()=>{
		const temp=jest.fn()
		const dataSources={
			API: {
				getAllTasks:temp
			}	
		}
		resolvers.Query.tasks(null,null,{dataSources})
		expect(temp).toBeCalledWith()
	});

	it("Query getAllUsers Testing ", ()=>{
		const temp=jest.fn()
		const dataSources={
			API: {
				getAllUsers:temp
			}	
		}
		resolvers.Query.users(null,null,{dataSources})
		expect(temp).toBeCalledWith()
	});


	it("Mutation checkUser Testing ", ()=>{
		const temp=jest.fn()
		const input={
	    	"email":"Test",
    		"password":"Test2"
    	}
		const dataSources={
			API: {
				checkUser:temp
			}	
		}
		resolvers.Mutation.checkUser(null,{input},{dataSources})
		expect(temp).toBeCalledWith(input)
	});

	it("Mutation createTask Testing ", ()=>{
		const temp=jest.fn()
		const input={
	    	"title":"Test",
	    	"description":"Test2"
	    }
		const dataSources={
			API: {
				createTask:temp
			}	
		}
		resolvers.Mutation.createTask(null,{input},{dataSources})
		expect(temp).toBeCalledWith(input)
	});

	it("Mutation createUser Testing ", ()=>{
		const temp=jest.fn()
		const input={
	    	"title":"Test",
	    	"description":"Test2"
	    }
		const dataSources={
			API: {
				createUser:temp
			}	
		}
		resolvers.Mutation.createUser(null,{input},{dataSources})
		expect(temp).toBeCalledWith(input)
	});

	it("Mutation updateUser Testing ", ()=>{
		const temp=jest.fn()
		const input={
	    	data:{
	    		id:1,
	    		name:"Hasmukh"
	    	}
	    }
		const dataSources={
			API: {
				updateUser:temp
			}	
		}
		resolvers.Mutation.updateUser(null,{input},{dataSources})
		expect(temp).toBeCalledWith(input)
	});

	it("Mutation setPassword Testing ", ()=>{
		const temp=jest.fn()
		const input={
	    	id:"1",
	    	newpassword:"123",
	    	oldpassword:"1234"
	    }
		const dataSources={
			API: {
				setPassword:temp
			}	
		}
		resolvers.Mutation.setPassword(null,{input},{dataSources})
		expect(temp).toBeCalledWith(input)
	});	
})