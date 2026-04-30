'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useBoolean } from '@/hooks/useBoolean';
import { useConfirmTwoFactorAuthLoginMutation } from '@/store/Reducer/twoFactorAuth';
import { useAdminLoginMutation, useLoginMutation } from '@/store/Reducer/user';
import { setUser } from '@/store/slice/userSlice';
import { getErrorMessage } from '@/utils/api';
import { getDeviceType } from '@/utils/getDeviceType';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const defaultValues = {
  email: '',
  password: '',
};

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type LoginPageViewProps = {
  userType: 'organizer' | 'admin';
};

export default function LoginPageView({ userType }: LoginPageViewProps) {
  const open = useBoolean();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const [login, { isLoading }] = useLoginMutation();
  const [adminLogin, { isLoading: isAdminLoading }] = useAdminLoginMutation();
  const [confirmTwoFactorAuth] = useConfirmTwoFactorAuthLoginMutation();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const goTo = useCallback(
    (role: string) => {
      switch (role) {
        case 'admin':
          router.push('/super-admin');
          break;
        case 'organizer':
          router.push('/organizer');
          break;
        default:
          router.push('/');
          break;
      }
    },
    [router]
  );

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (searchParams.get('verification') === 'success') {
      setIsVerificationModalOpen(true);
    }
  }, [searchParams]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const deviceType = getDeviceType();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const payload = {
        email: data?.email.trim().toLowerCase(),
        password: data?.password,
        deviceType,
        deviceId: '123',
        timezone,
        userType,
      };

      let response;

      if (userType === 'admin') {
        response = await adminLogin(payload);
      } else {
        response = await login(payload);
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      let user = response?.data?.data;

      // if (!user) {
      //   return router.push('/');
      // }

      if (!user) {
        showError('Invalid email or password. Please try again.');
        return;
      }

      if (user?.accountState?.status === 'inactive') {
        showError('Your account is inactive. Please contact support.');
        return;
      }

      const role = user?.accountState?.userType || '';
      user = { ...user, role, key: process.env.NEXT_PUBLIC_PROJECT_KEY };

      if (user?.accountState?.twoFactorAuth) {
        setTempUser(user);
        setIsModalOpen(true);
      } else {
        dispatch(setUser(user));
        goTo(role);
      }

      reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  });

  const handleConfirmOtp = async () => {
    if (!otp) {
      showError('Please enter the OTP');
      return;
    }

    if (!tempUser?.token) {
      showError('Authentication token is missing. Please try logging in again.');
      setIsModalOpen(false);
      return;
    }

    try {
      setIsOtpLoading(true);
      const payload = { token: otp };
      // const response = await confirmTwoFactorAuth(payload).unwrap();

      const response = await confirmTwoFactorAuth({
        ...payload,
        headers: {
          Authorization: `Bearer ${tempUser.token}`,
        },
      }).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Two-factor authentication verified successfully');

      dispatch(setUser(tempUser));
      goTo(tempUser?.role || '');
      setIsModalOpen(false);
      setOtp('');
      setTempUser(null);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to verify OTP:', errorMessage);
      showError(errorMessage);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const navigateToAdminLogin = () => {
    router.push('/admin/login');
  };

  return (
    <>
      <div className="text-foreground relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 px-4 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f]">
        <div className="absolute top-4 right-4 z-10">
          <ModeToggle />
        </div>

        <div className="border-border flex w-full max-w-5xl overflow-hidden rounded-xl border bg-white/30 shadow-2xl backdrop-blur-md transition-all dark:bg-black/30">
          {/* Branding Left Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black p-10 text-white md:flex"
          >
            <div className="space-y-4 text-center">
              <h1 className="text-5xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="mx-auto max-w-sm text-lg text-gray-300">
                Let’s get <span onClick={navigateToAdminLogin}>you</span> signed in to continue.
              </p>
            </div>
          </motion.div>

          {/* Form Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-full flex-col justify-center p-6 sm:p-8 md:w-1/2 md:p-16"
          >
            <h2 className="mb-1 text-center text-3xl font-extrabold">Login to PLEIS</h2>
            <p className="text-muted-foreground mb-6 text-center text-sm">Enter your credentials to access your account</p>

            <FormProvider methods={methods} onSubmit={onSubmit}>
              <div className="space-y-4">
                <RHFTextField name="email" type="email" placeholder="Email Address" className="h-[40px] rounded-md text-sm sm:text-lg" />
                <RHFTextField
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="h-[40px] rounded-md text-sm sm:text-lg"
                  showPassword={open.value}
                  onTogglePassword={open.onToggle}
                />

                <Link href={'/user/forgot-password'} className="text-muted-foreground text-end text-sm hover:underline">
                  <p className="text-muted-foreground my-4 text-end text-sm">Forgot Password?</p>
                </Link>

                {!isLoading && !isAdminLoading ? (
                  <Button
                    type="submit"
                    className={`h-[45px] w-full cursor-pointer bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={`h-[45px] w-full cursor-not-allowed bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
                  >
                    Logging in...
                  </Button>
                )}

                {userType === 'organizer' && (
                  <>
                    {/* <div className="text-muted-foreground text-center text-sm">Or sign in with</div>

                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" className="h-[60px] w-[60px] cursor-pointer rounded-full py-3">
                        <span className="flex h-6 w-6 items-center justify-center">
                          <Image
                            src="/images/appleIcon.png"
                            alt="Apple"
                            className="block h-[25px] w-[25px] object-contain dark:hidden"
                            width={25}
                            height={25}
                            style={{ height: 'auto' }}
                          />

                          <Image
                            src="/images/macIconDark.png"
                            alt="Apple"
                            className="hidden h-[25px] w-[25px] object-contain dark:block"
                            width={25}
                            height={25}
                            style={{ height: 'auto' }}
                          />
                        </span>
                      </Button>

                      <Button variant="outline" className="h-[60px] w-[60px] cursor-pointer rounded-full">
                        <span className="flex h-6 w-6 items-center justify-center">
                          <Image
                            src="/images/googleIcon.png"
                            alt="Google"
                            className="h-[25px] w-[25px] object-contain"
                            width={25}
                            height={25}
                            style={{ height: 'auto' }}
                          />
                        </span>
                      </Button>

                      <Button variant="outline" className="h-[60px] w-[60px] cursor-pointer rounded-full">
                        <span className="flex h-6 w-6 items-center justify-center">
                          <Image
                            src="/images/metaIcon.png"
                            alt="Meta"
                            className="h-[25px] w-[25px] object-contain"
                            width={25}
                            height={25}
                            style={{ height: 'auto' }}
                          />
                        </span>
                      </Button>
                    </div> */}

                    <p className="text-muted-foreground mt-4 text-center text-sm">
                      Don&#39;t have an account?{' '}
                      <Link href="/user/register" className="font-medium text-[#0f172b] hover:underline dark:text-white">
                        Sign Up
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </FormProvider>

            {userType === 'organizer' && (
              <p className="text-muted-foreground mt-10 text-center text-xs">
                By continuing, you agree to our{' '}
                <Link href="/term-and-service" className="hover:text-primary underline transition-colors">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="hover:text-primary underline transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-3 text-center">Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">Enter the OTP from your authenticator app to verify your identity.</p>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full py-2"
              disabled={isOtpLoading}
            />
            <Button onClick={handleConfirmOtp} className="w-full" disabled={isOtpLoading}>
              {isOtpLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify OTP'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-3 text-center">Verification Pending</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Pleis team will contact you to verify your identity before proceeding.
            </p>
            <Button
              onClick={() => setIsVerificationModalOpen(false)}
              className={`h-10 w-full bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white`}
            >
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
