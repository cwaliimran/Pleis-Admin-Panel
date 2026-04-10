import Header from '@/app/common/header/header';
import ReservationAnalyticsView from '@/sections/loyalty/loyalty-view/reservation-analytics-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Analytics', href: '' },
        ]}
      />

      <ReservationAnalyticsView global={false} userType="organizer" />
    </div>
  );
};

export default Page;
