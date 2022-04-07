import React from 'react';
import GoogleLogin from 'react-google-login';
import { useAuthState } from '../AuthContext/authContext.js'

const ck = require('ckey');

export default function Login(){

const { handleLogin } = useAuthState();
console.log("Not Logged In");
const gcid = ck.REACT_APP_GOOGLE_CLIENT_ID;
return (
<div className="container centered justify-content-center">
<div className="col-xs-1 col-md-8">
   <div className="row text-center justify-content-center">
    <h1>Please Log In</h1>

    </div>
    <GoogleLogin
    clientId= {gcid}
    buttonText="Log in with Google"
    onSuccess={handleLogin}
    onFailure={responseFailed}
    cookiePolicy={'single_host_origin'}
    hosted_domain={'vibecartons.com'}
    isSignedIn={true}
/>
    </div>
    </div>
  )
}

const responseFailed = (response) => {
  console.log('Sign-in Failed');
  console.log(response);
}
