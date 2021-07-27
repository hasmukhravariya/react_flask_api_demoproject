const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");

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

const { query, mutate } = createTestClient(server);

test("get all tasks", async () => {
  const TASKS = gql`
    query{
      tasks {
        id,
        title
      }
    }
  `;

  const { data: { tasks } } = await query({ query: TASKS });

  expect(tasks[0]).toEqual({ id: "1", title: "React Testing library" });
});


test("Login with Wrong details", async () => {
  const CHECK_USER = gql`
    mutation($checkUserInput: checkinuser!){
      checkUser(input: $checkUserInput) {
        status,
        error,
        result {
         id
        }
      }
    }
  `;

  const input={
    checkUserInput: {
      email:"hasmukh1600@gmail.com",
      password:"Hasmukh@16000"
    }
  }

  const result = await server.executeOperation({
    query: CHECK_USER,
    variables: input
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.checkUser.status).toBe(false);
  expect(result.data?.checkUser.error).toBe("Invalid Username/Email");
  expect(result.data?.checkUser.result).toBe(null);
});

test("Login with correct details", async () => {
  const CHECK_USER = gql`
    mutation($checkUserInput: checkinuser!){
      checkUser(input: $checkUserInput) {
        status,
        error,
        result {
         id, 
         name
        }
      }
    }
  `;

  const input={
    checkUserInput: {
      email:"hasmukh.ravariya",
      password:"Hasmukh@16000"
    }
  }

  const result = await server.executeOperation({
    query: CHECK_USER,
    variables: input
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.checkUser.status).toBe(true);
  expect(result.data?.checkUser.error).toBe(null);
  expect(result.data?.checkUser.result.name).toBe("Hasmukh");
});

test("Create Task", async () => {
  const TASK_REGISTER = gql`
    mutation($createTaskInput: taskcreater!){
      createTask(input: $createTaskInput) {
        status,
        errors,
        task {
          id,
          title
        }
      }
    }
  `;

  const input={
    "createTaskInput": {
      "title":"Graphql create test",
      "creater":"Hasmukh",
      "assigned":"Hasmukh",
      "description":"Graphql create task test",
      "status":"Open"
    }
  }

  const result = await server.executeOperation({
    query: TASK_REGISTER,
    variables: input
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.createTask.status).toBe(true);
  expect(result.data?.createTask.errors).toBe(null);
  expect(result.data?.createTask.task.title).toBe("Graphql create test");
});

test("Create User", async () => {
  const USER_REGISTER = gql`
    mutation($createUserInput: createUserdata!){
      createUser(input: $createUserInput) {
        status,
        errors,
        result {
          id,
          email,
          phone
        }
      }
    }
  `;

  const input={
    createUserInput: {
      type:"email",
      user:{
        name:"ABC XYZ",
        email:"ABC.XYZ@gmail.com",
        username:"ABC.XYZ@123",
        password:"Abcxyz@123"
      }
    },
  }

  const result = await server.executeOperation({
    query: USER_REGISTER,
    variables: input
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.createUser.status).toBe(true);
  expect(result.data?.createUser.errors).toBe(null);
  expect(result.data?.createUser.result.email).toBe("ABC.XYZ@gmail.com");
  expect(result.data?.createUser.result.phone).toBe(null);
});

test("Update User", async () => {
  const USER_UPDATE = gql`
    mutation($updateUserInput: updateUserData!){
      updateUser(input: $updateUserInput) {
        status,
        errors,
        user {
          id,
          phone,
          email
        }
      }
    }
  `;

  const input={
    updateUserInput: {
      data:{
        id:"8",
        name:"ABC XYZ",
        email:"ABC.XYZ@gmail.com",
        username:"ABC.XYZ@123",
        password:"Abcxyz@123",
        phone:"9820115228",
        image:null,
        address:null
      }
    },
  }

  const result = await server.executeOperation({
    query: USER_UPDATE,
    variables: input
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.updateUser.status).toBe(true);
  expect(result.data?.updateUser.errors).toBe(null);
  expect(result.data?.updateUser.user.email).toBe("ABC.XYZ@gmail.com");
  expect(result.data?.updateUser.user.phone).toBe("9820115228");
});

test("Change Password", async () => {
  const SET_PASSWORD = gql`
    mutation($setPasswordInput: setPasswordData!){
      setPassword(input: $setPasswordInput) {
        status,
        errors,
        user{
          id,
          email
        }
      }
    }
  `;

  const input={
    setPasswordInput: {
      id:8,
      oldpassword:"Abcxyz@123",
      newpassword:"Hasmukh@16000"
    }
  }

  const result = await server.executeOperation({
    query: SET_PASSWORD,
    variables: input
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.setPassword.status).toBe(true);
  expect(result.data?.setPassword.errors).toBe(null);
  expect(result.data?.setPassword.user.email).toBe("ABC.XYZ@gmail.com");
  expect(result.data?.setPassword.user.id).toBe("8");
});
