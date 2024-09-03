import React from 'react';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className,  }) => {
    return (
        <button
            onClick={onClick}
            className={`font-semibold py-2 px-4 rounded shadow-lg mt-2 text-left ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
