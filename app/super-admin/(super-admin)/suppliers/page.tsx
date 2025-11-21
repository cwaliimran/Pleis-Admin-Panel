import Header from '@/app/common/header/header';
import SuppliersView from '@/sections/suppliers/suppliers-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suppliers - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Suppliers', href: '' },
        ]}
      />

      <SuppliersView />
    </div>
  );
};

export default Page;
