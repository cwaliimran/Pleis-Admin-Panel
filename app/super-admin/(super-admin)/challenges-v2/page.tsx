import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Loyalty', href: '/super-admin' },
          { name: 'Challenges Analytics', href: '' },
        ]}
      />

      <CompanyGuard>
        <ChallengesViewV2 />
      </CompanyGuard>
    </div>
  );
};

export default Page;
