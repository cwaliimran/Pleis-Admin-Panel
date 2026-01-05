import Header from '@/app/common/header/header';
import GlobalNotificationsView from '@/sections/global-notifications/global-notification-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Notifications - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Global Notifications', href: '' },
        ]}
      />

      <GlobalNotificationsView />
    </div>
  );
};

export default Page;
