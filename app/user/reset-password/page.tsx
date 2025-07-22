'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { useBoolean } from '@/hooks/useBoolean';

// ----------------------
// Schema & Default Values
// ----------------------
const defaultValues = {
  newPassword: '',
  confirmPassword: '',
};

const schema = Yup.object().shape({
  newPassword: Yup.string()
    // .min(6, 'Password must be at least 6 characters')
    // .required('New password is required')
    ,
  confirmPassword: Yup.string()
    // .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    // .required('Please confirm your password')
    ,
});

// ----------------------
// Reset Password Page
// ----------------------
export default function ResetPasswordPage() {
  const router = useRouter();
  const showPassword = useBoolean();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    // Handle actual reset logic here...
    router.push('/user/signIn'); // Redirect to login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] px-4 text-foreground relative">
      
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white/30 dark:bg-black/30 backdrop-blur-md border border-border transition-all">
        
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1a1a1a] to-black text-white items-center justify-center p-10"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Set a New Password</h1>
            <p className="text-lg text-gray-300 max-w-sm mx-auto">
              Please enter a new password to complete the reset process.
            </p>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-extrabold text-center mb-1">Reset Your Password</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter and confirm your new password.
          </p>

          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <RHFTextField
                name="newPassword"
                type="password"
                placeholder="New Password"
                className="rounded-md h-[45px]"
                showPassword={showPassword.value}
                onTogglePassword={showPassword.onToggle}
              />
              <RHFTextField
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="rounded-md h-[45px]"
                showPassword={showPassword.value}
                onTogglePassword={showPassword.onToggle}
              />

              <Button type="submit" className="w-full h-[45px] bg-[#0f172b] dark:bg-white  dark:text-black text-white cursor-pointer hover:dark:bg-white hover:bg-[#0f172b] transition-colors duration-200">
                {methods.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </FormProvider>

         
          <p className="mt-10 text-xs text-muted-foreground text-center">
            By continuing, you agree to our <span className="underline">Terms</span> and{' '}
            <span className="underline">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
