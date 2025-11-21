import Header from '@/app/common/header/header';
import UserAccessView from '@/sections/user-access/user-access-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'User Access', href: '' },
        ]}
      />

      <UserAccessView />
    </div>
  );
};

export default Page;
