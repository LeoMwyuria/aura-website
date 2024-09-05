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
import VerifyEmail from './pages/VerifyEmail/VerifyEmail.tsx';
import DetermineYourAura from './pages/DetermineAura/DetermineAura.tsx';
import { getDatabase, onValue, ref } from 'firebase/database';
import LeaderboardLoggedIn from './pages/Leaderboard/LeaderboardLoggedIn.tsx';

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
    path: "/leaderboard",
    element: (
      <PrivateRoute
        element={<LeaderboardLoggedIn />}
        redirectPath="/leaderboards"
        condition={(user) => !user.emailVerified} 
      />
    )
  },
  {
    path: "/login",
    element: <Login />
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
    path: "/signup",
    element: <SignUp />
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
