import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { ChevronDown, ChevronRight } from "lucide-react"
import { FC, useState } from "react"


type MenuItem = {
    title: string
    url?: string
    icon: any
    items?: MenuItem[],
}
interface MenuItemsProps {
    items: MenuItem[],
    parentKey?: string
}

const MenuItems: FC<MenuItemsProps> = ({ items, parentKey }) => {


    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({})

    const toggleSubMenu = (itemKey: string) => {
        setOpenSubMenus(prev => ({ ...prev, [itemKey]: !prev[itemKey] }))
    }



    return (
        <>
            {items.map((item: any, idx: number) => {
                const itemKey = `${parentKey}-${item.title}-${idx}`
                const hasChildren = item.items && item.items.length > 0
                return (
                    <div key={itemKey}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <button
                                    onClick={() => hasChildren ? toggleSubMenu(itemKey) : null}
                                    className="flex items-center justify-between w-full gap-2 text-sm px-3 py-1.5 hover:bg-muted rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </div>
                                    {hasChildren &&
                                        (openSubMenus[itemKey] ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        ))}
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Sub-items */}
                        {hasChildren && openSubMenus[itemKey] && (
                            <div className="ml-5 border-l pl-3">
                                <SidebarMenuButton>
                                    {/* {renderMenuItems(item.items!, itemKey)} */}
                                    <MenuItems items={item.items} parentKey={itemKey} />
                                </SidebarMenuButton>
                            </div>
                        )}
                    </div>
                )
            }
            )}
        </>
    )
}


export default MenuItems