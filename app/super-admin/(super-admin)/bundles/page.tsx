import Header from '@/app/common/header/header';
import BundlesView from '@/sections/bundles/bundles-view';
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

      <BundlesView />
    </div>
  );
};

export default Page;
