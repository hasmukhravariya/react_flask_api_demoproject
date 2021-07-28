// const { API } =require('../datasource.js');

const Query= {
    users: (root, args, { dataSources }) => dataSources.API.getAllUsers(),
    tasks:(root, args, { dataSources }) => dataSources.API.getAllTasks(),
    task: (root, { id }, { dataSources }) => dataSources.API.getTask(id), 
  }

module.exports=Query