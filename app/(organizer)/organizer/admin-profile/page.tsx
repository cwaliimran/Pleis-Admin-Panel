"use client";
import React from "react";
import Header from "@/app/common/header";

import { AdminProfileSection } from "@/sections/proflie";

const Page = () => {
  return (
    <div className=" ">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Profile", href: "" },
        ]}
      />

      <AdminProfileSection />
    </div>
  );
};

export default Page;
