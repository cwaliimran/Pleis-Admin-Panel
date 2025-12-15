import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import { OrderManagementView } from '@/sections/app-ordering/order-management/order-management-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Management - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Order Management', href: '' },
        ]}
      />

      <CompanyGuard>
        <OrderManagementView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
