import Header from '@/app/common/header';
import { CreateEventView } from '@/sections/event/eventV2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Event - Pleis',
};

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-[#f8f6f7] pb-12 dark:bg-black">
        <Header
          links={[
            { name: 'Dashboard', href: '/super-admin' },
            { name: 'Event', href: '' },
          ]}
        />

        <CreateEventView title="Create" userType="super-admin" />
      </div>
    </>
  );
};

export default Page;
