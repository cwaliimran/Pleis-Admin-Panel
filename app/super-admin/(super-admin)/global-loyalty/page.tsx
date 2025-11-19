import Header from '@/app/common/header/header';
import LoyaltyView from '@/sections/loyalty/loyalty-view/loyalty-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Loyalty Dashboard - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen px-2 pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Global Loyalty', href: '' },
        ]}
      />

      <LoyaltyView global={true} userType="super-admin" />
    </div>
  );
};

export default Page;
