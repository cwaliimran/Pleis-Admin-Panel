import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import BundlesView from '@/sections/reservation-modules/bundles/bundles-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bundles - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Bundles', href: '' },
        ]}
      />

      <CompanyGuard>
        <BundlesView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
