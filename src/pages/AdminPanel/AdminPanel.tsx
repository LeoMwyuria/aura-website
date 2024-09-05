import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
// import ProfilePictureUpload from '../../components/ProfilePictureUpload/ProfilePictureUpload';
import Button from '../../components/Button/Button';

enum AdminAction {
  None,
  UpdateAura,
  BanUser,
}

const AdminPanel: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [usernameToUpdate, setUsernameToUpdate] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [adminAction, setAdminAction] = useState<AdminAction>(AdminAction.None);
  const navigate = useNavigate();

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
      
      
      setUsernameToUpdate('');
      setComment('');
      setPoints(0);
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

  const handleBanUser = async () => {
    try {
      const response = await fetch(`https://analog-pilot-432306-v2.oa.r.appspot.com/api/users/${usernameToUpdate}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      const result = await response.json();
      console.log('User banned successfully:', result);
      Toastify({
        text: "User Banned Successfully!",
        duration: 1700,
        backgroundColor: "red",
        stopOnFocus: true
      }).showToast();
    } catch (error) {
      console.error('Error:', error);
      Toastify({
        text: "Failed to Ban User",
        duration: 1700,
        backgroundColor: "red",
        stopOnFocus: true
      }).showToast();
    }
  };

  useEffect(() => {
    
    if (adminAction === AdminAction.UpdateAura) {
      setUsernameToUpdate('');
      setComment('');
      setPoints(0);
    }
  }, [adminAction]);

  return (
    <div className="border p-5 w-screen h-screen flex flex-row">
      <div className="border w-[20%] p-5 bg-custom-blue">
        <div className="flex flex-column justify-between items-center">
          {/* <ProfilePictureUpload /> */}
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
          <p className='font-semibold'>Admin Tools</p>
          <div className='flex flex-col'>
            <Button
              label='Update Aura'
              onClick={() => setAdminAction(AdminAction.UpdateAura)}
              className={`p-2 rounded ${adminAction === AdminAction.UpdateAura ? 'bg-white text-black' : 'bg-black text-white'} mt-2`}
            />
            <Button
              label='Ban User'
              onClick={() => setAdminAction(AdminAction.BanUser)}
              className={`p-2 rounded ${adminAction === AdminAction.BanUser ? 'bg-white text-black' : 'bg-black text-white'} mt-2`}
            />
          </div>
        </div>
      </div>
      <div className="w-[80%] p-4 flex flex-col items-center justify-center">
        {adminAction === AdminAction.UpdateAura && (
          <div className='flex flex-row justify-between border w-[80%]'>
            <div className='bg-gray-200 p-2 border-b border-b-gray-500'>
              <span className="w-1/4 font-semibold">Target Username </span>
              <input
                type="text"
                value={usernameToUpdate}
                onChange={(e) => setUsernameToUpdate(e.target.value)}
                className="p-2 w-[60%] mt-2 bg-gray-200"
                placeholder="Enter the username"
              />
            </div>
            <div className='bg-gray-200 p-2 border-b border-b-gray-500'>
              <span className='font-semibold'>Comment </span>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 w-[70%] mt-2 bg-gray-200"
                placeholder="Enter a comment"
              />
            </div>
            <div className='bg-gray-200 p-2 border-b border-b-gray-500'>
              <span className='font-semibold'>Points </span>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="p-2 w-[70%] mt-2 bg-gray-200"
                placeholder="Enter the aura points"
              />
            </div>
          </div>
        )}
        {adminAction === AdminAction.BanUser && (
          <div className='flex flex-row justify-between border w-[80%]'>
            <div className='bg-gray-200 p-2 border-b border-b-gray-500 ml-auto mr-auto'>
              <span className="w-1/4 font-semibold">Target Username </span>
              <input
                type="text"
                value={usernameToUpdate}
                onChange={(e) => setUsernameToUpdate(e.target.value)}
                className="p-2 w-[60%] mt-2 bg-gray-200"
                placeholder="Enter the username"
              />
            </div>
          </div>
        )}
        {adminAction === AdminAction.UpdateAura && (
          <button
            onClick={handlePostRequest}
            className="bg-black w-[15%] text-white px-4 py-2 rounded mt-2"
          >
            Update Aura
          </button>
        )}
        {adminAction === AdminAction.BanUser && (
          <button
            onClick={handleBanUser}
            className="bg-black w-[15%] text-white px-4 py-2 rounded mt-4"
          >
            Ban User
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
