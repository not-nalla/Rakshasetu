import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './context/UserContext';
import { AlertProvider } from './context/AlertContext';
import { RegistrationsProvider } from './context/RegistrationsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AlertProvider>
          <RegistrationsProvider>
            <App />
          </RegistrationsProvider>
        </AlertProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
