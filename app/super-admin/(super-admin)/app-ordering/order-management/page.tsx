import Header from '@/app/common/header/header';
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

      <OrderManagementView />
    </div>
  );
};

export default Page;
