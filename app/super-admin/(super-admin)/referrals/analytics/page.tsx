import Header from '@/app/common/header/header';
import ReferralsDetailsView from '@/sections/loyalty-modules/referrals/referral-detail/referrals-details-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals Analytics - Pleis',
};

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-[#f8f6f7] pb-12 dark:bg-black">
        <Header
          links={[
            { name: 'Dashboard', href: '/super-admin' },
            { name: 'Referrals Analytics', href: '' },
          ]}
        />

        <ReferralsDetailsView />
      </div>
    </>
  );
};

export default Page;
