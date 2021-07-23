import { forwardRef, useImperativeHandle } from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useHistory } from "react-router";

const clientId =
  '26093647913-g8j9tn1n623u0ub1umbebaen76qjh886.apps.googleusercontent.com';

const LogoutHooks=forwardRef((props, ref)=> {
  const history = useHistory();

  const onLogoutSuccess = (res) => {
    // console.log('Logged out Success');
    localStorage.clear();
    history.push({
        pathname:  "/"
     });
  };

  const onFailure = () => {
    // console.log('Handle failure cases');
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  useImperativeHandle(
        ref,
        () => ({
            Success(){
                signOut()
              }
        }),
    )

  return (null);
})

export default LogoutHooks;