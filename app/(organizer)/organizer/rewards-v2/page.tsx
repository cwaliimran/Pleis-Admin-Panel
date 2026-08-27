import Header from '@/app/common/header/header';
import RewardsViewV2 from '@/sections/loyalty-modules/rewards-v2/rewards-view';
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

      <RewardsViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
