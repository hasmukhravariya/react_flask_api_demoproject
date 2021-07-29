import React, { useEffect, useState } from "react";
import Table from "./Table";
import Navbar from "./Navbar"
import { useQuery, gql } from "@apollo/client";
import TaskUpdate from "./TaskUpdate"

export const TASKS_QUERY = gql`
  {
    tasks {
      id,
      assigned,
      title,
      status,
      description
      creater
    }
  }
`;

const Home = props => {
  const [Data, setData] = useState([]);
  const [taskData, setTaskData]=useState();
  const[task,setTask]=useState(false)
  const { loading, error, data, refetch } = useQuery(TASKS_QUERY);
  

  const onTaskOpenModal = (data) => {
    setTaskData(data)
    setTask(true);
  };

  const onTaskCloseModal = () => {
    setTask(false);
  };

  const gettasksData =() => {
    refetch()
  }

  useEffect(() => {
    if(data){
      refetch()
      setData(data.tasks)
    }
  }, [data, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  
  return (
    <div id="App" >
      <Navbar page="homePage" gettasksData={gettasksData}/>
      <div>
        <center><h3 id="home_body_heading">Task Table</h3></center>
        <Table data={Data} OpenModel={onTaskOpenModal} />
      </div>
      <TaskUpdate show={task} onHide={onTaskCloseModal} CloseModal = {onTaskCloseModal}  data={taskData} gettasksData={gettasksData}/>
    </div>
  );
}

export default Home;
