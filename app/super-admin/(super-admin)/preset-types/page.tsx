import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import PresetTypesView from '@/sections/menu-management-modules/preset-types/preset-types-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preset Types - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Preset Types', href: '' },
        ]}
      />

      <CompanyGuard>
        <PresetTypesView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
