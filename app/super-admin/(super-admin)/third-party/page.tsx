import Header from '@/app/common/header/header';
import ThirdPartyView from '@/sections/third-party-view/third-party-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Third Party - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Third Party', href: '' },
        ]}
      />

      <ThirdPartyView />
    </div>
  );
};

export default Page;
