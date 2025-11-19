import Header from '@/app/common/header/header';
// import OrderSettingsView from '@/sections/order-settings/order-settings-view';
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

      {/* <OrderSettingsView /> */}
    </div>
  );
};

export default Page;
