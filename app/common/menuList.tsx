'use client';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { useQuickNavigation } from '@/hooks/useQuickNavigation';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion as m } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MenuItem from './menuItem';

interface PageProps {
  menuGroups: any;
}

const MenuList: FC<PageProps> = ({ menuGroups }) => {
  const pathname = usePathname();
  const { navigate } = useQuickNavigation();
  const { isMobile, toggleSidebar, state } = useSidebar();

  const isCollapsed = state === 'collapsed';
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setOpenGroup(null);
        setHoveredGroup(null);
        if (hoverTimeout) clearTimeout(hoverTimeout);
        if (state === 'collapsed' && typeof toggleSidebar === 'function') {
          toggleSidebar();
        }
      }
    };
    window.addEventListener('resize', handleResize);
    // Call once on mount to handle initial state
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
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
      const isDisabled = group.disabled;

      return (
        <SidebarGroup
          key={group.key}
          className={cn('group relative my-0 py-0', isDisabled && 'pointer-events-none opacity-50 select-none')}
          onMouseEnter={() => {
            if (!isDisabled && isCollapsed && hasItems) setHoveredGroup(group.key);
            if (!isDisabled && hoverTimeout) clearTimeout(hoverTimeout);
            if (!isDisabled) setHoveredGroup(group.key);
          }}
        >
          <button
            type="button"
            onClick={() => !isDisabled && handleGroupClick(group)}
            disabled={isDisabled}
            className={cn(
              'sidebar-nav-item hover:bg-muted flex cursor-pointer items-center rounded-md text-sm font-medium transition-all duration-100',
              pathname === group.key ? 'bg-muted dark:bg-black' : '',
              isCollapsed ? 'min-w-[36px] justify-center px-2 py-2' : 'w-full justify-between px-3 py-2',
              isDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
            )}
          >
            <div
              className={cn(
                'group relative flex items-center transition-all duration-100',
                isCollapsed ? 'min-h-[40px] w-full justify-center px-0 py-1' : 'gap-2 px-0'
              )}
            >
              {/* Icon wrapper */}
              <div className="flex h-8 w-8 items-center justify-center">
                <group.icon className="h-5 w-5" />
              </div>

              {/* Label (visible only if expanded) */}
              {!isCollapsed && <span className="truncate transition-all duration-100">{group.label}</span>}

              {/* Chevron appears on hover (collapsed only, and has children) */}
              {isCollapsed && hasItems && !isDisabled && (
                <div className="absolute right-[-10px] transition-opacity duration-200 group-hover:opacity-100">
                  <ChevronRight className="text-muted-foreground h-3 w-3" />
                </div>
              )}
            </div>

            {!isCollapsed && hasItems && !isDisabled && (isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />)}
          </button>

          {/* Inline submenu (for expanded sidebar) */}
          <AnimatePresence initial={false}>
            {isOpen && hasItems && !isDisabled && (
              <m.div
                className="ml-2 overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <SidebarGroupContent>
                  <SidebarMenu>
                    <MenuItem items={group.items} parentKey={group.key} isCollapsed={isCollapsed} />
                  </SidebarMenu>
                </SidebarGroupContent>
              </m.div>
            )}
          </AnimatePresence>

          {/* Tooltip submenu (for collapsed sidebar) */}
          {isCollapsed && hoveredGroup === group.key && hasItems && !isDisabled && (
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
              className="fixed left-[70px] z-50 ml-2 max-h-60 space-y-1 overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
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
                    'hover:bg-muted block w-full cursor-pointer rounded-md px-3 py-2 text-start text-sm transition',
                    pathname === item.url ? 'bg-muted font-semibold' : ''
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
  }, [menuGroups, openGroup, pathname, isCollapsed, hoveredGroup, handleGroupClick, navigate, toggleSidebar, isMobile, hoverTimeout]);

  return (
    <Sidebar className="a-50 relative z-10 overflow-visible" collapsible="icon">
      <SidebarHeader>
        <h1
          className={cn(
            !isCollapsed ? 'text-4xl' : 'text-xl',
            'z-10 pt-3 pb-1 text-center font-bold transition-all duration-200',
            isCollapsed ? 'px-0' : 'px-4'
          )}
        >
          {isCollapsed ? 'P' : 'PLEIS'}
        </h1>
      </SidebarHeader>

      <SidebarContent>{memoizedMenuItems}</SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default MenuList;
