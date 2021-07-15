import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import Login from "./Login";

const LoginForm =props=>{

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
     <form onSubmit={handleSubmit} className="login_form_wrapper">

        <h3>Login</h3>

        <div className="form-group">
            <label>Email/Username</label>
            <input type="text" name="email" className="form-control" placeholder="Enter email/username" onChange={handleInputChange} required />
        </div>

        <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={handleInputChange} required />
        </div>

        <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
        
        <div class="or-container">
          <div class="line-separator"></div>
          <div class="or-label">or</div>
          <div class="line-separator"></div>
        </div>

        <Login/>
    </form>
  );
}

export default LoginForm