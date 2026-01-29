'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { menuGroups } from '@/app/super-admin/(super-admin)/@left/data';

interface SearchableRoute {
  label: string;
  url: string;
  group: string;
  icon: any;
}

const NavigationSearch: FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMac, setIsMac] = useState(false);

  // Detect OS for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));
  }, []);

  // Keyboard shortcut to open search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      // Close on Escape
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Flatten all routes from menuGroups into a searchable array
  const allRoutes = useMemo<SearchableRoute[]>(() => {
    const routes: SearchableRoute[] = [];

    menuGroups.forEach((group) => {
      // If the group has no items, it's a direct link
      if (!group.items || group.items.length === 0) {
        routes.push({
          label: group.label,
          url: group.key,
          group: 'Quick Links',
          icon: group.icon,
        });
      } else {
        // Add all sub-items with their parent group label
        group.items.forEach((item) => {
          if (item.url) {
            routes.push({
              label: item.title,
              url: item.url,
              group: group.label,
              icon: item.icon || group.icon,
            });
          }
        });
      }
    });

    return routes;
  }, []);

  // Filter routes based on search value
  const filteredRoutes = useMemo(() => {
    if (!searchValue.trim()) return allRoutes;

    const searchLower = searchValue.toLowerCase();
    return allRoutes.filter(
      (route) =>
        route.label.toLowerCase().includes(searchLower) ||
        route.group.toLowerCase().includes(searchLower) ||
        route.url.toLowerCase().includes(searchLower)
    );
  }, [allRoutes, searchValue]);

  // Group filtered routes by their group
  const groupedRoutes = useMemo(() => {
    const groups: Record<string, SearchableRoute[]> = {};

    filteredRoutes.forEach((route) => {
      if (!groups[route.group]) {
        groups[route.group] = [];
      }
      groups[route.group].push(route);
    });

    return groups;
  }, [filteredRoutes]);

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false);
      setSearchValue('');
      router.push(url);
    },
    [router]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'text-muted-foreground flex h-10 w-full items-center gap-2 rounded-full bg-white px-4 text-sm transition-colors',
            'focus:ring-primary/20 hover:bg-gray-50 focus:ring-2 focus:outline-none',
            'dark:bg-[#171717] dark:hover:bg-[#222]',
            'md:w-60 lg:w-70'
          )}
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">{searchValue || 'Search pages...'}</span>
          <kbd className="bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">{isMac ? '⌘' : 'Ctrl+'}</span>K
          </kbd>
        </button>
      </PopoverTrigger>
      <PopoverContent className="dark:bg-secondary w-72 p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search pages..." value={searchValue} onValueChange={setSearchValue} autoFocus />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            {Object.entries(groupedRoutes).map(([groupName, routes]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {routes.map((route) => (
                  <CommandItem key={route.url} value={route.url} onSelect={() => handleSelect(route.url)} className="cursor-pointer">
                    <span>{route.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NavigationSearch;
