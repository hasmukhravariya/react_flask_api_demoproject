import React from "react";
import { useState } from "react";
import logo from '../logo.svg';
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { Navbar, Nav, Button } from 'react-bootstrap'

const LoginPage=props=>{
  const[login,setLogin]=useState(false);
  const[register,setRegister]=useState(false);

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

  return (
    <div>
      <Navbar sticky="top" bg="dark" variant="dark">
        <Navbar.Brand>Task Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        </Navbar.Collapse>
        <Nav className="me-auto">
          <Nav>
            <Button variant="secondary" id="register_button" onClick={onRegisterOpenModal}>Register</Button>
            <Button variant="secondary" onClick={onLoginOpenModal}>Login</Button>
          </Nav>
        </Nav>
      </Navbar>
      <div className="header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Demo Project Using React and Flask Api
        </p>
      </div>
      <Modal open={login} center onClose={onLoginCloseModal}>
        <LoginForm onCloseModal = {onLoginCloseModal}/>
      </Modal>
      <Modal open={register} center onClose={onRegisterCloseModal}>
        <RegisterForm onCloseModal = {onRegisterCloseModal} openLogin={onLoginOpenModal}/>
      </Modal>
    </div>
  );

}

export default LoginPage