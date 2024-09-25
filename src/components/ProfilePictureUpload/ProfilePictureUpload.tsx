import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { storage, firestore } from '../../firebase';
import defaultProfilePic from '../../assets/profile-picture.png'; 
import { getAuth } from 'firebase/auth';
import Toastify from 'toastify-js';
import Modal from '../Modal/Modal';

interface ProfilePictureUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onProfilePicChange: (newUrl: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ isOpen, onClose, onProfilePicChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      if (user) {
        const userDocRef = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFile(data.profilePicture || defaultProfilePic); 
        } 
      }
    };
    fetchUserProfilePicture();
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

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
        handleClose(); 
        const userDocRef = doc(firestore, `users/${user.uid}`);
        await setDoc(userDocRef, { profilePicture: url }, { merge: true });
        Toastify({
          text: "Profile Picture Changed Successfully!",
          duration: 2200,
          backgroundColor: "#DA58CD",
          stopOnFocus: true
        }).showToast();
        onProfilePicChange(url); 
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); 
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={`flex flex-col items-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className="text-xl font-semibold mb-4 text-center">Upload Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Upload
        </button>
      </div>
    </Modal>
  );
};

export default ProfilePictureUpload;