import Header from '@/app/common/header';
// import QrCodesView from '@/sections/qr-codes/qr-codes-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qr Codes - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Qr Codes', href: '' },
        ]}
      />

      {/* <QrCodesView /> */}
    </div>
  );
};

export default Page;
