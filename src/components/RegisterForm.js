import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import { gql, useMutation } from '@apollo/client';

export const USER_REGISTER = gql`
  mutation($createUserInput: createUserdata!){
    createUser(input: $createUserInput) {
      status,
      errors,
      result {
        id,
        email,
        name,
        username,
        password,
        image,
        address,
        phone
      }
    }
  }
`;


function Register(props){
  const { openLogin, CloseModal, ...rest } = props
  const history = useHistory();

  const[state,setState]=useState({
    email: '',
    username: '',
    password: '',
    name:''
  });

  const [createUser] = useMutation(USER_REGISTER,{
    onCompleted({ createUser }) {
      if (createUser) {
        // console.log(createUser)
        check(createUser)
      }
    },
    // onError: (error) => console.error("Error", error),
  });

  const check=(input)=>{
    // console.log(input)
    if(input.status===true){
      CloseModal()
      setState({
        email: '',
        username: '',
        password: '',
        name:'',
      })
      const user={
        email:true,
        google:false,
        data:input.result
      }
      localStorage.setItem('user', JSON.stringify(user))
      history.push({
        pathname:  "/home",
        state: input.result
     });
    }
    else{
      alert(JSON.stringify(input.errors));
    }
  }


  const handleInputChange = (event) => {
      const { name, value } = event.target;
      setState((prevState) => ({
          ...prevState,
          [name]: value
      }));
    };

  const changeModel=()=>{
    CloseModal()
    openLogin()
  }


  const handleSubmit = event => {
    event.preventDefault();
    const user={
      type:"email",
      user:state
    }
    // console.log(user)

    const send={
      variables: { 
        createUserInput: user
      }
    }
    // console.log(send)
    createUser(send)
    }

  return (
    <Modal {...rest} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <form className="register_form_wrapper" onSubmit={handleSubmit}>
            <center><h3>Register User</h3></center>

            <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" aria-label="name" value={state.name} className="form-control" placeholder="Name" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" aria-label="username" value={state.username} className="form-control" placeholder="Username" onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" aria-label="email" value={state.email} className="form-control" placeholder="Enter email" onChange={handleInputChange} required  />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" aria-label="password" value={state.password} className="form-control" placeholder="Enter password" onChange={handleInputChange} required/>
                <small id="passwordHelpBlock" className="form-text text-muted">
                  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, one of the symbols $@#.
                </small>
            </div>

            <button type="submit" aria-label="register" className="btn btn-dark btn-lg btn-block">Register</button>
            <p className="forgot-password text-right">
                Already Registered?<Button aria-label="login" className="login_link"  varaint="secondary" onClick={changeModel}>Login</Button>
            </p>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Register