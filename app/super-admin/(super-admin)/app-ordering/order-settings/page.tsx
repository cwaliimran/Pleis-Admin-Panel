import Header from '@/app/common/header/header';
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

      <OrderingSettingsView />
    </div>
  );
};

export default Page;
