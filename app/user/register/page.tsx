import SignUpView from '@/sections/auth/signupView';
import { GuestGuard } from '@/components/guards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Pleis',
};

const Page = () => {
  return (
    <GuestGuard>
      <SignUpView />
    </GuestGuard>
  );
};

export default Page;
