import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reservation Preferences', href: '' },
        ]}
      />

      <CompanyGuard>
        <ReservationPreferencesView userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
