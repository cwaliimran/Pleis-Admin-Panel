import Header from '@/app/common/header/header';
import TermsAndConditionsPage from '@/sections/terms/terms-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Terms & Conditions', href: '' },
        ]}
      />

      <TermsAndConditionsPage />
    </div>
  );
};

export default Page;
