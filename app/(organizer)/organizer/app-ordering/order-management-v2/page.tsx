import Header from '@/app/common/header/header';
import { OrderManagementViewV2 } from '@/sections/app-ordering/order-management-v2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Management - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Order Management', href: '' },
        ]}
      />

      <OrderManagementViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
