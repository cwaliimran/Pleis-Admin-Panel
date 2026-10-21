import Header from '@/app/common/header/header';
import { PayoutsBatchesViewV2 } from '@/sections/transactions/payouts-batches-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payouts & Batches - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Payouts & Batches', href: '' },
        ]}
      />

      <PayoutsBatchesViewV2 />
    </div>
  );
};

export default Page;
