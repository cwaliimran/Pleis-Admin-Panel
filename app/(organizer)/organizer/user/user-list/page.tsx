import Header from '@/app/common/header';
import UserListView from '@/sections/users/userListView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Users', href: '' },
        ]}
      />

      <UserListView usertype="organizer" />
    </div>
  );
};

export default Page;
