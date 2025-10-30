import { CategoryManagement } from './category/category';
import { PinnedContentV2 } from './pinned-content/new-pinned-content';
import PromoManager from './promo-manager/promo-manager';
import QuickAccess from './quick-access/quick-access';

const MainSettings = () => {
  return (
    <>
      <div className="w-full px-4">
        <PromoManager
          heading="Top 10 / Promo Section"
          viewAll={true}
          fixLength={true}
        />
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 px-4 lg:grid-cols-2">
        <div>
          <CategoryManagement
            heading="Custom Categories"
            viewAll={true}
            fixLength={true}
          />
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
