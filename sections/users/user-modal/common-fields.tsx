// CommonFields.tsx
'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RHFTextField } from '@/components/rhf';
import PhoneInput from 'react-phone-input-2';
import { useBoolean } from '@/hooks/useBoolean';

interface CommonFieldsProps {
  mode: 'create' | 'edit';
}

const CommonFields: React.FC<CommonFieldsProps> = ({ mode }) => {
  const { control, setValue } = useFormContext();
  const showPassword = useBoolean();

  return (
    <>
      <RHFTextField name="firstName" label="First Name" placeholder="Enter your first name" />
      <RHFTextField name="lastName" label="Last Name" placeholder="Enter your last name" />
      <RHFTextField name="email" type="email" label="Email" placeholder="Enter your email address" disabled={mode === 'edit'} />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <p className="mb-0.5 text-sm font-medium">Phone</p>
            <PhoneInput
              {...field}
              country="hr"
              onChange={(value, country: any) => {
                field.onChange(value);
                setValue('phoneCode', `+${country?.dialCode || ''}`, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              placeholder="Phone Number"
              inputProps={{
                required: true,
                'aria-invalid': fieldState.invalid,
              }}
              containerClass="w-full"
              dropdownStyle={{
                zIndex: 9999,
                position: 'fixed',
                width: '16rem',
              }}
              buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
              inputClass={`file:text-foreground placeholder:text-muted-foreground
            selection:bg-primary selection:text-primary-foreground
            dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm
            flex !h-[42px] !w-full min-w-0 rounded-lg
            !bg-transparent px-3 py-1 text-base
            shadow-xs transition-[color,box-shadow]
            outline-none file:inline-flex file:h-7 file:border-0
            file:bg-transparent file:text-sm file:font-medium
            disabled:pointer-events-none disabled:cursor-not-allowed
            disabled:opacity-50 md:text-sm
            focus-visible:ring-ring/50 focus-visible:ring-[3px]
            aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
            aria-invalid:border-destructive ${fieldState.invalid ? 'border-destructive ring-destructive/40' : ''}`}
            />
            {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
          </div>
        )}
      />

      {mode !== 'edit' && (
        <RHFTextField
          name="password"
          type="password"
          label="Password"
          placeholder="Min 6 characters"
          showPassword={showPassword.value}
          onTogglePassword={showPassword.onToggle}
        />
      )}
    </>
  );
};

export default CommonFields;
