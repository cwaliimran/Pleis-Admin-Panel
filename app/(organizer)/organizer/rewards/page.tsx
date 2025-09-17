import Header from '@/app/common/header';
import RewardsView from '@/sections/rewards/rewards-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rewards - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Rewards', href: '' },
        ]}
      />

      <RewardsView />
    </div>
  );
};

export default Page;
