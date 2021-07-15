import React from "react";
import axios from "axios";
import "../index.css";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import { Navbar, Nav, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import TaskRegister from "./TaskRegister";
import BootstrapTable from "./BootstrapTable";
import LogoutHooks from "./LogoutHooks"

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}


const Home = props => {
  const childRef = useRef();
  const[state,setState]=useState({
    tasks: [],
    loading: true,
    user:{
      name:"",
      username:"",
      email:""
    }
  });
  
  const[open,setOpen]=useState(false)

  const location = useLocation();
   
  const gettasksData=()=> {
    axios.get("/api/tasks").then(res=>{
      setState(prevState => ({
        tasks: res.data.tasks,
        loading: false,
        user: {
            ...prevState.user,
            name: location.state.name,
            email: location.state.email,
            username: location.state.username
        }
    }))
    })
  }

  useEffect(() => {
       gettasksData()
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };
  
    const columns = [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Title",
        accessor: "title"
      },

      {
        Header: "Creater",
        accessor: "creater",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Assigned",
        accessor: "assigned",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Description",
        accessor: "description"
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: 'includes',
      }
    ];
    // console.log(open)
    return (
      <div id="App" >
        <Navbar sticky="top" bg="dark" variant="dark">
          <Navbar.Brand>Task Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          </Navbar.Collapse>
          <Nav className="me-auto">
            <Navbar.Text>
              Signed in as: {state.user.username}
            </Navbar.Text>
            <Form inline className="mx-3">
              <Button variant="secondary" className="margin_sides" onClick={onOpenModal}>Add Task</Button>
              <DropdownButton menuVariant="dark"id="dropdown-item-button" variant="secondary" alignRight >
                <Dropdown.Item onClick={onOpenModal}>Add Task</Dropdown.Item>
                <Dropdown.Item onClick={() => { childRef.current.Success() }} >Logout</Dropdown.Item>
              </DropdownButton>
            </Form>
          </Nav>
        </Navbar>
        <div>
          {/*<center><h2>Task Table</h2></center>*/}
          <BootstrapTable columns={columns} data={state.tasks}/>
          <LogoutHooks ref={childRef}/>
        </div>
          <Modal open={open} center="true" onClose={onCloseModal}>
            <TaskRegister state={state} onCloseModal = {onCloseModal} gettasksData={gettasksData}/>
          </Modal>
      </div>
    );
}

export default Home;
