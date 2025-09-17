import OrganizationDetailPage from '@/sections/users/organizationDetailPage';
import Header from '../../../../common/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organization Details - Pleis',
};

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Organization', href: '/super-admin/organization' },
          { name: 'Organization Details' },
        ]}
      />
      <OrganizationDetailPage userType={'super-admin'} />
    </div>
  );
};

export default Page;
