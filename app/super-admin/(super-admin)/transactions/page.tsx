import Header from '@/app/common/header/header';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Transactions', href: '' },
        ]}
      />

      <TransactionsView />
    </div>
  );
};

export default Page;
