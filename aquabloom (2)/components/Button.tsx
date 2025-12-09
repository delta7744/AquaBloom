import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-base shadow-sm";
  
  const variants = {
    primary: "bg-primary text-white shadow-primary/30 hover:bg-primary-dark",
    secondary: "bg-secondary text-white shadow-secondary/30 hover:bg-opacity-90",
    white: "bg-white text-primary hover:bg-gray-50",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary-light",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};