import Header from '@/app/common/header/header';
import { ReservationViewV2 } from '@/sections/reservation-modules/reservation-view-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation Management - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Reservations', href: '' },
          { name: 'Management', href: '' },
        ]}
      />

      <ReservationViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
