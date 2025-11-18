import Header from '@/app/common/header';
import PromoCodeView from '@/sections/promo-code/promo-code-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promo Code - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Promo Code', href: '' },
        ]}
      />

      <PromoCodeView />
    </div>
  );
};

export default Page;
