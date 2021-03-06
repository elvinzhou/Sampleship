import { Button } from 'antd';
import React, { useState } from 'react';
import { useAuthState } from './AuthContext/authContext.js';


export const LogoutButton = () => {

  const [loggedOut, setLoggedOut] = useState(false)

  const { logOut } = useAuthState()
  return <Button type="Primary" danger onClick={() => {logOut();setLoggedOut("true")}}>LogOut</Button>;
};
