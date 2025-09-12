import Header from '@/app/common/header';
import OrganizationView from '@/sections/organization-view/organization-view';

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
