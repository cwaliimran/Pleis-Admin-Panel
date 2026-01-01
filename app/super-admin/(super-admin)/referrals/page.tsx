import Header from '@/app/common/header/header';
import ReferralsView from '@/sections/loyalty-modules/referrals/referrals-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Referrals', href: '' },
        ]}
      />

      <ReferralsView global={false} />
    </div>
  );
};

export default Page;
