import Header from '@/app/common/header';
import PendingUserView from '@/sections/pending-user/pending-user-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pending Users - Pleis',
};

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
