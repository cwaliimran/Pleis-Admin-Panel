'use client';
import Header from '@/app/common/header';
import OrganizerProfileSection from '@/sections/proflie/organizer-profile-section';

const Page = () => {
  return (
    <div className=" ">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Profile', href: '' },
        ]}
      />

      <OrganizerProfileSection />
    </div>
  );
};

export default Page;
