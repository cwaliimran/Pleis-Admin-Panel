import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import SubcategoryTypesView from '@/sections/menu-management-modules/subcategory-types/subcategory-types-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Types - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Types', href: '' },
        ]}
      />

      <CompanyGuard>
        <SubcategoryTypesView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
