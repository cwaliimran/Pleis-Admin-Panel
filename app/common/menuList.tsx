'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useQuickNavigation } from '@/hooks/useQuickNavigation';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion as m } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MenuItem from './menuItem';

interface PageProps {
  menuGroups: any;
  panels?: Record<string, { title: string; backLabel: string; sections: { label: string; items: { title: string; url: string }[] }[] }>;
}

const MenuList: FC<PageProps> = ({ menuGroups, panels }) => {
  const pathname = usePathname();
  const { navigate } = useQuickNavigation();
  const { isMobile, toggleSidebar, state } = useSidebar();

  const isCollapsed = state === 'collapsed';
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleOpenPanel = useCallback(
    (panel: string) => {
      if (isCollapsed && typeof toggleSidebar === 'function') {
        toggleSidebar();
      }
      setActivePanel(panel);
    },
    [isCollapsed, toggleSidebar]
  );

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
      // The panel's items have no icons, so there's no sensible icon-only rendering for it —
      // collapsing the sidebar closes it, same as it already does for an open group submenu.
      setActivePanel(null);
    }
  }, [isCollapsed]);

  const toggleGroup = useCallback((groupKey: string) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  }, []);

  const handleGroupClick = useCallback(
    (group: any) => {
      const hasItems = group.items?.length > 0;

      if (group.panel) {
        handleOpenPanel(group.panel);
        return;
      }

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
    [navigate, isMobile, toggleSidebar, toggleGroup, isCollapsed, handleOpenPanel]
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
              {isCollapsed && (hasItems || group.panel) && !isDisabled && (
                <div className="absolute right-[-10px] transition-opacity duration-200 group-hover:opacity-100">
                  <ChevronRight className="text-muted-foreground h-3 w-3" />
                </div>
              )}
            </div>

            {!isCollapsed && !isDisabled && (
              <>
                {group.panel ? (
                  <ArrowRight className="text-muted-foreground h-4 w-4" />
                ) : (
                  hasItems && (isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />)
                )}
              </>
            )}
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
                    <MenuItem items={group.items} parentKey={group.key} isCollapsed={isCollapsed} onOpenPanel={handleOpenPanel} />
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
  }, [menuGroups, openGroup, pathname, isCollapsed, hoveredGroup, handleGroupClick, navigate, toggleSidebar, isMobile, hoverTimeout, handleOpenPanel]);

  const activePanelConfig = activePanel ? panels?.[activePanel] : null;

  return (
    <Sidebar className="a-50 relative z-10 overflow-visible" collapsible="icon">
      <AnimatePresence mode="wait" initial={false}>
        {activePanelConfig ? (
          <m.div
            key="panel"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <SidebarHeader>
              <div className={cn('pt-3 pb-1', isCollapsed ? 'px-0 text-center' : 'px-4')}>
                {!isCollapsed && <p className="text-muted-foreground text-xs">Pleis Admin</p>}
                <h2 className="text-xl font-bold">{isCollapsed ? 'P' : activePanelConfig.title}</h2>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                title="Back to Menu"
                className="hover:bg-muted mx-2 mt-1 mb-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                {!isCollapsed && activePanelConfig.backLabel}
              </button>

              {activePanelConfig.sections.map((section) => (
                <SidebarGroup key={section.label} className="py-0">
                  {!isCollapsed && <SidebarGroupLabel className="uppercase">{section.label}</SidebarGroupLabel>}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild>
                            <button
                              type="button"
                              onClick={() => {
                                navigate(item.url);
                                if (isMobile) toggleSidebar();
                              }}
                              className={cn(
                                'hover:bg-muted flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm transition-colors',
                                pathname === item.url ? 'bg-muted font-semibold' : ''
                              )}
                            >
                              {item.title}
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </m.div>
        ) : (
          <m.div
            key="root"
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
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
          </m.div>
        )}
      </AnimatePresence>

      <SidebarFooter />
    </Sidebar>
  );
};

export default MenuList;
