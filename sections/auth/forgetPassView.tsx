'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { useSendOtpMutation } from '@/store/Reducer/user';
import { getErrorMessage } from '@/utils/api';
import { normalizeEmail } from '@/utils/short-utils';
import { showError, showSuccess } from '@/utils/toast';

const defaultValues = {
  email: '',
};

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

function ForgotPasswordView() {
  const [forgotPasswordData, { isLoading }] = useSendOtpMutation();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const normalizedEmail = normalizeEmail(data.email);
      const response = await forgotPasswordData({
        email: normalizedEmail,
      }).unwrap();

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      // Handle success
      if (response?.message) {
        showSuccess(response?.message || 'Otp sent successfully');
      }

      reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to add category:', errorMessage);
      showError(errorMessage);
    }
  });

  return (
    <div className="text-foreground relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 px-4 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f]">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="border-border flex w-full max-w-5xl overflow-hidden rounded-xl border bg-white/30 shadow-2xl backdrop-blur-md transition-all dark:bg-black/30">
        {/* ---------------- Left Branding ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black p-10 text-white md:flex"
        >
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Forgot Password?
            </h1>
            <p className="mx-auto max-w-sm text-lg text-gray-300">
              We’ll send you a reset link via email.
            </p>
          </div>
        </motion.div>

        {/* ---------------- Right Form ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-16"
        >
          <h2 className="mb-1 text-center text-3xl font-extrabold">
            Reset Your Password
          </h2>
          <p className="text-muted-foreground mb-6 text-center text-sm">
            Enter your email and we&#39;ll send you instructions to reset it.
          </p>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="space-y-4">
              <RHFTextField
                name="email"
                type="email"
                placeholder="Email Address"
                className="h-[45px] rounded-md"
              />

              {!isLoading ? (
                <Button
                  type="submit"
                  className={`h-[45px] w-full cursor-pointer bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
                >
                  Send Reset Link
                </Button>
              ) : (
                <Button
                  type="button"
                  className={`h-[45px] w-full cursor-not-allowed bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
                >
                  Sending Reset Link...
                </Button>
              )}

              <p className="text-muted-foreground mt-4 text-center text-sm">
                Remember your password?{' '}
                <Link
                  href="/"
                  className="font-medium text-[#0f172b] hover:underline dark:text-white"
                >
                  Go back to login
                </Link>
              </p>
            </div>
          </FormProvider>

          {/* <p className="text-muted-foreground mt-10 text-center text-xs">
            By continuing, you agree to our{' '}
            <Link
              href="/term-and-service"
              className="hover:text-primary underline transition-colors"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy-policy"
              className="hover:text-primary underline transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p> */}
        </motion.div>
      </div>
    </div>
  );
}
export default ForgotPasswordView;
