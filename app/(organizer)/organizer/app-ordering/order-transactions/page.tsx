import Header from '@/app/common/header/header';
import OrderingTransactionView from '@/sections/transactions/ordering-transaction/ordering-transaction-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation Transactions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Reservation Transactions', href: '' },
        ]}
      />

      <OrderingTransactionView userType="organizer" />
    </div>
  );
};

export default Page;
