'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/store/Reducer/user';
import { normalizeEmail } from '@/utils/short-utils';

const defaultValues = {
  otp: '',
};

const schema = Yup.object().shape({
  otp: Yup.string()
    .required('Otp is required')
    .min(6, 'Otp must be at least 6 characters'),
});

function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [verifyOtpData, { isLoading }] = useVerifyOtpMutation();
  const [forgotPasswordData, { isLoading: isLoadingForgotPassword }] =
    useSendOtpMutation();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit } = methods;

  const handleResendOtp = async () => {
    if (!email) {
      showError('Email is required to resend OTP.');
      return;
    }
    const trimmedEmail = normalizeEmail(email);

    try {
      const response = await forgotPasswordData({
        email: trimmedEmail,
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

      router.push('/user/verify-otp?email=' + encodeURIComponent(trimmedEmail));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to add category:', errorMessage);
      showError(errorMessage);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        email: email,
        otp: data.otp,
      };

      const response = await verifyOtpData(payload).unwrap();
      console.log('response', response);

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      // Handle success
      if (response?.message) {
        showSuccess(response?.message || 'Otp sent successfully');
      }

      const resetToken = response?.data?.resetToken;
      router.push(
        `/user/reset-password?email=${encodeURIComponent(email)}${resetToken ? `&rst=${encodeURIComponent(resetToken)}` : ''}`
      );
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
              Verify Otp
            </h1>
            <p className="mx-auto max-w-sm text-lg text-gray-300">
              We&#39;ll send you a verification code via email.
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
            Verify Your Otp
          </h2>
          <p className="text-muted-foreground mb-6 text-center text-sm">
            Enter the verification code sent to your email.
          </p>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="space-y-4">
              <RHFTextField
                name="otp"
                type="number"
                placeholder="Enter OTP"
                className="h-[45px] rounded-md"
              />

              {!isLoading ? (
                <Button
                  type="submit"
                  className={`h-[45px] w-full cursor-pointer bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
                >
                  Send Verification Code
                </Button>
              ) : (
                <Button
                  type="button"
                  className={`h-[45px] w-full cursor-not-allowed bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
                >
                  Sending Verification Code...
                </Button>
              )}

              <p className="text-muted-foreground text-center text-sm font-medium">
                Didn&#39;t receive code?{' '}
                <span
                  onClick={
                    isLoadingForgotPassword ? undefined : handleResendOtp
                  }
                  className={`inline-flex cursor-pointer items-center text-[#0f172b] hover:underline dark:text-white ${isLoadingForgotPassword ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  Resend Otp
                  {isLoadingForgotPassword && (
                    <svg
                      className="ml-2 h-4 w-4 animate-spin text-[#0f172b] dark:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                </span>
              </p>
            </div>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
}
export default VerifyOtpPage;
