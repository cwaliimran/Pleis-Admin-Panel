'use client';

import Header from '@/app/common/header';
import CreateOrganizationPage from '@/sections/organization-section/create-organization';

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f7] pb-12 dark:bg-black">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Organizations', href: '' },
        ]}
      />

      <CreateOrganizationPage />
    </div>
  );
};

export default Page;
