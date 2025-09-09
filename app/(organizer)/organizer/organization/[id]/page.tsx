'use client';
import { useParams } from 'next/navigation';
import Header from '../../../../common/header';
import OrganizationDetailPage from '@/sections/users/organizationDetailPage';

const Page = () => {
  const id = useParams<any>();

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Organization', href: '/super-admin/organization' },
          { name: 'Organization Details' },
        ]}
      />
      <OrganizationDetailPage id={id} />
    </div>
  );
};

export default Page;
