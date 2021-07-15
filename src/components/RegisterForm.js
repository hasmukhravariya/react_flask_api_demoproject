import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";

const Register = props => {
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
        axios.post(`/api/register`,  state )
          .then(res => {
            console.log(res);
            console.log(res.data);
            if(res.data.status===true){
              props.onCloseModal()
              setState({
                email: '',
                username: '',
                password: '',
                name:'',
              })
              history.push({
                pathname:  "/home",
                state: res.data.result
             });
            }
            else{
              alert(JSON.stringify(res.data.errors));
              // let type=typeof res.data.errors
              // if(type==="string"){
              //   alert(JSON.stringify(res.data.errors));
              //   changeModel()
              // }else{
              //   alert(JSON.stringify(res.data.errors.password));
              // }
            }
          })
    }

  return (
    <form class="register_form_wrapper" onSubmit={handleSubmit}>
        <h3>Register User</h3>

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
            {/*<small id="passwordHelpBlock" class="form-text text-muted">
              Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
            </small>*/}
        </div>

        <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
        <p className="forgot-password text-right">
            Already registered <a href="#" onClick={changeModel}>login?</a>
        </p>
    </form>
  );
}

export default Register