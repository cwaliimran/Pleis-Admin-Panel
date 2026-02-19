import Header from '@/app/common/header/header';
import { CreateEventView } from '@/sections/event/eventV2';
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
      <CreateEventView title="Edit" userType="organizer" />
    </>
  );
};

export default Page;
