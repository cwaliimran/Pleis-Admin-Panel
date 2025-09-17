import UserDetailPage from '@/sections/users/userDetailPage';
import Header from '../../../../common/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Details - Pleis',
};

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Users List', href: '/organizer/user/user-list' },
          { name: 'User Details' },
        ]}
      />
      <UserDetailPage userDashboardType="organizer" />
    </div>
  );
};

export default Page;
