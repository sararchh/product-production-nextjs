import React from 'react';
import { Button } from '../atoms';

export interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Carregando...',
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      size={size}
      className={className}
      fullWidth={fullWidth}
      disabled={disabled}
      isLoading={isLoading}
      loadingText={loadingText}
    >
      {children}
    </Button>
  );
};
