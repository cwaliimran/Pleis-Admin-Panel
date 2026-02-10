import Header from '@/app/common/header/header';
import LoyaltyTransactionView from '@/sections/transactions/loyalty-transaction/loyalty-transaction-view';
// import TransactionsView from '@/sections/reservation-modules/reservation-transactions/transactions-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Transactions', href: '' },
        ]}
      />

      {/* <TransactionsView /> */}
      <LoyaltyTransactionView global={false} userType="organizer" />
    </div>
  );
};

export default Page;
