import Header from "@/app/common/header";
import HighlightView from "@/sections/highlight/highlight-view";

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Highlights", href: "" },
        ]}
      />

      <HighlightView />
    </div>
  );
};

export default Page;
