import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.tsx';
import SignUp from './pages/SignUp/SignUp.tsx';
import Login from './pages/Login/Login.tsx';
import WelcomePage from './pages/WelcomePage/WelcomePage.tsx';
import Leaderboard from './pages/Leaderboard/Leaderboard.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />
  },
  {
    path: "/leaderboards",
    element: <Leaderboard />
  },
  {
    path: "/login",
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
        allowedEmail="admin@gmail.com" 
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
