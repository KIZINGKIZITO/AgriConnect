import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2';
    
    const variants = {
        primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        secondary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400',
        outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
    };

    return (
        <button className={`${baseStyles} ${variants[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;