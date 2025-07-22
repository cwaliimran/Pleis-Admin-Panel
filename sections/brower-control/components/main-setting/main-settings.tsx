import React from "react";
import { CategoryManagement } from "./category/category";
import PinnedContent from "./pinned-content";
import PromoManager from "./promo-manager";

const MainSettings = () => {
  return (
    <>
      <div className="w-full grid grid-cols-2 gap-4">
        <div>
          <PromoManager />
        </div>
        <div>
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
