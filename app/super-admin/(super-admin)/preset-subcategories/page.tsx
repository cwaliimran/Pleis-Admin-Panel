import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import PresetSubcategoriesView from '@/sections/menu-management-modules/presetSubcategories/presetSubcategories-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subcategory - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Subcategory', href: '' },
        ]}
      />

      <CompanyGuard>
        <PresetSubcategoriesView userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
