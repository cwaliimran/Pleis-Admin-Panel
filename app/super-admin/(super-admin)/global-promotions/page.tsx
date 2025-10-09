import Header from '@/app/common/header';
import PromotionsView from '@/sections/promotions/promotions-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Promotions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Global Promotions', href: '' },
        ]}
      />

      <PromotionsView global={true} />
    </div>
  );
};

export default Page;
