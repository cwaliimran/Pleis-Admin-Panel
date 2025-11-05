import ForgotPasswordView from '@/sections/auth/forgetPassView';
import { GuestGuard } from '@/components/guards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Pleis',
};

const Page = () => {
  return (
    <GuestGuard>
      <ForgotPasswordView />
    </GuestGuard>
  );
};

export default Page;
