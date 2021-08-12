import './App.css';
import * as React from 'react';
import {useAuthState} from './components/AuthContext/authContext.js'
import FullPageSpinner from './components/lib.js'
import {AuthProvider} from './components/AuthContext/authContext.js'
import AuthenticatedApp from './authenticated-app'
const Login = React.lazy(() => import('./components/Login/login'))
function App() {
    const user = useAuthState();
    console.log(user);
    return (
    <AuthProvider>
      <React.Suspense fallback={<FullPageSpinner />}>
        {user ? <AuthenticatedApp /> : <Login />}
      </React.Suspense>
    </AuthProvider>
    )  }
export default App;
