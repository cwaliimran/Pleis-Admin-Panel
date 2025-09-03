import Header from '@/app/common/header';
import PendingUserView from '@/sections/pending-user/pending-user-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Pending User List', href: '' },
        ]}
      />

      <PendingUserView />
    </div>
  );
};

export default Page;
