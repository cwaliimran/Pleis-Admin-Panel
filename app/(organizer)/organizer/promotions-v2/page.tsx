import Header from '@/app/common/header/header';
import PromotionsViewV2 from '@/sections/loyalty-modules/promotions-v2/promotions-view';
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

      <PromotionsViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
