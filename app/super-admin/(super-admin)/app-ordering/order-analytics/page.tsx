import Header from '@/app/common/header';
// import OrderAnalyticsView from '@/sections/order-analytics/order-analytics-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Analytics - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Order Analytics', href: '' },
        ]}
      />

      {/* <OrderAnalyticsView /> */}
    </div>
  );
};

export default Page;
