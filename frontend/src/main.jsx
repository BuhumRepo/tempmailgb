import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NoteMail from './NoteMail';
import './index.css';

// Simple routing based on pathname
const path = window.location.pathname;
const AppComponent = path === '/notemail' || path.startsWith('/notemail/') ? NoteMail : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>
);
