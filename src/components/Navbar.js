import React from "react";
import Popover from "react-bootstrap/Popover"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar"
import Form from "react-bootstrap/Form"
import DropdownButton from "react-bootstrap/DropdownButton"
import Dropdown from "react-bootstrap/Dropdown"
import Nav from "react-bootstrap/Nav"
import { useRef, useState } from "react";
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import TaskRegister from "./TaskRegister";
import LogoutHooks from "./LogoutHooks"
import { useHistory } from "react-router";

const NavigationBar = props => {

  let page=props.page;
  let name, email, username, image, gettasksData;

  if(page!=="loginPage"){
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if( loggedInUser.data.image==null ){
      image=<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin" class="rounded-circle" width="150"/>
    }else{
      image=<img src={loggedInUser.data.image} alt="Admin" class="rounded-circle" width="150"/>
    }
    name=loggedInUser.data.name
    email=loggedInUser.data.email
    username=loggedInUser.data.username
    gettasksData=props.gettasksData;
  }

  const childRef = useRef();
  const history = useHistory();

  const[login,setLogin]=useState(false);
  const[register,setRegister]=useState(false);
  const[task,setTask]=useState(false)

  const onLoginOpenModal = () => {
    setLogin(true);
  };

  const onLoginCloseModal = () => {
    setLogin(false);
  };

  const onRegisterOpenModal = () => {
    setRegister(true);
  };

  const onRegisterCloseModal = () => {
    setRegister(false);
  };

  const onTaskOpenModal = () => {
    setTask(true);
  };

  const onTaskCloseModal = () => {
    setTask(false);
  };
  
  const viewUser=()=>{
    history.push({
        pathname: "/userprofile"
     });
  }

  const popover= (
    <Popover id="popover-bottom">
      <Popover.Title as="h3">User Profile</Popover.Title>
      <Popover.Content>
        <div class="pop-card">
          <div class="pop-card-body">
            <div class="d-flex flex-column align-items-center text-center">
              {image}
              <div class="mt-3">
                <h4>{name}</h4>
                <p class="text-secondary mb-1">{email}</p>
                <p class="text-muted font-size-sm">{username}</p>
                <button onClick={viewUser} class="btn btn-secondary">View Profile</button>
                <button onClick={() => { childRef.current.Success() }} className="btn btn-secondary margin_sides">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );

  const homepage=(
    <Form inline className="mx-3">
      <OverlayTrigger trigger='click' rootClose placement="bottom" overlay={popover}>
        <Navbar.Text>
          Signed in as:
          <Button className="link" variant="secondary">{name}</Button>
        </Navbar.Text>
      </OverlayTrigger>
      <Button variant="secondary" className="margin_sides" onClick={onTaskOpenModal}>Add Task</Button>
      <DropdownButton id="dropdown-item-button" variant="secondary" title="" alignRight >
        <Dropdown.Item onClick={onTaskOpenModal}>Add Task</Dropdown.Item>
        <Dropdown.Item onClick={viewUser} >View Profile</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => { childRef.current.Success() }} >Logout</Dropdown.Item>
      </DropdownButton>
    </Form>
  )

  const loginpage=(
    <Nav>
      <Button variant="secondary" id="register_button" onClick={onRegisterOpenModal}>Register</Button>
      <Button variant="secondary" onClick={onLoginOpenModal}>Login</Button>
    </Nav>
  )

  return (
    <>
      <Navbar sticky="top" bg="dark" variant="dark">
        <Navbar.Brand href="/">Task Management System</Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
        </Navbar.Collapse>
        <Nav className="me-auto">
        {page==="loginPage"? loginpage : homepage}
        </Nav>
      </Navbar>
      <LoginForm size="sm" show={login} onHide={onLoginCloseModal} onCloseModal={onLoginCloseModal}/>
      <RegisterForm show={register} onHide={onRegisterCloseModal} onCloseModal = {onRegisterCloseModal} openLogin={onLoginOpenModal}/>
      <LogoutHooks ref={childRef}/>
      <TaskRegister show={task} onHide={onTaskCloseModal} name={name} page={page} onCloseModal = {onTaskCloseModal} gettasksData={gettasksData}/>
    </>
  );
}

export default NavigationBar;
