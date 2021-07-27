const { API } =require('../datasource.js');

const Mutation={
    checkUser:(root, { input }, { dataSources })=>dataSources.API.checkUser(input),
    createTask:(root, { input }, { dataSources })=>dataSources.API.createTask(input),
    createUser:(root, { input }, { dataSources })=>dataSources.API.createUser(input),
    updateUser:(root, { input }, { dataSources })=>dataSources.API.updateUser(input),
    setPassword:(root, { input }, { dataSources })=>dataSources.API.setPassword(input), 
}

module.exports=Mutation