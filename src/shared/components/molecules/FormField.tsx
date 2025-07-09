import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Input, Label } from '../atoms';

export interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  error?: string;
  register: UseFormRegister<T>;
  className?: string;
  autoComplete?: string;
  valueAsNumber?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FormField = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  className = '',
  autoComplete,
  valueAsNumber = false,
  required = false,
  size = 'md',
}: FormFieldProps<T>) => {
  const registerProps = valueAsNumber 
    ? register(name, { valueAsNumber: true })
    : register(name);

  return (
    <div className={className}>
      <Label htmlFor={name} required={required} size={size}>
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={!!error}
        size={size}
        fullWidth
        {...registerProps}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
