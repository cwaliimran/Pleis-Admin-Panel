import Header from '@/app/common/header';
import RewardsView from '@/sections/rewards/rewards-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Rewards', href: '' },
        ]}
      />

      <RewardsView />
    </div>
  );
};

export default Page;
