const { RESTDataSource } =require('apollo-datasource-rest');
const { finished } = require('stream/promises');

class API extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://127.0.0.1:5000/api/';
  }

  async getAllUsers() {
    const response = await this.get('users');
    return response
  }

  async getAllTasks() {
    const response = await this.get('tasks');
    return response.tasks
  }

  async getTask(id){
    const link='task/'+id
    const response = await this.get(link);
    
    const result={
      status:response.status,
      msg:response.msg,
      task:response.task 
    }
    return result  

  }

  async checkUser(input){
    const response = await this.post('login', input);
    const result={
      status:response.status,
      error:response.error,
      result:response.result 
    }
    return result
  }

  async createTask(input){
    const response = await this.post('tasks', input);
    const result={
      status:response.status,
      errors:JSON.stringify(response.errors),
      task:response.task 
    }
    return result
  }

  async createUser(input){
    const response = await this.post('register', input);
    const result={
      status:response.status,
      errors:JSON.stringify(response.errors),
      result:response.result 
    }
    return result
  }

  async updateUser(input){
    const link='users/'+input.data.id
    const response = await this.patch(link, input);
    const result={
      status:response.status,
      errors:JSON.stringify(response.errors),
      user:response.user 
    }
    return result
  }

  async setPassword(input){
    const link='setpassword/'+input.id
    const response = await this.post(link, input);
    const result={
      status:response.status,
      errors:JSON.stringify(response.errors),
      user:response.user 
    }
    return result
  }

  async updateTask(input){
    const link='task/'+input.id
    const response = await this.patch(link, input);
    const result={
      status:response.status,
      errors:JSON.stringify(response.errors),
      msg:response.msg,
      task:response.task 
    }
    return result
  }

  async deleteTask(input){
    const link='task/'+input
    const response = await this.delete(link, input);
    const result={
      status:response.status,
      msg:response.msg,
    }
    return result
  }

  async uploadImage(input){
    const { createReadStream, filename, mimetype, encoding } = await input.file;
    const stream = createReadStream();
    const out = require('fs').createWriteStream('local-file-output.png');
    stream.pipe(out);
    await finished(out);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    const link="upload"
    return { filename, mimetype, encoding };
  }

};

module.exports=API;