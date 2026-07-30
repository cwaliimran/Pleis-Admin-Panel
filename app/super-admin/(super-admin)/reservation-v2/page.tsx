import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reservations', href: '' },
          { name: 'Management', href: '' },
        ]}
      />

      <CompanyGuard>
        <ReservationViewV2 userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
