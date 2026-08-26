import Header from '@/app/common/header/header';
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
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Order Settings', href: '' },
        ]}
      />

      <OrderingSettingsViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
