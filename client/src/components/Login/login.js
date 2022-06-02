import {React, useEffect, useState} from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthState } from '../AuthContext/authContext.js';

const ck = require('ckey');
const gcid = ck.REACT_APP_GOOGLE_CLIENT_ID;

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default function Login() {
const { handleLogin, user, mutate } = useAuthState();
const forceUpdate = useForceUpdate();

useEffect(() => {
  if (user) {
    Router.replace("/");
    console.log(user);
  }
}, [user]);
console.log(user);
return (
<div className="container centered justify-content-center">
<div className="col-xs-1 col-md-8">
   <div className="row text-center justify-content-center">
    <h1>Please Log In</h1>

    </div>
    <GoogleOAuthProvider clientId={gcid}>
    <GoogleLogin
    onSuccess={(response) => {handleLogin(response); forceUpdate()}}
    onError={responseFailed}
    hosted_domain={'vibecartons.com'}
    auto_select
    useOneTap
    />
    </GoogleOAuthProvider>
    </div>
    </div>
  )
}

const responseFailed = (response) => {
  console.log('Sign-in Failed');
  console.log(response);
}
