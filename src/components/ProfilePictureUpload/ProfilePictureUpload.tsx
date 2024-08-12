import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { storage, firestore } from '../../firebase';
import defaultProfilePic from '../../assets/profile-picture.png'; 
import { getAuth } from 'firebase/auth';
import Toastify from 'toastify-js';
import Modal from '../Modal/Modal';


const ProfilePictureUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      if (user) {
        const userDocRef = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setImageUrl(data.profilePicture || defaultProfilePic);
        } else {
          setImageUrl(defaultProfilePic);
        }
      } else {
        setImageUrl(defaultProfilePic);
      }
    };
    fetchUserProfilePicture();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file && user) {
      const fileRef = ref(storage, `profile-pictures/${user.uid}`);
      try {
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setImageUrl(url); 
        setIsModalOpen(false); 
        const userDocRef = doc(firestore, `users/${user.uid}`);
        await setDoc(userDocRef, { profilePicture: url }, { merge: true });
        setTimeout(() => {
            Toastify({
                text: "Profile Picture Changed Successfully!",
                duration: 2200,
                backgroundColor: "black",
                stopOnFocus: true
            }).showToast();
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={imageUrl || defaultProfilePic}
        alt="Profile"
        className="w-24 h-24 mt-4 rounded-full"
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white px-4 py-2 mt-2 rounded"
      >
        Change Picture
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Upload Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </Modal>
    </div>
  );
};

export default ProfilePictureUpload;
