import ForgotPasswordView from '@/sections/auth/forgetPassView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Pleis',
};

const Page = () => {
  return (
    <>
      <ForgotPasswordView />
    </>
  );
};

export default Page;
