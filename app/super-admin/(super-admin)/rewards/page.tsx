import Header from '@/app/common/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import RewardsView from '@/sections/rewards/rewards-view';
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
        <RewardsView global={false} />
      </CompanyGuard>
    </div>
  );
};

export default Page;
