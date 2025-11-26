import Header from '@/app/common/header/header';
import RewardCategoryView from '@/sections/global-loyalty-modules/global-reward-category/reward-category-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RewardCategory - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'RewardCategory', href: '' },
        ]}
      />

      <RewardCategoryView />
    </div>
  );
};

export default Page;
