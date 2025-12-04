import Header from '@/app/common/header/header';
import MarketingRequestView from '@/sections/marketing-request/marketing-request-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Requests - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Marketing Requests', href: '' },
        ]}
      />

      <MarketingRequestView />
    </div>
  );
};

export default Page;
