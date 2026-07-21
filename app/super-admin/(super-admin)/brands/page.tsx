import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import BrandsView from '@/sections/menu-management-modules/brands/brands-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brands - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Brands', href: '' },
        ]}
      />

      <CompanyGuard>
        <BrandsView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
