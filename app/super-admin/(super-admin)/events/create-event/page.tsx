import Header from '@/app/common/header';
// import CompanyGuard from '@/components/guards/CompanyGuard';
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

        {/* <CompanyGuard> */}
        <CreateEventView title="Create" userType="super-admin" />
        {/* </CompanyGuard> */}
        {/* <CreateEventView userType="super-admin" title={'Create'} /> */}
      </div>
    </>
  );
};

export default Page;
