import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import GiveawaysView from '@/sections/giveaways/giveaways-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giveaways - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Giveaways', href: '' },
        ]}
      />

      <CompanyGuard>
        <GiveawaysView userType="super-admin" />
      </CompanyGuard>
    </div>
  );
};

export default Page;
