"use client";

import Header from "@/app/common/header";
import EventDetailsPage from "@/sections/event/eventDetailsPage";

const Page = () => {
  return (
    <div className=" min-h-screen pb-6">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Events", href: "/super-admin/events" },
          { name: "Event Detail", href: "" },
        ]}
      />

      <EventDetailsPage />
    </div>
  );
};

export default Page;
