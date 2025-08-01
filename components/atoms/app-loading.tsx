"use client";

// import { Loader2 } from "lucide-react";
import { FC } from "react";

const AppLoading: FC = () => {
  return (
    // <div className="flex items-center justify-center w-full min-h-[90vh] h-full">
    //   <Loader2 className="animate-spin" />
    // </div>
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export { AppLoading };
