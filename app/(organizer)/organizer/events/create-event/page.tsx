'use client';

import Header from '@/app/common/header';
import CreateEventView from '@/sections/event/create-event-view/create-event';

const Page = () => {
  return (
    <>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'New Event', href: '' },
        ]}
      />

      <CreateEventView userType="organizer" />
    </>
  );
};

export default Page;
