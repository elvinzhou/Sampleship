import { Button } from 'antd';
import React, { useState } from 'react';
import {Redirect} from "react-router-dom";

export const LogoutButton = () => {

  const [loggedOut, setLoggedOut] = useState(false)

  const logout = () => {
    localStorage.clear("token");
    setLoggedOut(true);
    fetch("/api/v1/auth/logout", {
      method:"DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify("session"),
    })

  };

  if (loggedOut) {
    return <Redirect to="/login" push={true} />
  }

  return <Button type="Primary" danger onClick={logout}>LogOut</Button>;
};
