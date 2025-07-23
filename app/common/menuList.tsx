import { FC, useState, useCallback, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion as m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useQuickNavigation } from "@/hooks/useQuickNavigation";
import MenuItem from "./menuItem";
import { cn } from "@/lib/utils";

interface PageProps {
  menuGroups: any;
}

const MenuList: FC<PageProps> = ({ menuGroups }) => {
  const pathname = usePathname();
  const { navigate } = useQuickNavigation();
  const { isMobile, toggleSidebar, state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const toggleGroup = useCallback((groupKey: string) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  }, []);

  const handleGroupClick = useCallback(
    (group: any) => {
      const hasItems = group.items?.length > 0;

      if (hasItems) {
        toggleGroup(group.key);
      } else {
        // Navigate immediately for groups without items
        navigate(group.key);
      }

      if (isMobile) {
        toggleSidebar();
      }
    },
    [navigate, isMobile, toggleSidebar, toggleGroup]
  );

  const memoizedMenuItems = useMemo(() => {
    return menuGroups.map((group: any) => {
      const isOpen = openGroup === group.key;
      const hasItems = group.items?.length > 0;

      return (
        <SidebarGroup
          key={group.key}
          className="relative group py-0 my-0"
          onMouseEnter={() => {
            if (!isOpen && hasItems) setHoveredGroup(group.key);
          }}
          onMouseLeave={() => setHoveredGroup(null)}
        >
          <button
            onClick={() => handleGroupClick(group)}
            className={cn(
              "sidebar-nav-item flex items-center font-medium text-sm hover:bg-muted rounded-md cursor-pointer transition-all duration-100",
              pathname === group.key ? "bg-muted dark:bg-black" : "",
              isCollapsed
                ? "justify-center px-2 py-2 min-w-[36px]"
                : "justify-between w-full px-3 py-2"
            )}
          >
            <div
              className={cn(
                "flex items-center transition-all duration-100",
                isCollapsed
                  ? "justify-center w-full px-0 py-1 min-h-[40px]"
                  : "gap-2 px-0"
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 mx-auto">
                <group.icon className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="truncate transition-all duration-100">
                  {group.label}
                </span>
              )}
            </div>
            {!isCollapsed &&
              hasItems &&
              (isOpen ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              ))}
          </button>

          {/* 🔽 Inline Submenu (Expanded Group) */}
          <AnimatePresence initial={false}>
            {isOpen && hasItems && (
              <m.div
                className="ml-2 overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <SidebarGroupContent>
                  <SidebarMenu>
                    <MenuItem
                      items={group.items}
                      parentKey={group.key}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenu>
                </SidebarGroupContent>
              </m.div>
            )}
          </AnimatePresence>
        </SidebarGroup>
      );
    });
  }, [
    menuGroups,
    openGroup,
    pathname,
    isCollapsed,
    handleGroupClick,
    hoveredGroup,
  ]);

  return (
    <Sidebar className="relative z-10 overflow-visible" collapsible="icon">
      <SidebarHeader>
        <h1
          className={cn(
            !isCollapsed ? "text-4xl" : "text-xl",
            "font-bold text-center z-10 transition-all duration-200",
            isCollapsed ? "px-0" : "px-4"
          )}
        >
          {isCollapsed ? "P" : "PLEIS"}
        </h1>
      </SidebarHeader>

      <SidebarContent>{memoizedMenuItems}</SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default MenuList;
