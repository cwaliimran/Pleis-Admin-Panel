import Header from '../../../../common/header/header';
import OrganizationDetailPage from '@/sections/users/organizationDetailPage';
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
          { name: 'Organization', href: '/organizer/organization/organization-list' },
          { name: 'Organization Details' },
        ]}
      />
      <OrganizationDetailPage userType={'organizer'} />
    </div>
  );
};

export default Page;
