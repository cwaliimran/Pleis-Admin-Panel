import Header from '@/app/common/header/header';
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

      <ReferralsViewV2 />
    </div>
  );
};

export default Page;
