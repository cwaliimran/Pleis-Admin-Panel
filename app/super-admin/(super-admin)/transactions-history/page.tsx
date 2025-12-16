import Header from '@/app/common/header/header';
import TransactionHistoryView from '@/sections/transactions/transaction-history/transaction-history-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Transactions History', href: '' },
        ]}
      />

      <TransactionHistoryView />
    </div>
  );
};

export default Page;
