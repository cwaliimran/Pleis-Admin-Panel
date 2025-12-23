import Header from '@/app/common/header/header';
import TopPicks from '@/sections/brower-control/components/main-setting/top-picks/top-picks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browser Control - Pleis',
};

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Browser Control', href: '/super-admin/browser-control' },
          { name: 'All Top Picks', href: '' },
        ]}
      />

      <TopPicks heading="All Top Picks" viewAll={false} fixLength={false} />
    </div>
  );
};

export default Page;
