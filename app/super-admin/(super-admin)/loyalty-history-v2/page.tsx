import Header from '@/app/common/header/header';
import { LoyaltyHistoryViewV2 } from '@/sections/transactions/loyalty-history-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loyalty History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Loyalty History', href: '' },
        ]}
      />

      <LoyaltyHistoryViewV2 />
    </div>
  );
};

export default Page;
