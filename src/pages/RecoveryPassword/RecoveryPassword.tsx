import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import LogInHeader from '../../components/Header/LogInHeader';
import emailIcon from '../../assets/emailIcon.png';

const RecoverPassword: React.FC = () => {
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const navigate = useNavigate(); 

    const handlePasswordReset = async (email: string) => {
        try {
            const auth = getAuth(app);
            await sendPasswordResetEmail(auth, email);

            Toastify({
                text: "Password reset email sent! Please check your inbox.",
                duration: 3000,
                backgroundColor: "#DA58CD",
                stopOnFocus: true,
            }).showToast();

            setEmailSent(true);
        } catch (error: any) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Error sending password reset email:', errorMessage);

            Toastify({
                text: `Error: ${errorMessage}`,
                duration: 3000,
                backgroundColor: "#DA58CD",
                stopOnFocus: true
            }).showToast();
        }
    }

    return (
        <>
            <LogInHeader />
            <div className="ml-auto mr-auto mt-5 p-10 w-[80%] min-h-[80vh] flex flex-row items-center justify-between">
                <div className="bg-white border-gray-400 shadow-custom w-[40%] flex flex-col justify-center p-8 rounded-3xl mx-auto">
                    <h2 className="text-3xl mb-8 mx-auto font-bold">Recover Your Password</h2>
                    {emailSent ? (
                        <div className="text-center">
                            <p className="text-green-500 mb-4">Check your email for the password reset link.</p>
                            
                            <button
                                className="bg-login-btn-active p-3 rounded-3xl text-white cursor-pointer"
                                onClick={() => navigate('/login')}
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <Formik
                            initialValues={{ email: '' }}
                            validate={values => {
                                const errors: { email?: string } = {};
                                if (!values.email) {
                                    errors.email = 'Required';
                                } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                                    errors.email = 'Invalid email address';
                                }
                                return errors;
                            }}
                            onSubmit={(values) => {
                                handlePasswordReset(values.email);
                            }}
                        >
                            {({ isSubmitting, isValid, dirty }) => (
                                <Form className="flex flex-col">
                                    <label className="mb-3 font-bold" htmlFor="email">Email Address</label>
                                    <div className="relative flex items-center mb-5 p-3 border border-gray-400 shadow-custom rounded-3xl">
                                        <img src={emailIcon} alt="Email Icon" className="h-5 w-5 mr-2" />
                                        <Field
                                            id="email"
                                            type="email"
                                            name="email"
                                            className="w-full focus:outline-none"
                                            placeholder="Enter your email address"
                                        />
                                        <ErrorMessage name="email" component="div" className="absolute -bottom-6 left-0 text-red-500 text-sm" />
                                    </div>

                                    <button
                                        type="submit"
                                        className={`p-3 rounded-3xl mt-3 mb-4 ${dirty && isValid ? 'bg-login-btn-active cursor-pointer' : 'bg-login-btn-default cursor-not-allowed'} text-white`}
                                        disabled={isSubmitting || !isValid || !dirty}
                                    >
                                        Send Password Reset Email
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </>
    );
};

export default RecoverPassword;
