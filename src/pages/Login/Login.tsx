import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Photo from '../../assets/vardana-lomi.png';
import { app } from '../../firebase';
import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = async (values: { email: string; password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            const auth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
    
            setTimeout(() => {
                if (user.email === 'admin@gmail.com') {
                    navigate('/adminpanel');
                } else {
                    navigate('/dashboard');
                }
            }, 300);
    
            Toastify({
                text: "Login successful! Redirecting...",
                duration: 1700,
                backgroundColor: "black",
                stopOnFocus: true
            }).showToast();
    
            setLoginError(null);
        } catch (error: any) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Error logging in:', errorMessage);
    
            Toastify({
                text: `Error: ${errorMessage}`,
                duration: 3000,
                backgroundColor: "black",
                stopOnFocus: true
            }).showToast();
    
            setLoginError('Your email or password is incorrect');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-200 ml-auto mr-auto mt-5 p-10 w-[80%] min-h-[80vh] flex flex-row items-center justify-between">
            <div className="w-[50%]">
                <img className='w-full' src={Photo} alt="Vardana Lomi" />
            </div>
            <div className="bg-white shadow-lg w-[40%] flex flex-col justify-center p-8 rounded-md">
                <h2 className="text-3xl mb-8">Login</h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                        const errors: { email?: string; password?: string } = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col">
                            <label className="mb-3" htmlFor="email">Email</label>
                            <Field
                                id="email"
                                type="email"
                                name="email"
                                className="mb-3 p-3 border border-gray-300 rounded"
                                placeholder="Enter your email"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 mb-4" />

                            <label className="mb-3" htmlFor="password">Password</label>
                            <Field
                                id="password"
                                type="password"
                                name="password"
                                className="mb-4 p-3 border border-gray-300 rounded"
                                placeholder="Enter your password"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 mb-4" />

                            {loginError && <div className="text-red-500 mb-4">{loginError}</div>}
                            {isSubmitting && <div className="text-gray-500 mb-4">Logging in...</div>}
                            <button
                                type="submit"
                                className="bg-black text-white p-3 rounded hover:bg-gray-800 mb-4"
                                disabled={isSubmitting}
                            >
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
                <p className="mt-4">Don't Have An Account? <span className="text-purple-500 cursor-pointer" onClick={() => navigate('/signup')}>Sign Up</span></p>
            </div>
        </div>
    );
};

export default Login;
