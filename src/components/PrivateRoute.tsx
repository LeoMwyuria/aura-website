import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

interface PrivateRouteProps {
    element: React.ReactElement;
    redirectPath?: string;
    allowedEmail?: string; // Add allowedEmail to control access
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, redirectPath = '/', allowedEmail }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAllowed, setIsAllowed] = useState<boolean>(false); // State to check email permission
    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                if (allowedEmail && user.email === allowedEmail) {
                    setIsAllowed(true);
                } else if (allowedEmail) {
                    setIsAllowed(false);
                    navigate(redirectPath);
                }
            } else {
                setIsAuthenticated(false);
                navigate(redirectPath);
            }
        });

        return () => unsubscribe();
    }, [auth, navigate, redirectPath, allowedEmail]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return isAllowed ? element : null;
};

export default PrivateRoute;
