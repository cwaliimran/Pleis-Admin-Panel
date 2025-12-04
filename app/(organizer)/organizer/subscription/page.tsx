import Header from '@/app/common/header/header';
import { OrganizerSubscriptionView } from '@/sections/subscription/organizer-subscription/organizer-subscription-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Subscription', href: '' },
        ]}
      />

      <OrganizerSubscriptionView />
    </div>
  );
};

export default Page;
