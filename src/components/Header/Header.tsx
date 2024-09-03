import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuraNet from '../../assets/AuraNet.png';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const toLoginClick = () => {
    navigate('/login');
  };

  const toSignUpClick = () => {
    navigate('/signup');
  };

  const toLeaderboardsClick = () => {
    navigate('/leaderboards');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
      <div className="flex items-center">
        <img
          src={AuraNet}
          alt="Website Logo"
          className="h-10 cursor-pointer"
          onClick={handleLogoClick}
        />
        <nav className="flex space-x-4 ml-10">
          <a
            onClick={toLeaderboardsClick}
            className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer"
          >
            Leaderboards
          </a>
          <a
            className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer"
          >
            Monthly Ranking
          </a>
          <a
            className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer"
          >
            Top Aura Moments
          </a>
        </nav>
      </div>
      <div className="flex space-x-4">
        <a
          onClick={toLoginClick}
          className="text-black font-semibold hover:cursor-pointer hover:text-custom-purple"
        >
          Log In
        </a>
        <a
          onClick={toSignUpClick}
          className="text-white font-semibold bg-gradient-custom text-sm flex items-center pl-3 pr-3 rounded-2xl hover:cursor-pointer hover:text-black"
        >
          Sign Up
        </a>
      </div>
    </header>
  );
};

export default Header;
