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
