import Header from '@/app/common/header/header';
import OrganizationView from '@/sections/organization-view/organization-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organizations - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Organizations', href: '' },
        ]}
      />

      <OrganizationView userType="organizer" />
    </div>
  );
};

export default Page;
