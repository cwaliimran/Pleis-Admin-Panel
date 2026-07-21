import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import DietTagsView from '@/sections/menu-management-modules/diet-tags/diet-tags-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diet Tags - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Diet Tags', href: '' },
        ]}
      />

      <CompanyGuard>
        <DietTagsView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
