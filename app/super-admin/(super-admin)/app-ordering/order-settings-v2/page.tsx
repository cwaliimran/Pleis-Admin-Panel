import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import { OrderingSettingsViewV2 } from '@/sections/app-ordering/app-ordering-settings-v2';
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
        <OrderingSettingsViewV2 userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
