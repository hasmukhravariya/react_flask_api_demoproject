import React from 'react';
import { useHistory } from "react-router";
import { GoogleLogin } from 'react-google-login';
// refresh token
// import { refreshTokenSetup } from '../utils/refreshToken';
import { gql, useMutation } from '@apollo/client';

const clientId =
  '26093647913-g8j9tn1n623u0ub1umbebaen76qjh886.apps.googleusercontent.com';


const USER_REGISTER = gql`
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


function Login() {
  const history = useHistory();

  const [createUser] = useMutation(USER_REGISTER,{
    onCompleted({ createUser }) {
      if (createUser) {
        // console.log(createUser)
        check(createUser)
      }
    },
    onError: (error) => console.error("Error", error),
  });

  const check=(input)=>{
    // console.log(input)
    if(input.status===true){
      const loggeduser={
        email:false,
        google:true,
        data:input.result
      }
      localStorage.setItem('user', JSON.stringify(loggeduser))
      history.push({
        pathname:  "/home"
     });
    }
    else{
      alert(JSON.stringify(input.errors));
    }
  }

  const onSuccess = (res) => {
    const user={
      type:"google",
      user:{
        name:res.profileObj.name,
        email:res.profileObj.email,
        image:res.profileObj.imageUrl
      }
    }
    // console.log(user)
    const send={
      variables: { 
        createUserInput: user
      }
    }
    // console.log(send)
    createUser(send);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
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