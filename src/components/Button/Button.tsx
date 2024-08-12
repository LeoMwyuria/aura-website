import React from 'react';

interface ButtonProps {
    label: string;
}

const Button: React.FC<ButtonProps> = ({ label }) => {
    return (
        <button className='font-semibold py-2 px-4 rounded hover:bg-white shadow-lg mt-2 text-left'>
            {label}
        </button>
    );
};

export default Button;
