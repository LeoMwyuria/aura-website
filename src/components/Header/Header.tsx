import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import AuraNet from '../../assets/GlamouraLogo.png';
import userPurple from '../../assets/userPurple.png';
import ProfilePictureUpload from '../ProfilePictureUpload/ProfilePictureUpload';
import { firestore } from '../../firebase';
import editProfile from '../../assets/user-edit.png';
import logOutIcon from '../../assets/logOut.png';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const auth = getAuth();
  const db = getDatabase();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(firestore, `users/${user.uid}`);
          const snapshot = await getDoc(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.data();
            setProfilePicUrl(userData.profilePicture || userPurple);
          } else {
            setProfilePicUrl(userPurple);
          }

          const usernameRef = ref(db, `users/${user.uid}/username`);
          const usernameSnapshot = await get(usernameRef);
          if (usernameSnapshot.exists()) {
            setUserName(usernameSnapshot.val());
          } else {
            setUserName(user.email);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName(user.email);
          setProfilePicUrl(userPurple);
        }
      } else {
        setUserName(null);
        setProfilePicUrl(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db, firestore]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const toLeaderboardsClick = () => {
    navigate('/leaderboard');
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openProfilePicModal = () => {
    setIsProfilePicModalOpen(true);
    setIsMenuOpen(false);
  };

  const updateProfilePicUrl = (newUrl: string) => {
    console.log('Updating profile picture URL:', newUrl);
    setProfilePicUrl(newUrl);
  };

  const toLoginClick = () => {
    navigate('/login');
  };

  const toSignUpClick = () => {
    navigate('/signup');
  };

  const renderMenu = () => (
    <div className="py-2">
      {isMobile && (
        <>
        <a
            onClick={handleLogoClick}
            className="block text-gray-800 font-semibold text-lg py-2 hover:bg-gray-100 cursor-pointer"
          >
            Dashboard
          </a>
          <a
            onClick={toLeaderboardsClick}
            className="block text-gray-800 font-semibold text-lg py-2 hover:bg-gray-100 cursor-pointer"
          >
            Leaderboards
          </a>
          <a className="block text-gray-800 font-semibold text-lg py-2 hover:bg-gray-100 cursor-pointer">
            Monthly Ranking
          </a>
          <a className="block text-gray-800 font-semibold text-lg py-2 hover:bg-gray-100 cursor-pointer">
            Top Aura Moments
          </a>
        </>
      )}
      <div onClick={openProfilePicModal} className="flex items-center text-lg py-2 hover:bg-gray-100 cursor-pointer">
        <img src={editProfile} alt="Edit Profile" className="w-5 h-5 mr-2" />
        <span className="text-gray-800">Change Picture</span>
      </div>
      <div onClick={handleLogoutClick} className="flex items-center text-lg py-2 hover:bg-gray-100 cursor-pointer">
        <img src={logOutIcon} alt="Log Out" className="w-5 h-5 mr-2" />
        <span className="text-gray-800">Log Out</span>
      </div>
    </div>
  );

  return (
    <>
      <header className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 bg-white border-b border-gray-300">
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto mb-4 sm:mb-0">
          <img
            src={AuraNet}
            alt="Website Logo"
            className="h-8 sm:h-10 cursor-pointer mb-2 sm:mb-0"
            onClick={handleLogoClick}
          />
          <nav className="hidden sm:flex space-x-4 ml-4">
            <a
              onClick={toLeaderboardsClick}
              className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer"
            >
              Leaderboards
            </a>
            <a className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer">
              Monthly Ranking
            </a>
            <a className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer">
              Top Aura Moments
            </a>
          </nav>
        </div>

        <div className="flex items-center relative">
          {userName ? (
            <>
              <span className="text-black font-semibold text-sm sm:text-base">{userName}</span>
              <img
                src={profilePicUrl || userPurple}
                alt="User Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 ml-2 sm:ml-4 cursor-pointer rounded-full"
                onClick={toggleMenu}
              />
              {isMenuOpen && !isMobile && (
                <div
                  ref={menuRef}
                  className="p-3 absolute right-0 mt-10 sm:mt-[100%] w-40 sm:w-48 bg-white border-2 border-gray-300 rounded-3xl shadow-lg font-bold"
                >
                   <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-2 right-2 text-gray-600 bg-transparent border-none cursor-pointer"
            >
              &times;
            </button>
                  {renderMenu()}
                </div>
              )}
            </>
          ) : (
            <div className="flex space-x-2 sm:space-x-4">
              <a
                onClick={toLoginClick}
                className="text-black font-semibold hover:cursor-pointer hover:text-custom-purple text-sm sm:text-base"
              >
                Log In
              </a>
              <a
                onClick={toSignUpClick}
                className="text-white font-semibold bg-gradient-custom text-xs sm:text-sm flex items-center px-2 sm:px-3 py-1 rounded-2xl hover:cursor-pointer hover:text-black"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </header>

      {isMenuOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center sm:hidden">
          <div
            ref={menuRef}
            className={`bg-white w-4/5 rounded-3xl p-4 transform transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-2 right-2 text-gray-600 bg-transparent border-none cursor-pointer"
            >
              &times;
            </button>
            {renderMenu()}
          </div>
        </div>
      )}

      <ProfilePictureUpload
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        onProfilePicChange={updateProfilePicUrl}
      />
    </>
  );
};

export default DashboardHeader;