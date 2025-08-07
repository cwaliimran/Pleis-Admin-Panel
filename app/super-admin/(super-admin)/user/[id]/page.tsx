'use client';

import UserDetailPage from '@/sections/users/userDetailPage';
import Header from '../../../../common/header';

const Page = () => {

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'User', href: '/super-admin/user/user-list' },
          { name: 'User Detail', href: '' },
        ]}
      />
      <UserDetailPage />
    </div>
  );
};

export default Page;
