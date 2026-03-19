import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import LoyaltyView from '@/sections/loyalty/loyalty-view/loyalty-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loyalty Dashboard - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen px-2 pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Loyalty', href: '' },
        ]}
      />

      <CompanyGuard>
        <LoyaltyView global={false} userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
