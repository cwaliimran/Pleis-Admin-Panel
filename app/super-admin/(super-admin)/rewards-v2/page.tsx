import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Rewards', href: '' },
        ]}
      />

      <CompanyGuard>
        <RewardsViewV2 />
      </CompanyGuard>
    </div>
  );
};

export default Page;
