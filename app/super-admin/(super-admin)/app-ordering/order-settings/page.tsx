import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import { OrderingSettingsView } from '@/sections/app-ordering/app-ordering-settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Settings - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Order Settings', href: '' },
        ]}
      />

      <CompanyGuard>
        <OrderingSettingsView userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
