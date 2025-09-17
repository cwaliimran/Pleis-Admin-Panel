import Header from '@/app/common/header';
import PromotionsView from '@/sections/promotions/promotions-view';
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

      <PromotionsView />
    </div>
  );
};

export default Page;
