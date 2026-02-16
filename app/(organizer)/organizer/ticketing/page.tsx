import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import TicketingView from '@/sections/ticketing-view/ticketing-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ticketing - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Ticketing', href: '' },
        ]}
      />

      <CompanyGuard>
        <TicketingView userType="organizer" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
