import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import LoyaltyTransactionView from '@/sections/transactions/loyalty-transaction/loyalty-transaction-view';
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

      <CompanyGuard>
        <LoyaltyTransactionView global={false} userType="super-admin"/>
      </CompanyGuard>
    </div>
  );
};

export default Page;
