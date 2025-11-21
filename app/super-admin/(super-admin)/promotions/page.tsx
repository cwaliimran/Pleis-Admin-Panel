import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Promotions', href: '' },
        ]}
      />

      <CompanyGuard>
        <PromotionsView global={false} />
      </CompanyGuard>
    </div>
  );
};

export default Page;
