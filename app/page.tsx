import LoginPageView from '@/sections/auth/signinView';
import { GuestGuard } from '@/components/guards';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Login - Pleis',
};

export default function Home() {
  return (
    <GuestGuard>
      <LoginPageView userType="organizer" />
    </GuestGuard>
  );
}
