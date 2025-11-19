import Header from '@/app/common/header/header';
import React from 'react';

const Page = () => {
  return (
    <>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Subscription', href: '' },
        ]}
      />
      Coming Soon
    </>
  );
};

export default Page;
