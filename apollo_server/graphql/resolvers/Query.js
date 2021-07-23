import { API } from '../datasource.js';

export const Query= {
    users: (root, args, { dataSources }) => dataSources.API.getAllUsers(),
    tasks:(root, args, { dataSources }) => dataSources.API.getAllTasks(),
    task: (root, { id }, { dataSources }) => dataSources.API.getTask(id), 
  }