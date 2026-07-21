import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import DiscountsView from '@/sections/menu-management-modules/discounts/discounts-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discounts - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Discounts', href: '' },
        ]}
      />

      <CompanyGuard>
        <DiscountsView userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
