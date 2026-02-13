import Header from '@/app/common/header/header';
import OrganizerPromotionsView from '@/sections/loyalty-modules/organizer-promotions/promotions-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Promotions', href: '' },
        ]}
      />

      <OrganizerPromotionsView />
    </div>
  );
};

export default Page;
