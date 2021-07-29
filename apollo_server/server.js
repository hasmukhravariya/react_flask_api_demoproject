const express = require('express');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const { ApolloServer, gql }=require('apollo-server-express');
const API = require('./graphql/DataSource/datasource.js');
const fs =require("fs");
const resolvers =require("./graphql/resolvers/index.js")

const typeDefs = gql(fs.readFileSync('./graphql/typeDefs.graphql',{encoding:'utf-8'}));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      API: new API()
    })
  });
  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise(r => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();