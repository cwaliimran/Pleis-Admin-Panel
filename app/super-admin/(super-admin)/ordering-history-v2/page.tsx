import Header from '@/app/common/header/header';
import { OrderingHistoryViewV2 } from '@/sections/transactions/ordering-history-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ordering History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Ordering History', href: '' },
        ]}
      />

      <OrderingHistoryViewV2 />
    </div>
  );
};

export default Page;
