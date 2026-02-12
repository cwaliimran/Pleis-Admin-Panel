import Header from '@/app/common/header/header';
import OrganizerChallengesView from '@/sections/loyalty-modules/organizer-challenges/challenges-view';
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

      <OrganizerChallengesView />
    </div>
  );
};

export default Page;
