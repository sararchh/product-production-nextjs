import React from 'react';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  error = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'border rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 bg-white';
  
  const variantClasses = {
    default: 'border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-300 text-red-700 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-300 text-green-700 focus:ring-green-500 focus:border-green-500',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const finalVariant = error ? 'error' : variant;

  const classes = `${baseClasses} ${variantClasses[finalVariant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <select
      className={classes}
      {...props}
    >
      {children}
    </select>
  );
};
