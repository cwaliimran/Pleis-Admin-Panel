import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import ComboView from '@/sections/menu-management-modules/combos/combos-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combos - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Combos', href: '' },
        ]}
      />

      <CompanyGuard>
        <ComboView userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
