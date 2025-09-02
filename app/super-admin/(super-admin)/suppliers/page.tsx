import Header from "@/app/common/header";
import SuppliersView from "@/sections/suppliers/suppliers-view";

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Suppliers", href: "" },
        ]}
      />

      <SuppliersView />
    </div>
  );
};

export default Page;
