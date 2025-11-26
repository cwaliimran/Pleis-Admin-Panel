import Header from '@/app/common/header/header';
import RewardsView from '@/sections/loyalty-modules/rewards/rewards-view';
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

      <RewardsView global={false} />
    </div>
  );
};

export default Page;
