import Header from '@/app/common/header/header';
import TicketingTransactionView from '@/sections/transactions/ticketing-transaction/ticketing-transaction-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ticketing Transactions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Ticketing Transactions', href: '' },
        ]}
      />

      <TicketingTransactionView />
    </div>
  );
};

export default Page;
