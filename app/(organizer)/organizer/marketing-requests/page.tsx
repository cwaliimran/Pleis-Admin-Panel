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
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Marketing Requests', href: '' },
        ]}
      />

      <MarketingRequestView userType="organizer" />
    </div>
  );
};

export default Page;
