import Header from '@/app/common/header/header';
import { SubscriptionManagementView } from '@/sections/subscription/super-admin-subscription/subscription-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription Management - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Admin Subscription', href: '' },
        ]}
      />

      <SubscriptionManagementView />
    </div>
  );
};

export default Page;
