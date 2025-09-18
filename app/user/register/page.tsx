import SignUpView from '@/sections/auth/signupView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Pleis',
};

const Page = () => {
  return (
    <>
      <SignUpView />
    </>
  );
};

export default Page;
