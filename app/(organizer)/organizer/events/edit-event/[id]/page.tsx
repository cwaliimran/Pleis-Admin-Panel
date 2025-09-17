import Header from '@/app/common/header';
import CreateEventView from '@/sections/event/create-event-view/create-event';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Event - Pleis',
};

const Page = () => {
  return (
    <>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Edit Event', href: '' },
        ]}
      />
      <CreateEventView userType="organizer" title={'Edit'} />
    </>
  );
};

export default Page;
