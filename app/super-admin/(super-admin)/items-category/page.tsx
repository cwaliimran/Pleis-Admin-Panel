import Header from '@/app/common/header/header';
import ItemsCategoryView from '@/sections/menu-management/items-category/items-category-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Items Category - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Items Category', href: '' },
        ]}
      />

      <ItemsCategoryView />
    </div>
  );
};

export default Page;
