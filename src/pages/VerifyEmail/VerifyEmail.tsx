import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js';

const VerifyEmail: React.FC = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const checkEmailVerification = async () => {
            const user = auth.currentUser;
            if (user) {
                await user.reload(); 
                if (user.emailVerified) {
                    setIsVerified(true);
                    Toastify({
                        text: "Email verified! Redirecting to the aura selection...",
                        duration: 3000,
                        backgroundColor: "#28a745",
                        stopOnFocus: true
                    }).showToast();
                    setTimeout(() => {
                        navigate('/determine-aura'); 
                    }, 2000);
                } else {
                    setIsVerified(false);
                }
                setIsChecking(false);
            }
        };

        const intervalId = setInterval(checkEmailVerification, 3000); 

        return () => clearInterval(intervalId); 
    }, [auth, navigate]);

    return (
        <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Verify your Email</h2>
            <p className="mb-8 text-sm sm:text-base">Please check your email and verify your account before proceeding.</p>
            {!isVerified && !isChecking && (
                <p className="text-red-500 text-sm sm:text-base">Your email is not yet verified. Please check again.</p>
            )}
            {isChecking && (
                <p className="text-sm sm:text-base">Checking verification status...</p>
            )}
        </div>
    );
};

export default VerifyEmail;