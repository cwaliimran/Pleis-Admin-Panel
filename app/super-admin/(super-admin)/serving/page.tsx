import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import ServingView from '@/sections/menu-management-modules/serving/serving-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serving - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Serving', href: '' },
        ]}
      />

      <CompanyGuard>
        <ServingView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
