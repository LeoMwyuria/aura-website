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
        <div className="ml-auto mr-auto mt-5 p-10 w-[80%] min-h-[80vh] flex flex-col items-center justify-center">
            <div className="bg-white border-gray-400 shadow-custom w-[40%] flex flex-col justify-center p-8 rounded-3xl mx-auto">
                <h2 className="text-3xl mb-8 mx-auto font-bold">Determine Your Aura</h2>
                <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-5">
                    <div className="flex flex-col space-y-3">
                        <label className="flex items-center p-3 border border-gray-400 shadow-custom rounded-3xl">
                            <input
                                type="radio"
                                name="aura"
                                value="lion"
                                checked={formik.values.aura === 'lion'}
                                onChange={formik.handleChange}
                                className="mr-2"
                            />
                            
                            Lion
                        </label>
                        <label className="flex items-center p-3 border border-gray-400 shadow-custom rounded-3xl">
                            <input
                                type="radio"
                                name="aura"
                                value="jackal"
                                checked={formik.values.aura === 'jackal'}
                                onChange={formik.handleChange}
                                className="mr-2"
                            />
                            
                            Jackal
                        </label>
                        <label className="flex items-center p-3 border border-gray-400 shadow-custom rounded-3xl">
                            <input
                                type="radio"
                                name="aura"
                                value="wolf"
                                checked={formik.values.aura === 'wolf'}
                                onChange={formik.handleChange}
                                className="mr-2"
                            />
                           
                            Wolf
                        </label>
                        <label className="flex items-center p-3 border border-gray-400 shadow-custom rounded-3xl">
                            <input
                                type="radio"
                                name="aura"
                                value="kitten"
                                checked={formik.values.aura === 'kitten'}
                                onChange={formik.handleChange}
                                className="mr-2"
                            />
                            
                            Kitten
                        </label>
                        <label className="flex items-center p-3 border border-gray-400 shadow-custom rounded-3xl">
                            <input
                                type="radio"
                                name="aura"
                                value="lynx"
                                checked={formik.values.aura === 'lynx'}
                                onChange={formik.handleChange}
                                className="mr-2"
                            />
                            
                            Lynx
                        </label>
                    </div>
                    <button
                        type="submit"
                        className={`bg-black text-white p-3 rounded-3xl mt-4 ${formik.values.aura ? 'bg-login-btn-active' : 'bg-login-btn-default cursor-not-allowed'}`}
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
