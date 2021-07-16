import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import Login from "./Login";
import Modal from "react-bootstrap/Modal"

function LoginForm(props){

    const history = useHistory();
    const[user,setUser]=useState({
        email: '',
        password: ''
      });

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUser((prevState) => ({
          ...prevState,
          [name]: value
      }));
    };

    const handleSubmit = event => {
      event.preventDefault();
      axios.post(`/api/login`,  user )
        .then(res => {
          console.log(res);
          console.log(res.data);
          if(res.data.status===true){
            props.onCloseModal()
            setUser({
              email: '',
              password: ''
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
            alert(JSON.stringify(res.data.error));
          }
        })
    }

  return (
    <>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body>
          <form className="login_form_wrapper" onSubmit={handleSubmit} >

            <center><h3>Login</h3></center>

            <div className="form-group">
                <label>Email/Username</label>
                <input className="form-control" type="text" name="email" placeholder="Enter email/username" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" name="password" placeholder="Enter password" onChange={handleInputChange} required />
            </div>

            <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
            
            <div class="or-container">
              <div class="line-separator"></div>
              <div class="or-label">or</div>
              <div class="line-separator"></div>
            </div>

            <Login/>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginForm