import Header from '@/app/common/header/header';
import ItemsCategoryView from '@/sections/menu-management-modules/items-category/items-category-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Category - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Category', href: '' },
        ]}
      />

      <ItemsCategoryView />
    </div>
  );
};

export default Page;
