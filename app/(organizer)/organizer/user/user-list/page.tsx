import Header from '@/app/common/header';
import UserListView from '@/sections/users/userListView';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Users', href: '' },
        ]}
      />

      <UserListView usertype="organizer" />
    </div>
  );
};

export default Page;
