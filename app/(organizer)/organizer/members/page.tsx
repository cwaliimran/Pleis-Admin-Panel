import Header from '@/app/common/header/header';
import LoyaltyMembersView from '@/sections/loyalty-modules/members/members-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Members', href: '' },
        ]}
      />

      <LoyaltyMembersView usertype="organizer" global={false} />
    </div>
  );
};

export default Page;
