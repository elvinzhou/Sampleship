import * as React from 'react'
import {AuthProvider} from '../components/AuthContext/authContext.js'

function AppProviders({children}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
export default AppProviders
