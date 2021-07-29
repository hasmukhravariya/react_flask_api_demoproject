const { RESTDataSource } =require('apollo-datasource-rest');
const { finished } = require('stream/promises');
const FormData  = require('form-data');
const rawBody =require('raw-body');
const fetch =require('node-fetch');

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

  async uploadImage(input,id){
    const { createReadStream, filename, mimetype, encoding } = await input.file;  
    const file=await input.file;
    const buffer=await rawBody(file.createReadStream())
    const form = new FormData();
    form.append('file', buffer, {
      filename: file.filename,
      contentType: file.mimetype,
      knownLength: buffer.length
    });
    form.append('id',id);
    const response=await this.post('upload',form)
    const result={
      status:response.status,
      errors:response.errors,
      user:response.user 
    }
    return result;
  }

};

module.exports=API;