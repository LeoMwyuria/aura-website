import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import ProfilePictureUpload from '../../components/ProfilePictureUpload/ProfilePictureUpload';
import Button from '../../components/Button/Button';

const AdminPanel: React.FC = () => {
  const [usernameToUpdate, setUsernameToUpdate] = useState<string>(''); 
  const [comment, setComment] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user found.");
      navigate('/'); 
    }
  }, [navigate]);

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

  const handlePostRequest = async () => {
    const now = new Date();
    const currentDate = now.toISOString();

    try {
      const response = await fetch(`https://analog-pilot-432306-v2.oa.r.appspot.com/api/users/${usernameToUpdate}/update-aura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          points: points,
          date: currentDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const result = await response.json();
      console.log('Success:', result);
      Toastify({
        text: "User Aura Updated Successfully!",
        duration: 1700,
        backgroundColor: "green",
        stopOnFocus: true
      }).showToast();
    } catch (error) {
      console.error('Error:', error);
      Toastify({
        text: "Failed to Update User Aura",
        duration: 1700,
        backgroundColor: "red",
        stopOnFocus: true
      }).showToast();
    }
  };

  return (
    <div className="border p-5 w-screen h-screen flex flex-row">
      <div className="border w-[20%] p-5 bg-custom-blue">
        <div className="flex flex-column justify-between items-center">
          <ProfilePictureUpload />
        </div>
        <button
          onClick={handleSignOut}
          className="bg-black text-white px-4 py-2 rounded mt-2"
        >
          Sign Out
        </button>
        <div className='mt-2'>
          <p className='font-semibold'>Admin Tools</p>
          <div className='flex flex-col'>
            <Button label='Update Aura'/>
            <Button label='Ban User'/>
          </div>
        </div>
      </div>
      <div className="w-[80%] border border-black p-4">
        <div className='border border-black flex flex-row justify-between'>
        <div className='bg-white p-2'>
        <span className="w-1/4 font-semibold">Target Username </span>
        <input
          type="text"
          value={usernameToUpdate}
          onChange={(e) => setUsernameToUpdate(e.target.value)}
          className="p-2 w-[60%] mt-2"
          placeholder="Enter the username"
        />
        </div>
        <div className='bg-white p-2'>
        <span className='font-semibold'>Comment </span>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className=" p-2 w-[70%] mt-2  "
          placeholder="Enter a comment"
        />
        </div>
        <div className='bg-white p-2'>
        <span className='font-semibold'>Points </span>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="p-2 w-[70%] mt-2"
          placeholder="Enter the aura points"
        />
        </div>
        </div>
        <button
          onClick={handlePostRequest}
          className="bg-black w-[15%] text-white px-4 py-2 rounded mt-2"
        >
          Update Aura
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;