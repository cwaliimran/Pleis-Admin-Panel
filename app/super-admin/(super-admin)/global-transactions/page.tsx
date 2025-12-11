import Header from '@/app/common/header/header';
import GlobalLoyaltyTransactionView from '@/sections/global-loyalty-modules/global-loyalty-transaction/global-loyalty-transaction-view';
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

      <GlobalLoyaltyTransactionView global={true} />
    </div>
  );
};

export default Page;
