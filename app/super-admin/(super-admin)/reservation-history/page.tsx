import Header from '@/app/common/header/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservation History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reservation History', href: '' },
        ]}
      />

      <h1 className="px-3 text-2xl font-semibold sm:px-5">Reservation History</h1>
    </div>
  );
};

export default Page;
