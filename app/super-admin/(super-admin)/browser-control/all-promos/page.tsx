"use client";
import Header from "@/app/common/header";
import ViewAllPromos from "@/sections/brower-control/components/main-setting/view-all-promo/view-all-promo";

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Browser Control", href: "" },
        ]}
      />

      <ViewAllPromos />
    </div>
  );
};

export default Page;
