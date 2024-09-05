import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

interface PrivateRouteProps {
    element: React.ReactElement;
    redirectPath?: string;
    allowedEmail?: string;
    requireEmailVerified?: boolean; 
    condition?: (user: any) => boolean; 
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, redirectPath = '/', allowedEmail, requireEmailVerified = false }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAllowed, setIsAllowed] = useState<boolean>(true); 
    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await user.reload(); 
                setIsAuthenticated(true);
                
                
                if (requireEmailVerified && !user.emailVerified) {
                    setIsAllowed(false);
                    navigate(redirectPath); 
                }

                
                if (allowedEmail && user.email !== allowedEmail) {
                    setIsAllowed(false);
                    navigate(redirectPath); 
                }
            } else {
                setIsAuthenticated(false);
                navigate(redirectPath); 
            }
        });

        return () => unsubscribe();
    }, [auth, navigate, redirectPath, allowedEmail, requireEmailVerified]);

    if (isAuthenticated === null) {
        return <div></div>; 
    }

    return isAuthenticated && isAllowed ? element : null;
};

export default PrivateRoute;
