import ResetPasswordView from '@/sections/auth/resetPassView';
import { GuestGuard } from '@/components/guards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Pleis',
};

const Page = () => {
  return (
    <GuestGuard>
      <ResetPasswordView />
    </GuestGuard>
  );
};

export default Page;
