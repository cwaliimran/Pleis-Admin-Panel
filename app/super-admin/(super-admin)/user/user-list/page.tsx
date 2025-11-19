import Header from '@/app/common/header/header';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Users', href: '' },
        ]}
      />

      <UserListView usertype="super-admin" />
    </div>
  );
};

export default Page;
