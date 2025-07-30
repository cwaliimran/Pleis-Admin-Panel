"use client";

import Header from "@/app/common/header";
import CreateOrganizationPage from "@/sections/organization-section/create-organization";

const Page = () => {
  return (
    <div className="min-h-screen pb-12 bg-[#f8f6f7] dark:bg-black">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Organizations", href: "" },
        ]}
      />

      <CreateOrganizationPage id="1" />
    </div>
  );
};

export default Page;
