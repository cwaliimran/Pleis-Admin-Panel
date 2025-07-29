import { CategoryManagement } from "./category/category";
import { PinnedContentV2 } from "./category/new-pinned-content";
import PromoManager from "./promo-manager/promo-manager";
import QuickAccess from "./quick-access";

const MainSettings = () => {
  return (
    <>
      <div className="w-full px-4">
        <PromoManager />
      </div>

      <div className="w-full px-4">
        <QuickAccess />
      </div>

      <div className="px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div>
          <CategoryManagement />
        </div>
        <div>
          <PinnedContentV2 />
        </div>
        {/* <div>
          <QuickAccess />
        </div> */}
      </div>
    </>
  );
};

export default MainSettings;
