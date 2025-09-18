import Header from '@/app/common/header';
import UserListView from '@/sections/users/userListView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Members', href: '' },
        ]}
      />

      {/* <MembersView /> */}
      <UserListView usertype="super-admin" memberPage={true}  />
    </div>
  );
};

export default Page;
