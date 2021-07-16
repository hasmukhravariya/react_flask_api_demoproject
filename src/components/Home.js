import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "./Table";
import Navbar from "./Navbar"

const Home = props => {

  const[state,setState]=useState({
        tasks: [],
        loading: true,
      });

  const gettasksData=()=> {
    axios.get("/api/tasks").then(res=>{
      setState({
        tasks: res.data.tasks,
        loading: false,
      })
    })
  }

  useEffect(() => {
       gettasksData()
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
  return (
    <div id="App" >
      <Navbar page="homePage" gettasksData={gettasksData}/>
      <div>
        <center><h3 id="home_body_heading">Task Table</h3></center>
        <Table data={state.tasks}/>
      </div>
    </div>
  );
}

export default Home;
