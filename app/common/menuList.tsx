import { FC, useState } from "react";
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
import { redirect, usePathname } from "next/navigation";
import MenuItem from "./menuItem";
import { cn } from "@/lib/utils";
import { is } from "date-fns/locale";

interface PageProps {
  menuGroups: any;
}

const MenuList: FC<PageProps> = ({ menuGroups }) => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar, state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null); // 👈 new state

  const toggleGroup = (groupKey: string) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  };

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

      <SidebarContent>
        {menuGroups.map((group: any) => {
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
                onClick={() => {
                  toggleGroup(group.key);
                  if (isMobile) toggleSidebar();
                  if (!hasItems) redirect(group.key);
                }}
                className={cn(
                  "flex items-center font-medium text-sm hover:bg-muted rounded-md cursor-pointer transition-all duration-200",
                  pathname === group.key ? "bg-muted dark:bg-black" : "",
                  isCollapsed
                    ? "justify-center px-2 py-2 min-w-[36px]"
                    : "justify-between w-full px-3 py-2"
                )}
              >
                <div
                  className={cn(
                    "flex items-center transition-all duration-200",
                    isCollapsed
                      ? "justify-center w-full px-0 py-1"
                      : "gap-2 px-0"
                  )}
                  style={isCollapsed ? { minHeight: 40 } : {}}
                >
                  <div className="flex items-center justify-center w-8 h-8 mx-auto">
                    <group.icon className="w-5 h-5" />
                  </div>
                  {!isCollapsed && (
                    <span className="truncate transition-all duration-200">
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
                    transition={{ duration: 0.3, ease: "easeInOut" }}
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

              {/* 🪄 Popup Submenu if Collapsed (NOT expanded)
              {hoveredGroup === group.key && !isOpen && hasItems && (
                <AnimatePresence>
                  <m.div
                    className="absolute left-full top-0 z-50 ml-2 min-w-[200px] bg-white dark:bg-zinc-900 border rounded shadow-xl p-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <SidebarMenu>
                      <MenuItem items={group.items} parentKey={group.key} />
                    </SidebarMenu>
                  </m.div>
                </AnimatePresence>
              )} */}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default MenuList;