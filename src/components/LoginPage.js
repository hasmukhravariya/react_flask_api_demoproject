import React from "react";
import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import logo from '../logo.svg';
import Navbar from "./Navbar"


const LoginPage=props=>{

  const history = useHistory();
  const [user, setUser] = useState()

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  if(user){
    history.push({
        pathname:  "/home"
     });
  }

  return (
    <div>
      <Navbar page="loginPage"/>
      <div className="header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Demo Project Using React and Flask Api
        </p>
      </div>
    </div>
  );

}

export default LoginPage