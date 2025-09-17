import LoginPageView from '@/sections/auth/signinView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Pleis',
};

export default function Home() {
  return (
    <>
      <LoginPageView userType="organizer" />
    </>
  );
}
