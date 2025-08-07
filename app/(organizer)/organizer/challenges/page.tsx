import Header from '@/app/common/header';
import ChallengesView from '@/sections/challenges/challenges-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Challenges', href: '' },
        ]}
      />

      <ChallengesView />
    </div>
  );
};

export default Page;
