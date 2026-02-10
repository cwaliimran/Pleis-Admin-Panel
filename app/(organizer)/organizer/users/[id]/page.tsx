'use client';

import UserDetailPage from '@/sections/users/userDetailPage';
import { Metadata } from 'next';
import Header from '../../../../common/header/header';

export const metadata: Metadata = {
  title: 'User Detail - Pleis',
};

const Page = () => {
  return (
    <div>
      <Header links={[{ name: 'Dashboard', href: '/organizer' }, { name: 'Organizer', href: '/organizer/users' }, { name: 'Organizer Details' }]} />
      <UserDetailPage userDashboardType="organizer" />
    </div>
  );
};

export default Page;
