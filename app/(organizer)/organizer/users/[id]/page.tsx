'use client';

import UserDetailPage from '@/sections/users/userDetailPage';
import Header from '../../../../common/header';

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Organizer', href: '/organizer/users' },
          { name: 'Organizer Details' },
        ]}
      />
      <UserDetailPage userDashboardType="organizer" />
    </div>
  );
};

export default Page;
