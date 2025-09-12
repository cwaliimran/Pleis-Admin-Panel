'use client';
import OrganizationDetailPage from '@/sections/users/organizationDetailPage';
import { useParams } from 'next/navigation';
import Header from '../../../../common/header';

const Page = () => {
  const id = useParams<any>();

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Organization', href: '/super-admin/organization' },
          { name: 'Organization Details' },
        ]}
      />
      <OrganizationDetailPage id={id} userType={'super-admin'} />
    </div>
  );
};

export default Page;
