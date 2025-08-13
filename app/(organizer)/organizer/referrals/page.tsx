import Header from '@/app/common/header';
import ReferralsView from '@/sections/referrals/referrals-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Referrals', href: '' },
        ]}
      />

      <ReferralsView />
    </div>
  );
};

export default Page;
