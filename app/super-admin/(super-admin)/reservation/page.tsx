import Header from '@/app/common/header';
import ReservationView from '@/sections/reservation-view/reservation-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reservation', href: '' },
        ]}
      />

      <ReservationView />
    </div>
  );
};

export default Page;
