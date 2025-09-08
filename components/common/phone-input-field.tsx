import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ReusableInputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const ReusableInputField: React.FC<ReusableInputFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  className,
  inputClassName,
  labelClassName,
  maxLength,
  min,
  max,
  step,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={name}
        className={cn(
          'text-sm font-medium text-gray-700 dark:text-gray-200',
          required && "after:content-['*'] after:ml-0.5 after:text-red-500",
          labelClassName
        )}
      >
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        className={cn(
          'w-full',
          error &&
            'border-red-500 focus:border-red-500 focus:ring-red-500 aria-invalid:border-red-500',
          inputClassName
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="text-sm text-red-500 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ReusableInputField;