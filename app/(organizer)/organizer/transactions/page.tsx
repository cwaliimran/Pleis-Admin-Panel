import Header from '@/app/common/header';
import TransactionsView from '@/sections/reservation/reservation-transactions/transactions-view';
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

      <TransactionsView />
    </div>
  );
};

export default Page;
