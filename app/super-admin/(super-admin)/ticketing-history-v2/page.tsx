import Header from '@/app/common/header/header';
import { TicketingHistoryViewV2 } from '@/sections/transactions/ticketing-history-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ticketing History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Ticketing History', href: '' },
        ]}
      />

      <TicketingHistoryViewV2 />
    </div>
  );
};

export default Page;
