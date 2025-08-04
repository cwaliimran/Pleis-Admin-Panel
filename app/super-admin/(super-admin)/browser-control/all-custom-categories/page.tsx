import Header from "@/app/common/header";
import { ViewAllCategoryManagement } from "@/sections/brower-control/components/main-setting/view-all-custom-categories/view-all-custom-categories";

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Browser Control", href: "/super-admin/browser-control" },
          { name: "All Custom Categories", href: "" },
        ]}
      />

      <ViewAllCategoryManagement />
    </div>
  );
};

export default Page;
