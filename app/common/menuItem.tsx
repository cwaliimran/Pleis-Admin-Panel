"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  title: string;
  url?: string;
  icon?: any;
  items?: MenuItem[];
};

interface MenuItemsProps {
  items: MenuItem[];
  parentKey?: string;
}

const MenuItem: FC<MenuItemsProps> = ({ items, parentKey }) => {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
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
            className={`flex items-center justify-between w-full gap-2 text-sm px-3 py-1.5 rounded hover:bg-muted ${
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
          <div key={itemKey}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {hasChildren ? (
                  <button onClick={() => toggleSubMenu(itemKey)}>{ButtonContent}</button>
                ) : item.url ? (
                  <Link href={item.url}>{ButtonContent}</Link>
                ) : (
                  <button disabled>{ButtonContent}</button>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Render nested children recursively */}
            {hasChildren && openSubMenus[itemKey] && (
              <div className="ml-5 border-l pl-3">
                <SidebarMenuButton>
                  <MenuItem items={item.items!} parentKey={itemKey} />
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
