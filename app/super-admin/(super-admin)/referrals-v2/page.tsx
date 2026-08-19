import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import ReferralsViewV2 from '@/sections/loyalty-modules/referrals-v2/referrals-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Loyalty', href: '/super-admin' },
          { name: 'Referrals Analytics', href: '' },
        ]}
      />

      <CompanyGuard>
        <ReferralsViewV2 />
      </CompanyGuard>
    </div>
  );
};

export default Page;
