import Header from '@/app/common/header/header';
import { OrganizerSubscriptionRoleView } from '@/sections/subscription/organizer-subscription/organizer-subscription-role-view';
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

      <OrganizerSubscriptionRoleView />
    </div>
  );
};

export default Page;
