import Header from '@/app/common/header/header';
import UpdatesView from '@/sections/updates/updates-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Updates - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Updates', href: '' },
        ]}
      />

      <UpdatesView />
    </div>
  );
};

export default Page;
