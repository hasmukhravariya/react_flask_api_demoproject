const { ApolloServer, gql }=require('apollo-server');
const API = require('./graphql/datasource.js');
const fs =require("fs");
const resolvers =require("./graphql/resolvers/index.js")

const typeDefs = gql(fs.readFileSync('./graphql/typeDefs.graphql',{encoding:'utf-8'}));

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