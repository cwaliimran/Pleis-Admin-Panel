import Header from '@/app/common/header';
import ReferralsView from '@/sections/referrals/referrals-view';
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

      <ReferralsView userType="super-admin" />
    </div>
  );
};

export default Page;
