import Header from '@/app/common/header/header';
import NotificationAnalyticsView from '@/sections/loyalty/loyalty-view/notification-analytics';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications Analytics - Pleis',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
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


// import Header from '@/app/common/header/header';
// import NotificationAnalyticsView from '@/sections/loyalty/loyalty-view/notification-analytics';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Notifications Analytics - Pleis',
// };

// const Page = ({ params }: { params: { id: string } }) => {
//   return (
//     <div className="min-h-screen pb-12">
//       <Header
//         links={[
//           { name: 'Dashboard', href: '/super-admin' },
//           { name: 'Notifications Analytics', href: '' },
//         ]}
//       />

//       <NotificationAnalyticsView notificationId={params?.id || ''} />
//     </div>
//   );
// };

// export default Page;
