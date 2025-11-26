import Header from '@/app/common/header/header';
import LoyaltyTransactionView from '@/sections/loyalty-modules/loyalty-transaction/loyalty-transaction-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Transactions', href: '' },
        ]}
      />

      <LoyaltyTransactionView />
    </div>
  );
};

export default Page;
