import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";

interface PageProps {
  fromOrganizer?: boolean;
}
const SidebarToggleButton: FC<PageProps> = ({ fromOrganizer }) => {
  const { isMobile, openMobile, open, toggleSidebar, state } = useSidebar();

  // Sidebar collapsed width is 4.5rem (72px), so use 80px for a little margin
  const collapsedLeft = "md:left-[70px]";
  const expandedLeft = "md:left-[220px]";
  const defaultLeft = "md:left-[0px]";

  return (
    <div
      className={`fixed ${
        fromOrganizer ? "top-0" : "top-4"
      } z-30 transition-all duration-300 ${
        open
          ? expandedLeft
          : state === "collapsed"
          ? collapsedLeft
          : defaultLeft
      } left-0`}
    >
      <button
        onClick={toggleSidebar}
        className="ml-3 p-1 rounded-md shadow bg-muted  dark:bg-[#171717] dark:border-[#2e2f2f] border-[1px] hover:bg-muted/80 cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {isMobile ? (
          openMobile ? (
            <ChevronLeft  className="cursor-pointer"/>
          ) : (
            <ChevronRight className="cursor-pointer"/>
          )
        ) : open ? (
          <ChevronLeft className="cursor-pointer"/>
        ) : (
          <ChevronRight className="cursor-pointer"/>
        )}
      </button>
    </div>
  );
};

export default SidebarToggleButton;