import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import AdminPanel from './components/AdminPanel/AdminPanel.tsx';
import SignUp from './components/SignUp/SignUp.tsx';
import Login from './components/Login/Login.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute
        element={<App />}
        redirectPath="/" 
      />
    )
  },
  {
    path: "/adminpanel",
    element: (
      <PrivateRoute
        element={<AdminPanel />}
        redirectPath="/" 
        allowedEmail="lukavardanidze@gmail.com" // Pass the allowed email
      />
    )
  }
]);

const Root = () => (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
