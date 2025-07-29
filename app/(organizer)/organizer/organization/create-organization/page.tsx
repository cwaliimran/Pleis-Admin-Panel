"use client";

import Header from "@/app/common/header";
import CreateOrganizationPage from "@/sections/organization-section/create-organization";

const Page = () => {
  return (
    <div className="bg-muted/40 min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/organizer/dashboard" },
          { name: "Organizations", href: "" },
        ]}
      />

      <CreateOrganizationPage id="1" />
    </div>
  );
};

export default Page;
