import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import DaypartView from '@/sections/menu-management-modules/daypart/daypart-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daypart - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Daypart', href: '' },
        ]}
      />

      <CompanyGuard>
        <DaypartView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
