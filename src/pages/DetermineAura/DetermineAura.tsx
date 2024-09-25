import React from 'react';
import { useFormik } from 'formik';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { useNavigate } from 'react-router-dom';

const DetermineYourAura: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getDatabase();

    const formik = useFormik({
        initialValues: {
            aura: ''
        },
        onSubmit: async (values) => {
            const user = auth.currentUser;
            if (user) {
                await update(ref(db, 'users/' + user.uid), {
                    aura: values.aura,
                });
                
                navigate('/dashboard'); 
            }
        },
    });

    return (
        <div className="mx-auto mt-5 p-4 sm:p-10 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] min-h-[80vh] flex flex-col items-center justify-center">
            <div className="bg-white border-gray-400 shadow-custom w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] flex flex-col justify-center p-4 sm:p-8 rounded-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-8 mx-auto font-bold">Determine Your Aura</h2>
                <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-3 sm:space-y-5">
                    <div className="flex flex-col space-y-2 sm:space-y-3">
                        {['lion', 'jackal', 'wolf', 'kitten', 'lynx'].map((animal) => (
                            <label key={animal} className="flex items-center p-2 sm:p-3 border border-gray-400 shadow-custom rounded-3xl">
                                <input
                                    type="radio"
                                    name="aura"
                                    value={animal}
                                    checked={formik.values.aura === animal}
                                    onChange={formik.handleChange}
                                    className="mr-2"
                                />
                                {animal.charAt(0).toUpperCase() + animal.slice(1)}
                            </label>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className={`bg-black text-white p-2 sm:p-3 rounded-3xl mt-2 sm:mt-4 ${formik.values.aura ? 'bg-login-btn-active' : 'bg-login-btn-default cursor-not-allowed'}`}
                        disabled={!formik.values.aura}
                    >
                        Confirm and Proceed
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DetermineYourAura;