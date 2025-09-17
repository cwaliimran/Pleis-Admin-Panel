import Header from '@/app/common/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Settings', href: '' },
        ]}
      />

      {/* <MembersView /> */}
    </div>
  );
};

export default Page;
