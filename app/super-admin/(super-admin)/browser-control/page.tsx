import Header from "@/app/common/header";
import BrowserControlPage from "@/sections/brower-control/browser-control-view";

const Page = () => {
  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Browser Control", href: "" },
        ]}
      />

      <BrowserControlPage />
    </div>
  );
};

export default Page;
