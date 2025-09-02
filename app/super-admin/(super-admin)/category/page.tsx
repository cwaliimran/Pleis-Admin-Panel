import Header from '@/app/common/header';
import CategoriesView from '@/sections/categories/categories-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Categories', href: '' },
        ]}
      />

      <CategoriesView />
    </div>
  );
};

export default Page;
