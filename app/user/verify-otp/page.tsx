import { GuestGuard } from '@/components/guards';
import VerifyOtpView from '@/sections/auth/verifyOtpView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Otp - Pleis',
};

const Page = () => {
  return (
    <GuestGuard>
      <VerifyOtpView />
    </GuestGuard>
  );
};

export default Page;
