import Header from '@/app/common/header/header';
import PromoManager from '@/sections/brower-control/components/main-setting/promo-manager/promo-manager';
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
          { name: 'All Popular Events', href: '' },
        ]}
      />

      <PromoManager heading="Popular Events" viewAll={false} fixLength={false} />
    </div>
  );
};

export default Page;
