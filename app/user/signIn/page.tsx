import LoginPageView from '@/sections/auth/signinView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Pleis',
};

const Page = () => {
  return (
    <>
      <LoginPageView userType="organizer" />
    </>
  );
};

export default Page;
