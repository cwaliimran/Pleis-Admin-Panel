"use client";
 
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion as m, AnimatePresence } from "framer-motion";
 
type MenuItem = {
  title: string;
  url?: string;
  icon?: any;
  items?: MenuItem[];
};
 
interface MenuItemsProps {
  items: MenuItem[];
  parentKey?: string;
  isCollapsed?: boolean;
}
 
const MenuItem: FC<MenuItemsProps> = ({
  items,
  parentKey,
  isCollapsed = false,
}) => {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
 
  const toggleSubMenu = (itemKey: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };
 
  return (
    <>
      {items.map((item, idx) => {
        const itemKey = `${parentKey}-${item.title}-${idx}`;
        const hasChildren = item.items && item.items.length > 0;
        const isActive = item.url && pathname === item.url;
 
        const ButtonContent = (
          <div
            className={`flex items-center justify-between w-full gap-2 text-sm px-3 py-1 rounded hover:bg-muted ${
              isActive ? "bg-muted font-medium" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full dark:bg-white bg-gray-500 ml-3" />
              <span>{item.title}</span>
            </div>
            {hasChildren &&
              (openSubMenus[itemKey] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </div>
        );
 
        return (
          <div
            key={itemKey}
            onMouseEnter={() => isCollapsed && setHoveredItem(itemKey)}
            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {hasChildren ? (
                  <button
                    onClick={() => !isCollapsed && toggleSubMenu(itemKey)}
                    className="w-full text-left"
                  >
                    {ButtonContent}
                  </button>
                ) : item.url ? (
                  <Link href={item.url}>{ButtonContent}</Link>
                ) : (
                  <button disabled>{ButtonContent}</button>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
 
            {/* 🚀 Flyout Popup for Collapsed Sidebar
            {hasChildren && isCollapsed && hoveredItem === itemKey && (
              <AnimatePresence>
                <m.div
                  className="absolute left-full top-0 z-50 ml-2 min-w-[200px] bg-background border rounded shadow-xl p-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {item.items?.map((subItem, subIdx) => {
                    const subItemKey = `${itemKey}-popup-${subIdx}`;
                    const isSubActive = subItem.url && pathname === subItem.url;
                    return (
                      <Link
                        key={subItemKey}
                        href={subItem.url || "#"}
                        className={`block px-3 py-1.5 rounded text-sm hover:bg-muted ${
                          isSubActive ? "bg-muted font-medium" : ""
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    );
                  })}
                </m.div>
              </AnimatePresence>
            )} */}
 
            {/* 📦 Inline children if expanded */}
            {hasChildren && !isCollapsed && openSubMenus[itemKey] && (
              <div className="ml-5 border-l pl-3">
                <SidebarMenuButton>
                  <MenuItem
                    items={item.items!}
                    parentKey={itemKey}
                    isCollapsed={false}
                  />
                </SidebarMenuButton>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
 
export default MenuItem;