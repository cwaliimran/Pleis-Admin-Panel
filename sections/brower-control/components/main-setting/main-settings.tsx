import { CategoryManagement } from "./category/category";
import { PinnedContentV2 } from "./pinned-content/new-pinned-content";
import PromoManager from "./promo-manager/promo-manager";
import QuickAccess from "./quick-access/quick-access";

const MainSettings = () => {
  return (
    <>
      <div className="w-full px-4">
        <PromoManager />
      </div>

      <div className="px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div>
          <CategoryManagement />
        </div>
        <div>
          <PinnedContentV2 />
        </div>
      </div>

      <div className="mt-4 w-full px-4">
        <QuickAccess />
      </div>
    </>
  );
};

export default MainSettings;
