import Header from '@/app/common/header/header';
import ReferralsDetailsView from '@/sections/loyalty-modules/referrals/referral-detail/referrals-details-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referral Detail - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Referral Details', href: '' },
        ]}
      />

      <ReferralsDetailsView global= {true} />
    </div>
  );
};

export default Page;
