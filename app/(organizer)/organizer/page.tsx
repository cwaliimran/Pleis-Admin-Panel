import Header from '@/app/common/header/header';
import OrganizerDashboard from '@/sections/organizer/organizer-dashboard';
// import SuperAdminDashboardView from '@/sections/super-admin-dashboard/super-admin-dashboard-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-6">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Events', href: '' },
        ]}
      />

      <OrganizerDashboard />
      {/* <SuperAdminDashboardView userType="organizer" /> */}
    </div>
  );
};

export default Page;
