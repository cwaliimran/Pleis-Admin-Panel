'use client';
import Header from '@/app/common/header';

const Page = () => {
  return (
    <div className=" ">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin/dashboard' },
          { name: 'Profile', href: '' },
        ]}
      />

      {/* <OrganizerProfileSection /> */}
    </div>
  );
};

export default Page;
