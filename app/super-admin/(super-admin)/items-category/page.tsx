import Header from '@/app/common/header';
import ItemsCategoryView from '@/sections/items-category/items-category-view';
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
          { name: 'Items Category', href: '/super-admin/items-category' },
        ]}
      />

      <ItemsCategoryView />
    </div>
  );
};

export default Page;
