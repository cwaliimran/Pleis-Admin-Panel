import Header from '@/app/common/header/header';
import StatusView from '@/sections/status/status-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Status - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Status', href: '' },
        ]}
      />

      <StatusView />
    </div>
  );
};

export default Page;
