
"use client";

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

interface PageProps {
  menuGroups: any;
}

const MenuList: FC<PageProps> = ({ menuGroups }) => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (groupKey: string) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  };

  return (
    <Sidebar>
      <SidebarHeader>
        {/* <img
          className="block dark:hidden ml-10 w-[60%] md:w-[60%] max-w-xs mb-10"
          src="/images/l-standard.png"
          alt="Light Logo"
        />
        <img
          className="hidden dark:block ml-10 w-[60%] md:w-[60%] max-w-xs mb-10"
          src="/images/l-reversed.png"
          alt="Dark Logo"
        /> */}
        <h1 className=' text-5xl font-bold text-center my-1'>Pleis</h1>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group: any) => (
          <SidebarGroup key={group.key}>
            <button
              onClick={() => {
                toggleGroup(group.key);

                if (isMobile) toggleSidebar();
                if (!group.items) redirect(group.key);
              }}
              className={`flex items-center justify-between w-full px-3 py-2 font-medium text-sm hover:bg-muted ${
                pathname === group.key ? "bg-muted" : ""
              } rounded-md gap-2 cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                <group.icon className="w-5 h-5" />
                <span>{group.label}</span>
              </div>

              {group.items?.length > 0 &&
                (openGroup === group.key ? (
                  <ChevronDown className="w-5 h-5 transition-all duration-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 transition-all duration-500" />
                ))}
            </button>

            <AnimatePresence initial={false}>
              {openGroup === group.key && group.items && (
                <m.div
                  className="ml-2 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <MenuItem items={group.items} parentKey={group.key} />
                    </SidebarMenu>
                  </SidebarGroupContent>
                </m.div>
              )}
            </AnimatePresence>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default MenuList;
