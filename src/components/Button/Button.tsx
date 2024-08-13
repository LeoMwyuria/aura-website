import React from 'react';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    className?: string;
    active?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, active }) => {
    return (
        <button
            onClick={onClick}
            className={`font-semibold py-2 px-4 rounded shadow-lg mt-2 text-left ${active ? 'bg-white text-black' : 'hover:bg-white'} ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
