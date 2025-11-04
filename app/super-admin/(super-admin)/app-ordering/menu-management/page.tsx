import Header from '@/app/common/header';
// import MenuManagementView from '@/sections/menu-management/menu-management-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Management - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Menu Management', href: '' },
        ]}
      />

      {/* <MenuManagementView /> */}
    </div>
  );
};

export default Page;
