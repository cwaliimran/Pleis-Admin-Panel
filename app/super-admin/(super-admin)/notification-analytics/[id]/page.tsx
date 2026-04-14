import Header from '@/app/common/header/header';
import NotificationAnalyticsView from '@/sections/loyalty/loyalty-view/notification-analytics';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications Analytics - Pleis',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page =async ({ params }:Props) => {

   const { id } = await params;
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Notifications Analytics', href: '' },
        ]}
      />

      <NotificationAnalyticsView notificationId={id || ''} />
    </div>
  );
};

export default Page;
