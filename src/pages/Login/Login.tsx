import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebase';
import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import LogInHeader from '../../components/Header/LogInHeader';
import emailIcon from '../../assets/emailIcon.png';
import passwordIcon from '../../assets/passwordIcon.png';

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
                backgroundColor: "#DA58CD",
                stopOnFocus: true
            }).showToast();

            setLoginError(null);
        } catch (error: any) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Error logging in:', errorMessage);

            Toastify({
                text: `Error: ${errorMessage}`,
                duration: 3000,
                backgroundColor: "#DA58CD",
                stopOnFocus: true
            }).showToast();

            setLoginError('Your email or password is incorrect');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
        <LogInHeader />
        <div className="ml-auto mr-auto mt-5 p-10 w-[80%] min-h-[80vh] flex flex-row items-center justify-between">
            <div className="bg-white border-gray-400 shadow-custom w-[40%] flex flex-col justify-center p-8 rounded-3xl mx-auto">
                <h2 className="text-3xl mb-8 mx-auto font-bold">Your Aura is Waiting...</h2>
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
                        } else if (values.password.length < 8) {
                            errors.password = 'Password must be at least 8 characters';
                        }
                        return errors;
                    }}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting, isValid, dirty }) => (
                        <Form className="flex flex-col">
                            <label className="mb-3 font-bold" htmlFor="email">Email</label>
                            <div className="relative flex items-center mb-5 p-3 border border-gray-400 shadow-custom rounded-3xl">
                                <img src={emailIcon} alt="Email Icon" className="h-5 w-5 mr-2" />
                                <Field
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="w-full focus:outline-none"
                                    placeholder="address@site.com"
                                />
                                <ErrorMessage name="email" component="div" className="absolute -bottom-6 left-0 text-red-500 text-sm" />
                            </div>

                            <label className="mb-3 font-bold" htmlFor="password">Password</label>
                            <div className="relative flex items-center mb-5 p-3 border border-gray-400 shadow-custom rounded-3xl">
                                <img src={passwordIcon} alt="Password Icon" className="h-5 w-5 mr-2" />
                                <Field
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="w-full focus:outline-none"
                                    placeholder="Minimum 8 Characters"
                                />
                                <ErrorMessage name="password" component="div" className="absolute -bottom-6 left-0 text-red-500 text-sm" />
                            </div>

                            {loginError && <div className="text-red-500 mb-4">{loginError}</div>}
                            {isSubmitting && <div className="text-gray-500 mb-4">Logging in...</div>}
                            <button
                                type="submit"
                                className={`p-3 rounded-3xl mt-3 mb-4 ${dirty && isValid ? 'bg-login-btn-active' : 'bg-login-btn-default'} text-white`}
                                disabled={isSubmitting}
                            >
                                Continue
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
        </>
    );
};

export default Login;
