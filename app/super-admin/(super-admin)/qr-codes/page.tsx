import Header from '@/app/common/header/header';
import { QRCodeGeneratorView } from '@/sections/app-ordering/qr-codes/qr-code-generator-view';
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

      <QRCodeGeneratorView />
    </div>
  );
};

export default Page;
