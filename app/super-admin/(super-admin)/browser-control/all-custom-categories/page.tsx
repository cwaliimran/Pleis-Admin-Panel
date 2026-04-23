import Header from '@/app/common/header/header';
import { CategoryManagement } from '@/sections/brower-control/components/main-setting/category/category';
// import { ViewAllCategoryManagement } from '@/sections/brower-control/components/main-setting/view-all-custom-categories/view-all-custom-categories';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browser Control - Pleis',
};

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Browser Control', href: '/super-admin/browser-control' },
          { name: 'All Custom Categories', href: '' },
        ]}
      />

      {/* <ViewAllCategoryManagement /> */}
      <CategoryManagement heading="Custom Categories" viewAll={false} fixLength={false} />
    </div>
  );
};

export default Page;
