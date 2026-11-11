import Header from '@/app/common/header/header';
import { TransactionHistoryViewV2 } from '@/sections/transactions/transaction-history-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction List - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Transaction List', href: '' },
        ]}
      />

      <TransactionHistoryViewV2 payoutsBatchesHref="/super-admin/payouts-batches" />
    </div>
  );
};

export default Page;
