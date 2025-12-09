import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md' }) => {
  const variants = {
    success: "bg-secondary-light text-secondary border-secondary/20",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-600 border-red-200",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
    info: "bg-blue-50 text-blue-600 border-blue-200",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span className={`inline-flex items-center justify-center font-semibold rounded-full border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};