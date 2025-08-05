import Header from "@/app/common/header";
import LoyaltyView from "@/sections/loyalty/loyalty-view/loyalty-view";

const Page = () => {
  return (
    <div className="min-h-screen pb-12 px-2">
      <Header
        links={[
          { name: "Dashboard", href: "/organizer/dashboard" },
          { name: "Loyalty", href: "" },
        ]}
      />

      <LoyaltyView />
    </div>
  );
};

export default Page;
