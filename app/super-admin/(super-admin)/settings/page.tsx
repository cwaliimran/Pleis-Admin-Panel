import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import SettingsView from '@/sections/settings-view/settings-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Settings', href: '' },
        ]}
      />
      <CompanyGuard>
        <SettingsView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
