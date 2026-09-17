import Header from '@/app/common/header/header';
import { ReservationHistoryViewV2 } from '@/sections/transactions/reservation-history-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reservation History', href: '' },
        ]}
      />

      <ReservationHistoryViewV2 />
    </div>
  );
};

export default Page;
