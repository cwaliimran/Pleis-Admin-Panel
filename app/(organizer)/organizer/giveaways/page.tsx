import Header from '@/app/common/header/header';
import GiveawaysView from '@/sections/giveaways/giveaways-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giveaways - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Giveaways', href: '' },
        ]}
      />

      <GiveawaysView userType="organizer" />
    </div>
  );
};

export default Page;
