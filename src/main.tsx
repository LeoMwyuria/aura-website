import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.tsx';
import SignUp from './pages/SignUp/SignUp.tsx';
import Login from './pages/Login/Login.tsx';
import WelcomePage from './pages/WelcomePage/WelcomePage.tsx';
import Leaderboard from './pages/Leaderboard/Leaderboard.tsx';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail.tsx';
import DetermineYourAura from './pages/DetermineAura/DetermineAura.tsx';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RecoverPassword from './pages/RecoveryPassword/RecoveryPassword.tsx';

const RootRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <WelcomePage />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />
  },
  {
    path: "/leaderboard",
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
    path: "/recover-password",  
    element: <RecoverPassword />
  },
  {
    path: "/determine-aura",
    element: (
      <PrivateRoute
        element={<DetermineYourAura />}
        redirectPath="/dashboard"
        condition={(user) => {
          const db = getDatabase();
          const userRef = ref(db, 'users/' + user.uid);
          let auraDetermined = false;
  
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            auraDetermined = !!data.aura;
          });
  
          return user.emailVerified && !auraDetermined; 
        }}
      />
    )
  },
  {
    path: "/verify-email",
    element: (
      <PrivateRoute
        element={<VerifyEmail />}
        redirectPath="/dashboard"
        condition={(user) => !user.emailVerified} 
      />
    )
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute
        element={<App />}
        redirectPath="/" 
        requireEmailVerified={true} 
      />
    )
  },
  {
    path: "/adminpanel",
    element: (
      <PrivateRoute
        element={<AdminPanel />}
        redirectPath="/" 
        allowedEmail="hellopantha80@gmail.com" 
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
