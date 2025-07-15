import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";

interface PageProps {
    fromOrganizer?: boolean;
}
const SidebarToggleButton: FC<PageProps> = ({ fromOrganizer }) => {
    const { isMobile, openMobile, open, toggleSidebar } = useSidebar();

    return (
        <div
            className={`fixed ${fromOrganizer ? "top-0" : "top-4"} z-30 transition-all duration-300 ${open ? "md:left-[220px]" : "md:left-[0px]" // adjust collapsed width
                } left-0`}
        >
            <button
                onClick={toggleSidebar}
                className="ml-3 p-2 rounded-md shadow bg-muted  dark:bg-[#171717] dark:border-[#2e2f2f] border-[1px] hover:bg-muted/80 cursor-pointer"
                aria-label="Toggle sidebar"
            >
                {isMobile
                    ? openMobile
                        ? <ChevronLeft />
                        : <ChevronRight />
                    : open
                        ? <ChevronLeft />
                        : <ChevronRight />}
            </button>
        </div>
    );
};

export default SidebarToggleButton;