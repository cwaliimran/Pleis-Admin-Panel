import Header from '@/app/common/header';
import OrganizerProfileSection from '@/sections/proflie/organizer-profile-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Pleis',
};

const Page = () => {
  return (
    <div className=" ">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Profile', href: '' },
        ]}
      />

      <OrganizerProfileSection />
    </div>
  );
};

export default Page;
