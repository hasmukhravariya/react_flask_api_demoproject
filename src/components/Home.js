import React, { useEffect, useState } from "react";
import Table from "./Table";
import Navbar from "./Navbar"
import { useQuery, gql } from "@apollo/client";

const TASKS_QUERY = gql`
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
  const { data, refetch } = useQuery(TASKS_QUERY);
  
  const gettasksData =() => {
    refetch()
  }
  
  useEffect(() => {
    if(data){
      refetch()
      setData(data.tasks)
    }
  }, [data, refetch]);

  return (
    <div id="App" >
      <Navbar page="homePage" gettasksData={gettasksData}/>
      <div>
        <center><h3 id="home_body_heading">Task Table</h3></center>
        <Table data={Data}/>
      </div>
    </div>
  );
}

export default Home;
