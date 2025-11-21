import React from 'react';
import Header from '@/app/common/header/header';
import { AdminProfileSection } from '@/sections/proflie';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Profile - Pleis',
};

const Page = () => {
  return (
    <div className=" ">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Profile', href: '' },
        ]}
      />

      <AdminProfileSection />
    </div>
  );
};

export default Page;
