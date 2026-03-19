import Header from '@/app/common/header/header';
import ManagerProfileSection from '@/sections/proflie/manager-profile-section';
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

      <ManagerProfileSection />
    </div>
  );
};

export default Page;
