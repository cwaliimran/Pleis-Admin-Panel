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
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Referrals', href: '' },
        ]}
      />

      <ReferralsViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
