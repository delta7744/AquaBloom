import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'default',
  padding = 'md'
}) => {
  const baseStyles = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "bg-white shadow-soft border border-gray-100",
    primary: "bg-primary text-white shadow-lg shadow-primary/20",
    outline: "bg-transparent border border-gray-200"
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6"
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};