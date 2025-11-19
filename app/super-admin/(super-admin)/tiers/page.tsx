import Header from '@/app/common/header/header';
import TiersView from '@/sections/tiers/tiers-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiers - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Tiers', href: '' },
        ]}
      />

      <TiersView />
    </div>
  );
};

export default Page;
