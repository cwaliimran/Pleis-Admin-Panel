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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Edit Event', href: '' },
        ]}
      />

      {/* <CreateEventView userType="super-admin" title={'Edit'} /> */}
      <CreateEventView title="Edit" userType="super-admin" />
    </>
  );
};

export default Page;
