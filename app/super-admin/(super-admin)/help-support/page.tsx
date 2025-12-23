import Header from '@/app/common/header/header';
import HelpSupportView from '@/sections/help-support/help-support-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Help & Support', href: '' },
        ]}
      />

      <HelpSupportView />
    </div>
  );
};

export default Page;
