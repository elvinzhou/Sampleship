import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import {AuthProvider} from './components/AuthContext/authContext.js'

ReactDOM.render(
  <BrowserRouter>
  <AuthProvider>
      <App />
  </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
