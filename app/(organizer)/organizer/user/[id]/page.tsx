import UserDetailPage from '@/sections/users/userDetailPage';
import Header from '../../../../common/header';

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Users List', href: '/organizer/user/user-list' },
          { name: 'User Details' },
        ]}
      />
      <UserDetailPage />
    </div>
  );
};

export default Page;
