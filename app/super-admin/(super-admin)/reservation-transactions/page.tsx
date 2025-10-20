import Header from '@/app/common/header';
import ReservationTransactionView from '@/sections/reservation-transaction/reservation-transaction-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation Transactions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reservation Transactions', href: '' },
        ]}
      />

      <ReservationTransactionView />
    </div>
  );
};

export default Page;
