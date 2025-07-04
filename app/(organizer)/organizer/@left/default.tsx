
"use client"
import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    ChevronDown,
    ChevronRight
} from "lucide-react"
import { redirect, usePathname } from "next/navigation"
import { menuGroups } from "./data"
import MenuItems from "./menuItem"




export default function Page() {

    const pathname = usePathname();
    const { isMobile, toggleSidebar } = useSidebar();
    const [openGroup, setOpenGroup] = useState<string | null>(null)


    const toggleGroup = (groupKey: string) => {
        setOpenGroup(prev => (prev === groupKey ? null : groupKey))
    }

    return (

        <Sidebar  >
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                {menuGroups.map((group) => (
                    <SidebarGroup key={group.key}>
                        <button
                            onClick={() => {
                                toggleGroup(group.key);

                                if (isMobile) {
                                    toggleSidebar();
                                }
                                if (!group.items) {
                                    redirect(group.key);
                                }

                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 font-medium text-sm hover:bg-muted ${pathname === group.key && "bg-muted"} rounded-md gap-2 cursor-pointer`}
                        >
                            <div className="flex items-center gap-2">
                                <group.icon className="w-5 h-5" />
                                <span>{group.label}</span>
                            </div>
                            {group.items && group.items.length > 0 && (
                                openGroup === group.key ? (
                                    <ChevronDown className="w-5 h-5  transition-all duration-75" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 transition-all duration-75" />
                                )
                            )}
                        </button>

                        {openGroup === group.key && group.items && (
                            <SidebarGroupContent className="ml-2 transition-all duration-75">
                                <SidebarMenu>
                                    {/* {renderMenuItems(group.items, group.key)} */}
                                    <MenuItems items={group.items} parentKey={group.key} />
                                </SidebarMenu>
                            </SidebarGroupContent>
                        )}
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>

        </Sidebar>
    )
}

