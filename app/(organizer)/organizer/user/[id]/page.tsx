'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import Header from '../../../../common/header';
import UserDetailPage from '@/sections/users/userDetailPage';

const Page = () => {
  const id = useParams<any>();

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Users List', href: '/organizer/user/user-list' },
          { name: 'User Details' },
        ]}
      />
      <UserDetailPage />
    </div>
  );
};

export default Page;
