import Header from '@/app/common/header/header';
import SuperAdminDashboardView from '@/sections/super-admin-dashboard/super-admin-dashboard-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard- Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header links={[{ name: 'Dashboard', href: '/super-admin' }, { name: 'Home' }]} />

      <SuperAdminDashboardView />
    </div>
  );
};

export default Page;
