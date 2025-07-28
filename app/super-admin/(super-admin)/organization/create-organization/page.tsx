"use client";

import Header from "@/app/common/header";
import CreateOrganizationPage from "@/sections/create-organization/create-organization";

const Page = () => {
  return (
    <div className=" min-h-screen pb-12">
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
