import Header from '@/app/common/header';
import TermsAndConditionsPage from '@/sections/terms/terms-view';

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
