import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import { MenuManagementView } from '@/sections/app-ordering/menu-management';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Management - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Menu Management', href: '' },
        ]}
      />
      <CompanyGuard>
        <MenuManagementView userType="organizer" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
