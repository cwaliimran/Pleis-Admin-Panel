import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import AllergensView from '@/sections/menu-management-modules/allergens/allergens-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allergens - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Allergens', href: '' },
        ]}
      />

      <CompanyGuard>
        <AllergensView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
