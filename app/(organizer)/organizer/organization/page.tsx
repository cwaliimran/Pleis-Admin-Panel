import Header from "@/app/common/header";
import OrganizationList from "@/sections/organization-section/organization-list";

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/organizer/dashboard" },
          { name: "Organizations", href: "" },
        ]}
      />

      <OrganizationList userType="organizer" />
    </div>
  );
};

export default Page;
