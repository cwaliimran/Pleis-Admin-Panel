import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import ReservationCalendar from '@/sections/reservation-modules/reservation-calendar/reservation-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendar - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Reservation', href: '' },
        ]}
      />

      <CompanyGuard>
        <ReservationCalendar userType="organizer" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
