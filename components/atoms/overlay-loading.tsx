import React from "react";

type OverlayLoadingProps = {
    show: boolean;
};

const OverlayLoading: React.FC<OverlayLoadingProps> = ({ show }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <span className="mt-4 text-white text-lg font-semibold">Loading...</span>
            </div>
        </div>
    );
};

export default OverlayLoading;