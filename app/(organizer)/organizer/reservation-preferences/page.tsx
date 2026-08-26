import Header from '@/app/common/header/header';
import { ReservationPreferencesView } from '@/sections/reservation-modules/reservation-preferences';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation Preferences - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Reservation Preferences', href: '' },
        ]}
      />

      <ReservationPreferencesView userType="organizer" />
    </div>
  );
};

export default Page;
