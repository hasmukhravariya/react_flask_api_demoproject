import { ApolloServer, gql } from 'apollo-server';
import { API } from './graphql/datasource.js';
import fs from "fs";

const typeDefs = gql(fs.readFileSync('./graphql/typeDefs.graphql',{encoding:'utf-8'}));

const resolvers = {
  Query: {
    users: (root, args, { dataSources }) => dataSources.API.getAllUsers(),
    tasks:(root, args, { dataSources }) => dataSources.API.getAllTasks(),
    task: (root, { id }, { dataSources }) => dataSources.API.getTask(id), 
  },
  Mutation:{
    checkUser:(root, { input }, { dataSources })=>dataSources.API.checkUser(input),
    createTask:(root, { input }, { dataSources })=>dataSources.API.createTask(input),
    createUser:(root, { input }, { dataSources })=>dataSources.API.createUser(input),
    updateUser:(root, { input }, { dataSources })=>dataSources.API.updateUser(input),
    setPassword:(root, { input }, { dataSources })=>dataSources.API.setPassword(input),
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    API: new API()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});