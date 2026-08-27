import Header from '@/app/common/header/header';
import ChallengesViewV2 from '@/sections/loyalty-modules/challenges-v2/challenges-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenges - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Challenges', href: '' },
        ]}
      />

      <ChallengesViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
