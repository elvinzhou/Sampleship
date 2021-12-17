import './App.css';
import * as React from 'react';
import {useAuthState} from './components/AuthContext/authContext.js'
import FullPageSpinner from './components/lib.js'
import AuthenticatedApp from './authenticated-app'
const Login = React.lazy(() => import('./components/Login/login'))
function App() {
  const user = useAuthState();
    return (
      <React.Suspense fallback={<FullPageSpinner />}>
        {user ? <AuthenticatedApp /> : <Login />}
      </React.Suspense>
    )  }
export default App;
