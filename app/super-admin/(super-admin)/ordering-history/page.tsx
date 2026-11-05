import Header from '@/app/common/header/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ordering History - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Ordering History', href: '' },
        ]}
      />

      <h1 className="px-3 text-2xl font-semibold sm:px-5">Ordering History</h1>
    </div>
  );
};

export default Page;
