import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import ProfilePictureUpload from "./components/ProfilePictureUpload/ProfilePictureUpload";
import Table from "./components/Table/Table";
import { useNavigate } from 'react-router-dom';
import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';


const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const fetchData = async () => {
    try {
      const usernameToUpdate = 'aaa'
      const response = await fetch(`https://analog-pilot-432306-v2.oa.r.appspot.com/api/users/${usernameToUpdate}/history`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  
  fetchData();
  

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);

      console.log("User ID:", user.uid);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        console.log("User Data:", data); 

        if (data && data.username) {
          setUsername(data.username); 
        } else {
          console.error("No username found for this user.");
          setUsername('No username found');
        }
      });
    } else {
      console.error("No authenticated user found.");
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Toastify({
        text: "Logged Out Successfully!",
        duration: 1700,
        backgroundColor: "black",
        stopOnFocus: true
    }).showToast();
      navigate('/'); 
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const tableData: string[][] = [
    ["Great job", "100", "2024-08-12", "10"],
    ["Good effort", "80", "2024-08-11", "8"],
    ["Needs improvement", "60", "2024-08-10", "6"],
  ];

  return (
    <div className="border p-5 w-screen h-screen flex flex-row">
      <div className="border w-[20%] p-5 bg-custom-blue ">
        <div className="flex flex-column justify-between items-center">
          <ProfilePictureUpload />
          <div>
            <p className='font-semibold mr-9'>
              {username ? username : 'Loading...'}
            </p>
          </div>
        </div>
        <button
              onClick={handleSignOut}
              className="bg-black text-white px-4 py-2 rounded mt-2"
            >
              Sign Out
            </button>
        <div className='mt-2'>
          <div>
            <span className='font-semibold'>My Aura: </span>
          </div>
          <div className='mt-1'>
            <span className='font-semibold'>Current Stats: </span>
          </div>
        </div>
        
      </div>
      <div className="w-[80%]">
        <Table headers={['Comment', 'Current Aura', 'Date', 'Point']} data={tableData} />
      </div>
    </div>
  );
};


export default App;
