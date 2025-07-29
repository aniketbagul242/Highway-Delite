
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import StoreContextProvider from './context/StoreContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
  <StoreContextProvider>
      <BrowserRouter> 
      <GoogleOAuthProvider clientId="607993263465-35jv8fsnesivdlqfe3vi82btr7a5asc5.apps.googleusercontent.com"  >
  <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
      </StoreContextProvider>

);
