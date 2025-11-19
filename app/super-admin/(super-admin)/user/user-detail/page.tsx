'use client';
import React from 'react';
import Header from '../../../../common/header/header';
import UserDetailPage from '@/sections/users/userDetailPage';

const Page = () => {
  return (
    <div>
      <Header links={[{ name: 'Dashboard', href: '/user/dashboard' }, { name: 'User', href: '/super-admin/user' }, { name: 'User Details' }]} />
      <UserDetailPage userDashboardType="super-admin" />
    </div>
  );
};

export default Page;
