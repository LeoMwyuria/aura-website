import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import picture from '../../assets/vardana-lomi.png'; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { app } from '../../firebase';

interface FormValues {
    email: string;
    password: string;
    repeatPassword: string;
}

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const toLoginClick = () => {
        navigate("/");
    };

    const handleSignUp = async (values: FormValues) => {
        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log('User registered successfully:', user);
            const db = getDatabase(app);
            navigate("/dashboard"); 
            await set(ref(db, 'users/' + user.uid), {
                email: user.email,
            })
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Error registering user:', errorMessage);
        }
    };

    return (
        <div className="bg-gray-200 ml-auto mr-auto mt-[5%] p-10 w-[80%] h-[80vh] flex flex-row items-center justify-between">
            <div className="w-[50%]">
                <img className='w-full' src={picture} alt="Sign Up" />
            </div>
            <div className="bg-white shadow-lg h-[90%] w-[40%] flex flex-col justify-center p-8 rounded-md">
                <h2 className="text-3xl mb-8">Sign Up</h2>
                <Formik
                    initialValues={{ email: '', password: '', repeatPassword: '' }}
                    validate={values => {
                        const errors: Partial<FormValues> = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        } else if (values.password.length < 6) {
                            errors.password = 'Password must be at least 6 characters';
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
                    <Form className='flex flex-col'>
                        <label className="mb-3" htmlFor="email">Email Address</label>
                        <Field
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="mb-3 p-3 border border-gray-300 rounded"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 mb-4" />

                        <label className="mb-3" htmlFor="password">Password</label>
                        <Field
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="mb-3 p-3 border border-gray-300 rounded"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 mb-4" />

                        <label className="mb-3" htmlFor="repeatPassword">Repeat Password</label>
                        <Field
                            id="repeatPassword"
                            type="password"
                            name="repeatPassword"
                            placeholder="Repeat Password"
                            className="mb-4 p-3 border border-gray-300 rounded"
                        />
                        <ErrorMessage name="repeatPassword" component="div" className="text-red-500 mb-4" />

                        <button
                            type="submit"
                            className="bg-black text-white p-3 rounded hover:bg-gray-800 mb-4"
                        >
                            Create new account
                        </button>
                    </Form>
                </Formik>
                <div className='mt-4'>
                    Already Have An Account?{' '}
                    <span
                        onClick={toLoginClick}
                        className="text-purple-500 cursor-pointer"
                    >
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
