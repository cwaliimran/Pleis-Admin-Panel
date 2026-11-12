import Header from '@/app/common/header/header';
import { TransactionHistoryViewV2 } from '@/sections/transactions/transaction-history-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction List - Pleis',
};

// Organizer visibility (Requirement Set #8): own company only; no service fee,
// gateway cost, Pleis net or payout actions. The API enforces the same rules.
const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Transaction List', href: '' },
        ]}
      />

      <TransactionHistoryViewV2 isOrganizer />
    </div>
  );
};

export default Page;
