'use client';
// import { useParams } from 'next/navigation';
import React from 'react';
import Header from '../../../../common/header';
import UserDetailPage from '@/sections/users/userDetailPage';

const Page = () => {
  // const id = useParams<any>();

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/user/dashboard' },
          { name: 'User', href: '/super-admin/user' },
          { name: 'User Details' },
        ]}
      />
      <UserDetailPage />
    </div>
  );
};

export default Page;
