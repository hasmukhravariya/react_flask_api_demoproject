import React from 'react';
import { useHistory } from "react-router";
import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';
import axios from "axios";

const clientId =
  '26093647913-g8j9tn1n623u0ub1umbebaen76qjh886.apps.googleusercontent.com';

function Login() {
  const history = useHistory();
  const onSuccess = (res) => {
    const user={
      type:"google",
      user:{
        name:res.profileObj.name,
        email:res.profileObj.email,
        image:res.profileObj.imageUrl
      }
    }
    console.log(user)
    axios.post(`/api/register`,  user )
      .then(res => {
        console.log(res);
        console.log(res.data);
        if(res.data.status===true){
          const loggeduser={
            email:false,
            google:true,
            data:res.data.result
          }
          localStorage.setItem('user', JSON.stringify(loggeduser))
          history.push({
            pathname:  "/home"
         });
        }
        else{
          alert(JSON.stringify(res.data.errors));
        }
      })
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login.`
    );
  };

  return (
    <div align="center">
      <GoogleLogin
        clientId={clientId}
        // render={renderProps => (
        //   <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn btn-dark btn-lg btn-block">
        //   Login With Google Account
        //   </button>
        // )}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        // isSignedIn={true}
      />
    </div>
  );
}

export default Login;