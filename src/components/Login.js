import React from 'react';
import { useHistory } from "react-router";
import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';

const clientId =
  '26093647913-g8j9tn1n623u0ub1umbebaen76qjh886.apps.googleusercontent.com';

function Login() {
  const history = useHistory();
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    refreshTokenSetup(res);
    const user={
      email:false,
      google:true,
      data:res.profileObj
    }
    localStorage.setItem('user', JSON.stringify(user))
    // console.log(this.props)
    history.push({
        pathname:  "/home",
        state: res.profileObj
     });
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