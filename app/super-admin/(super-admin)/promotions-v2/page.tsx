import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Loyalty', href: '/super-admin' },
          { name: 'Promotions Analytics', href: '' },
        ]}
      />

      <CompanyGuard>
        <PromotionsViewV2 />
      </CompanyGuard>
    </div>
  );
};

export default Page;
