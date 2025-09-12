'use client';
import Header from '@/app/common/header';
import { MarketingRequestTable } from '@/sections/marketingrequest';

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Marketing Requests List', href: '' },
        ]}
      />
      <MarketingRequestTable />
    </div>
  );
};

export default Page;
