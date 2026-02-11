import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import MenuItemView from '@/sections/menu-management-modules/menuItems/menuItems-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Items - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Menu Items', href: '' },
        ]}
      />

      <CompanyGuard>
        <MenuItemView userType="super-admin"/>
      </CompanyGuard>
    </div>
  );
};

export default Page;
