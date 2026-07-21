import Header from '@/app/common/header/header';
import MenuSubcategoriesView from '@/sections/menu-management-modules/menuSubcategories/menuSubcategories-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Subcategories - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Menu Subcategories', href: '' },
        ]}
      />

      <MenuSubcategoriesView userType="organizer" />
    </div>
  );
};

export default Page;
