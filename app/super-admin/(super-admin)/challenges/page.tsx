import Header from '@/app/common/header';
import ChallengesView from '@/sections/challenges/challenges-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenges - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Challenges', href: '' },
        ]}
      />

      <ChallengesView />
    </div>
  );
};

export default Page;
