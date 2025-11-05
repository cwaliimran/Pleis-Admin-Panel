import LoginPageView from '@/sections/auth/signinView';
import { GuestGuard } from '@/components/guards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Pleis',
};

const Page = () => {
  return (
    <GuestGuard>
      <LoginPageView userType="admin" />
    </GuestGuard>
  );
};

export default Page;
