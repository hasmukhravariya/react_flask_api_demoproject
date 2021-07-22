import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

function Register(props){
  const history = useHistory();

  const[state,setState]=useState({
    email: '',
    username: '',
    password: '',
    name:''
  });


  const handleInputChange = (event) => {
      const { name, value } = event.target;
      setState((prevState) => ({
          ...prevState,
          [name]: value
      }));
    };

  const changeModel=()=>{
    props.onCloseModal()
    props.openLogin()
  }


  const handleSubmit = event => {
    event.preventDefault();
    const user={
      type:"email",
      user:state
    }
    console.log(user)
    axios.post(`/api/register`,  user )
      .then(res => {
        // console.log(res);
        console.log(res.data);
        if(res.data.status===true){
          props.onCloseModal()
          setState({
            email: '',
            username: '',
            password: '',
            name:'',
          })
          const user={
            email:true,
            google:false,
            data:res.data.result
          }
          localStorage.setItem('user', JSON.stringify(user))
          history.push({
            pathname:  "/home",
            state: res.data.result
         });
        }
        else{
          alert(JSON.stringify(res.data.errors));
        }
      })
    }

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <form className="register_form_wrapper" onSubmit={handleSubmit}>
            <center><h3>Register User</h3></center>

            <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" className="form-control" placeholder="Name" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" className="form-control" placeholder="Username" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={handleInputChange} required  />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={handleInputChange} required/>
                <small id="passwordHelpBlock" class="form-text text-muted">
                  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, one of the symbols $@#.
                </small>
            </div>

            <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
            <p className="forgot-password text-right">
                Already registered <Button className="login_link" onClick={changeModel}>login?</Button>
            </p>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Register