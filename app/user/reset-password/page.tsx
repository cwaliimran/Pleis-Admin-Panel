import ResetPasswordView from '@/sections/auth/resetPassView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Pleis',
};

const Page = () => {
  return (
    <>
      <ResetPasswordView />
    </>
  );
};

export default Page;
