import React from "react";
import { CategoryManagement } from "./category/category";
import PinnedContent from "./pinned-content";
import PromoManager from "./promo-manager";

const MainSettings = () => {
  return (
    <>
      <div className="w-full px-4">
        <PromoManager />
      </div>
      <div className="px-4 w-full grid grid-cols-3 gap-4 mt-8">
        <div className="col-span-2">
          <CategoryManagement />
        </div>
        <div>
          <PinnedContent />
        </div>
      </div>
    </>
  );
};

export default MainSettings;
