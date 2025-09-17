import LoginPageView from '@/sections/auth/signinView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Pleis',
};

const Page = () => {
  return (
    <>
      <LoginPageView userType="admin" />
    </>
  );
};

export default Page;
