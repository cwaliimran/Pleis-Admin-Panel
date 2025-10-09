import Header from '@/app/common/header';
import RewardsView from '@/sections/rewards/rewards-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Rewards - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Global Rewards', href: '' },
        ]}
      />

      <RewardsView global={true} />
    </div>
  );
};

export default Page;
