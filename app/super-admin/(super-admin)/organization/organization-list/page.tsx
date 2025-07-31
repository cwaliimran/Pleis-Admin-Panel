import Header from "@/app/common/header";
import OrganizationList from "@/sections/organization-section/organization-list";

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Organizations List", href: "" },
        ]}
      />

      <OrganizationList userType="super-admin" />
    </div>
  );
};

export default Page;
