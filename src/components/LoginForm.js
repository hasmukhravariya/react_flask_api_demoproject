import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import Login from "./Login";
import Modal from "react-bootstrap/Modal"
import { gql, useMutation } from '@apollo/client';

const CHECK_USER = gql`
  mutation($checkUserInput: checkinuser!){
    checkUser(input: $checkUserInput) {
      status,
      error,
      result {
        id, 
        name,
        password,
        email,
        username,
        image,
        address,
        phone
      }
    }
  }
`;


function LoginForm(props){

  const divProps = Object.assign({}, props);
  delete divProps.CloseModal;

  const history = useHistory();
  const[user,setUser]=useState({
      email: '',
      password: ''
    });

  const [checkUser] = useMutation(CHECK_USER,{
    onCompleted({ checkUser }) {
      if (checkUser) {
        check(checkUser)
      }
    }
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
        ...prevState,
        [name]: value
    }));
  };

  const check=(input)=>{
    // console.log(input);
    if(input.status===true){
      // console.log("called")
      props.CloseModal()
      setUser({
        email: '',
        password: ''
      })
      const user={
        email:true,
        google:false,
        data:input.result
      }
      localStorage.setItem('user', JSON.stringify(user))
      history.push({
        pathname:  "/home",
     });
    }
    else if(input.status===false){
      alert(JSON.stringify(input.error));
    }  
  }

  const handleSubmit = event => {
    event.preventDefault();
    // console.log(user)
    const send={
      variables: { 
        checkUserInput: user
      }
    }
    // console.log(send)
    checkUser(send);
  }

  return (
    <>
      <Modal {...divProps} aria-labelledby="contained-modal-title-vcenter" centered>
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
            
            <div className="or-container">
              <div className="line-separator"></div>
              <div className="or-label">or</div>
              <div className="line-separator"></div>
            </div>

            <Login/>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginForm