import Header from '@/app/common/header/header';
import ChallengesView from '@/sections/challenges/challenges-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Challenges - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Global Challenges', href: '' },
        ]}
      />

      <ChallengesView global={true} />
    </div>
  );
};

export default Page;
