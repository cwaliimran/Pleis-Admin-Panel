import Header from '@/app/common/header/header';
import { MenuManagementViewV1 } from '@/sections/app-ordering/menu-management';
// import { MenuManagementView } from '@/sections/app-ordering/menu-management-v2/menu-management-view';
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

      <MenuManagementViewV1 />
      {/* <MenuManagementView /> */}
    </div>
  );
};

export default Page;
