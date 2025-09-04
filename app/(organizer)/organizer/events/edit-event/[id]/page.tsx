"use client";

import Header from "@/app/common/header";
import CreateEventView from "@/sections/event/create-event-view/create-event";

const Page = () => {
  return (
    <>
     <Header
            links={[
              { name: 'Dashboard', href: '/super-admin' },
              { name: 'Edit Event', href: '' },
            ]}
          />
      <CreateEventView title={'Edit'} />
    </>
  );
};

export default Page;
