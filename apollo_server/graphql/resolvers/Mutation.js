const API =require('../DataSource/datasource.js');

const Mutation={
    checkUser:(root, { input }, { dataSources })=>dataSources.API.checkUser(input),
    createTask:(root, { input }, { dataSources })=>dataSources.API.createTask(input),
    createUser:(root, { input }, { dataSources })=>dataSources.API.createUser(input),
    updateUser:(root, { input }, { dataSources })=>dataSources.API.updateUser(input),
    setPassword:(root, { input }, { dataSources })=>dataSources.API.setPassword(input),
    updateTask:(root, { input }, { dataSources })=>dataSources.API.updateTask(input),
    deleteTask:(root, { input }, { dataSources })=>dataSources.API.deleteTask(input),
    singleUpload: async (root, { file }, {dataSources}) => dataSources.API.uploadImage(file), 
}

module.exports=Mutation