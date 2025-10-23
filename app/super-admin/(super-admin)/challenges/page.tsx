import Header from '@/app/common/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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

      <CompanyGuard>
        <ChallengesView global={false} />
      </CompanyGuard>
    </div>
  );
};

export default Page;
