import Header from '@/app/common/header/header';
// import CompanyGuard from '@/components/guards/CompanyGuard';
// import { OrderManagementViewV2 } from '@/sections/app-ordering/order-management-v2/order-management-view-v2';
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

      {/* <CompanyGuard>
        <OrderManagementViewV2 />
      </CompanyGuard> */}
    </div>
  );
};

export default Page;
