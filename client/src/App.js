import './App.css';
import * as React from 'react';
import {useAuthState} from './components/AuthContext/authContext.js'
import FullPageSpinner from './components/lib.js'
import AuthenticatedApp from './authenticated-app'
import {GoogleOAuthProvider} from '@react-oauth/google'
const Login = React.lazy(() => import('./components/Login/login'))
function App() {
  const user = useAuthState().user;
  const ck = require('ckey');
  const gcid = ck.REACT_APP_GOOGLE_CLIENT_ID;
  console.log(user);
    return (
      <GoogleOAuthProvider clientId={gcid}>
      <React.Suspense fallback={<FullPageSpinner />}>
        {user ? <AuthenticatedApp /> : <Login />}
      </React.Suspense>
      </GoogleOAuthProvider>
    )  }
export default App;
