import Header from '@/app/common/header/header';
import { CreateEventView } from '@/sections/event/eventV2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Event - Pleis',
};

const Page = () => {
  return (
    <>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'New Event', href: '' },
        ]}
      />

      {/* <CreateEventView userType="organizer" title={'Create'} /> */}
      <CreateEventView title="Create" userType="organizer" />
    </>
  );
};

export default Page;
