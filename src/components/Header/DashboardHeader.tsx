import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import AuraNet from '../../assets/AuraNet.png';
import userPurple from '../../assets/userPurple.png';
import ProfilePictureUpload from '../ProfilePictureUpload/ProfilePictureUpload';
import { firestore } from '../../firebase';
import editProfile from '../../assets/user-edit.png'
import logOutIcon from '../../assets/logOut.png'
const DashboardHeader = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const auth = getAuth();
  const db = getDatabase();  

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
        setProfilePicUrl(userPurple);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, firestore, navigate]);

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

  return (
    <>
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
            <a className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer">
              Monthly Ranking
            </a>
            <a className="text-gray-800 font-semibold hover:text-custom-purple text-base hover:cursor-pointer">
              Top Aura Moments
            </a>
          </nav>
        </div>
        <div className="flex items-center relative  ">
          {userName ? (
            <>
              <span className="text-black font-semibold">{userName}</span>
              <img
                src={profilePicUrl || userPurple}
                alt="User Profile"
                className="w-10 h-10 ml-4 cursor-pointer rounded-full"
                onClick={toggleMenu}
              />
              {isMenuOpen && (
                <div className="absolute right-0 mt-[100%] w-48 bg-white border-2 border-gray-300 rounded-3xl shadow-lg font-bold">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 bg-transparent border-none cursor-pointer"
                >
                  &times;
                </button>
                <div className="py-2">
                 
                  <div className="flex items-center justify-start text-lg px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <img src={editProfile} alt="Edit Profile" className="w-5 h-5 mr-2" />
                    <a
                      onClick={openProfilePicModal}
                      className="text-gray-800"
                    >
                      Change Picture
                    </a>
                  </div>
              
                  
                  <div className="flex items-center justify-start text-lg px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <img src={logOutIcon} alt="Log Out" className="w-5 h-5 mr-2" />
                    <a
                      onClick={handleLogoutClick}
                      className="text-gray-800"
                    >
                      Log Out
                    </a>
                  </div>
                </div>
              </div>
              
              )}
            </>
          ) : (
            <span className="text-black font-semibold">Loading...</span>
          )}
        </div>
      </header>
      <ProfilePictureUpload
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        onProfilePicChange={updateProfilePicUrl}
      />
    </>
  );
};

export default DashboardHeader;
