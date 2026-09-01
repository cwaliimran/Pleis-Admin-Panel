'use client';

import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useQuickNavigation } from '@/hooks/useQuickNavigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, memo, useCallback, useMemo, useState } from 'react';

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

const MenuItem: FC<MenuItemsProps> = ({ items, parentKey, isCollapsed = false }) => {
  const pathname = usePathname();
  const { navigate } = useQuickNavigation();

  const { toggleSidebar, isMobile } = useSidebar();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const activeUrl = useMemo(() => {
    const isMatch = (url?: string) => !!url && (pathname === url || pathname.startsWith(`${url}/`));

    let best: string | null = null;
    const walk = (list: MenuItem[]) => {
      list.forEach((item) => {
        if (isMatch(item.url) && (!best || item.url!.length > best.length)) best = item.url!;
        if (item.items?.length) walk(item.items);
      });
    };
    walk(items);

    return best as string | null;
  }, [items, pathname]);

  const toggleSubMenu = useCallback((itemKey: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  }, []);

  const handleClick = useCallback(
    (url: string) => {
      if (isMobile) {
        toggleSidebar();
      }
      navigate(url);
    },
    [navigate, isMobile, toggleSidebar]
  );

  return (
    <>
      {items.map((item, idx) => {
        const itemKey = `${parentKey}-${item.title}-${idx}`;
        const hasChildren = item.items && item.items.length > 0;
        const isActive = !!item.url && item.url === activeUrl;
        const isHovered = isCollapsed && hoveredItem === itemKey;

        const ButtonContent = (
          <div
            className={`sidebar-nav-item hover:bg-muted flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-100 ${
              isActive ? 'bg-muted font-medium' : isHovered ? 'bg-muted' : ''
            } cursor-pointer`}
          >
            <div className="flex items-center gap-2">
              <div className="ml-3 h-1 w-1 rounded-full bg-gray-500 dark:bg-white" />
              <span>{item.title}</span>
            </div>
            {hasChildren && (openSubMenus[itemKey] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </div>
        );

        return (
          <div key={itemKey} onMouseEnter={() => isCollapsed && setHoveredItem(itemKey)} onMouseLeave={() => isCollapsed && setHoveredItem(null)}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {hasChildren ? (
                  <button type="button" onClick={() => !isCollapsed && toggleSubMenu(itemKey)} className="w-full text-left">
                    {ButtonContent}
                  </button>
                ) : item.url ? (
                  <button type="button" onClick={() => handleClick(item.url!)} className="w-full text-left">
                    {ButtonContent}
                  </button>
                ) : (
                  <button type="button" disabled>
                    {ButtonContent}
                  </button>
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
                  <MenuItem items={item.items!} parentKey={itemKey} isCollapsed={false} />
                </SidebarMenuButton>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default memo(MenuItem);
