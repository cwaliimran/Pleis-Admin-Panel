import Header from '@/app/common/header/header';
import MembersLoyaltyView from '@/sections/loyalty/loyalty-view/members-loyalty-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Detail - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Members', href: '/super-admin/members' },
          { name: 'Member Detail', href: '' },
        ]}
      />

      <MembersLoyaltyView />
    </div>
  );
};

export default Page;
