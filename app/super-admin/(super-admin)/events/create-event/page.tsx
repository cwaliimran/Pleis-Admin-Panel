import Header from '@/app/common/header';
import CreateEventView from '@/sections/event/create-event-view/create-event';
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

        <CreateEventView userType="super-admin" title={'Create'} />
      </div>
    </>
  );
};

export default Page;
