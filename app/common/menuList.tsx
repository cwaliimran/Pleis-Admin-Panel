"use client";
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
import { useQuickNavigation } from "@/hooks/useQuickNavigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion as m } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import MenuItem from "./menuItem";

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
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setOpenGroup(null);
        setHoveredGroup(null);
        if (hoverTimeout) clearTimeout(hoverTimeout);
        if (state === "collapsed" && typeof toggleSidebar === "function") {
          toggleSidebar();
        }
      }
    };
    window.addEventListener("resize", handleResize);
    // Call once on mount to handle initial state
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hoverTimeout, state, toggleSidebar]);

  useEffect(() => {
    if (isCollapsed) {
      setOpenGroup(null);
      setHoveredGroup(null);
      setHoverTimeout(null);
    }
  }, [isCollapsed]);

  const toggleGroup = useCallback((groupKey: string) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  }, []);

  const handleGroupClick = useCallback(
    (group: any) => {
      const hasItems = group.items?.length > 0;

      if (hasItems) {
        if (!isCollapsed) {
          toggleGroup(group.key);
        }
      } else {
        navigate(group.key);
        if (isMobile) {
          setOpenGroup(null);
          toggleSidebar();
        }
      }
    },
    [navigate, isMobile, toggleSidebar, toggleGroup, isCollapsed]
  );

  const memoizedMenuItems = useMemo(() => {
    return menuGroups.map((group: any) => {
      const isOpen = openGroup === group.key;
      const hasItems = group.items?.length > 0;

      return (
        <SidebarGroup
          key={group.key}
          className="relative group py-0 my-0 "
          onMouseEnter={() => {
            if (isCollapsed && hasItems) setHoveredGroup(group.key);
            if (hoverTimeout) clearTimeout(hoverTimeout);
            setHoveredGroup(group.key);
          }}
        >
          <button
            type="button"
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
                "group relative flex items-center transition-all duration-100",
                isCollapsed
                  ? "justify-center w-full px-0 py-1 min-h-[40px]"
                  : "gap-2 px-0"
              )}
            >
              {/* Icon wrapper */}
              <div className="flex items-center justify-center w-8 h-8">
                <group.icon className="w-5 h-5" />
              </div>

              {/* Label (visible only if expanded) */}
              {!isCollapsed && (
                <span className="truncate transition-all duration-100">
                  {group.label}
                </span>
              )}

              {/* Chevron appears on hover (collapsed only, and has children) */}
              {isCollapsed && hasItems && (
                <div className="absolute right-[-10px] group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
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

          {/* Inline submenu (for expanded sidebar) */}
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

          {/* Tooltip submenu (for collapsed sidebar) */}
          {isCollapsed && hoveredGroup === group.key && hasItems && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setHoveredGroup(null);
                }, 100);
                setHoverTimeout(timeout);
              }}
              className="fixed left-[70px] z-50 ml-2 max-h-60 overflow-y-auto rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-2 space-y-1"
            >
              {group.items.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                    navigate(item.url);
                    setHoveredGroup(null);
                  }}
                  className={cn(
                    "block w-full  text-start text-sm px-3 py-2 rounded-md hover:bg-muted transition cursor-pointer",
                    pathname === item.url ? "bg-muted font-semibold" : ""
                  )}
                >
                  {item.title}
                </button>
              ))}
            </m.div>
          )}
        </SidebarGroup>
      );
    });
  }, [
    menuGroups,
    openGroup,
    pathname,
    isCollapsed,
    hoveredGroup,
    handleGroupClick,
    navigate,
    toggleSidebar,
    isMobile,
    hoverTimeout,
  ]);

  return (
    <Sidebar
      className="relative z-10 overflow-visible a-50 "
      collapsible="icon"
    >
      <SidebarHeader>
        <h1
          className={cn(
            !isCollapsed ? "text-4xl" : "text-xl",
            "font-bold text-center z-10 pt-3 pb-1 transition-all duration-200",
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
