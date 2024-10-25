import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import userIcon from '../../assets/userIcon.png';
import emailIcon from '../../assets/emailIcon.png';
import passwordIcon from '../../assets/passwordIcon.png';
import { app } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref,  set } from "firebase/database";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import SignUpHeader from '../../components/Header/SignUpHeader';
import lionImage from '../../assets/lion.png'

interface FormValues {
    email: string;
    password: string;
    repeatPassword: string;
    username: string;
}

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getDatabase(app);

    const handleSignUp = async (values: FormValues) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
    
            
            await set(ref(db, `users/${user.uid}`), {
                email: values.email,
                username: values.username,
            });
    
           
            await sendEmailVerification(user);
    
            
            const apiUrl = `https://aura-api-519230006497.europe-west2.run.app/new-user/${values.username}`;
            const postData = {
                username: values.username,
                unique_id: user.uid,  
                current_aura: 0,
                peek_aura: 0,
                friends: [],
                dispute: 0,
            };
    
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!apiResponse.ok) {
                throw new Error('API call failed');
            }
            
            Toastify({
                text: "Registration successful! Please verify your email.",
                duration: 2000,
                backgroundColor: "#DA58CD",
                stopOnFocus: true,
            }).showToast();
    
            navigate('/verify-email');
    
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Error registering user:', errorMessage);
    
            Toastify({
                text: `Error: ${errorMessage}`,
                duration: 3000,
                backgroundColor: "#DA58CD",
                stopOnFocus: true,
            }).showToast();
        }
    };
    
    
    
    return (
        <>
            <SignUpHeader />
            <div className="mx-auto mt-5 p-4 sm:p-6 md:p-8 lg:p-10 w-full sm:w-[90%] md:w-[80%] min-h-[80vh] flex  items-center justify-center">
                <div className="bg-white border-gray-400 shadow-custom w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] flex flex-col justify-center p-4 sm:p-6 md:p-8 rounded-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8 mx-auto font-bold">Get Started</h2>
                    <Formik
                        initialValues={{ email: '', password: '', repeatPassword: '', username: '' }}
                        validate={values => {
                            const errors: Partial<FormValues> = {};
                            if (!values.username) {
                                errors.username = 'Required';
                            } else if (values.username.length > 20) {
                                errors.username = 'Username must be less than 20 characters';
                            }
                            if (!values.email) {
                                errors.email = 'Required';
                            } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                                errors.email = 'Invalid email address';
                            }
                            if (!values.password) {
                                errors.password = 'Required';
                            } else if (values.password.length < 8) {
                                errors.password = 'Password must be at least 8 characters';
                            }
                            if (!values.repeatPassword) {
                                errors.repeatPassword = 'Required';
                            } else if (values.repeatPassword !== values.password) {
                                errors.repeatPassword = 'Passwords do not match';
                            }
                            return errors;
                        }}
                        onSubmit={handleSignUp}
                    >
                        {({ isSubmitting, isValid, dirty }) => (
                            <Form className='flex flex-col'>
                                <label className="mb-2 sm:mb-3 font-bold" htmlFor="username">Full Name</label>
                                <div className="relative flex items-center mb-4 sm:mb-5 p-2 sm:p-3 border border-gray-400 shadow-custom rounded-3xl">
                                    <img src={userIcon} alt="User Icon" className="mr-2 w-4 sm:w-5" />
                                    <Field
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Third Thimbleton"
                                        className="w-full focus:outline-none text-sm sm:text-base"
                                    />
                                    <ErrorMessage name="username" component="div" className="absolute -bottom-5 text-red-500 text-xs sm:text-sm" />
                                </div>

                                <label className="mb-2 sm:mb-3 font-bold" htmlFor="email">Email Address</label>
                                <div className="relative flex items-center mb-4 sm:mb-5 p-2 sm:p-3 border border-gray-400 shadow-custom rounded-3xl">
                                    <img src={emailIcon} alt="Email Icon" className="mr-2 w-4 sm:w-5" />
                                    <Field
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="address@site.com"
                                        className="w-full focus:outline-none text-sm sm:text-base"
                                    />
                                    <ErrorMessage name="email" component="div" className="absolute -bottom-5 text-red-500 text-xs sm:text-sm" />
                                </div>

                                <label className="mb-2 sm:mb-3 font-bold" htmlFor="password">Password</label>
                                <div className="relative flex items-center mb-4 sm:mb-5 p-2 sm:p-3 border border-gray-400 shadow-custom rounded-3xl">
                                    <img src={passwordIcon} alt="Password Icon" className="mr-2 w-4 sm:w-5" />
                                    <Field
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Minimum 8 Characters"
                                        className="w-full focus:outline-none text-sm sm:text-base"
                                    />
                                    <ErrorMessage name="password" component="div" className="absolute -bottom-5 text-red-500 text-xs sm:text-sm" />
                                </div>

                                <label className="mb-2 sm:mb-3 font-bold" htmlFor="repeatPassword">Confirm Password</label>
                                <div className="relative flex items-center mb-4 sm:mb-5 p-2 sm:p-3 border border-gray-400 shadow-custom rounded-3xl">
                                    <img src={passwordIcon} alt="Password Icon" className="mr-2 w-4 sm:w-5" />
                                    <Field
                                        id="repeatPassword"
                                        type="password"
                                        name="repeatPassword"
                                        placeholder="Repeat Password"
                                        className="w-full focus:outline-none text-sm sm:text-base"
                                    />
                                    <ErrorMessage name="repeatPassword" component="div" className="absolute -bottom-5 text-red-500 text-xs sm:text-sm" />
                                </div>

                                <button
                                    type="submit"
                                    className={`bg-black text-white p-2 sm:p-3 rounded-3xl mt-2 mb-4 ${isValid && dirty ? 'bg-login-btn-active' : 'bg-login-btn-default cursor-not-allowed'} text-sm sm:text-base`}
                                    disabled={isSubmitting || !isValid || !dirty}
                                >
                                    Create new account
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <img className='absolute left-[60%] hidden lg:block w-[35%]' src={lionImage} alt="Lion" />
            </div>
        </>
    );
};

export default SignUp;