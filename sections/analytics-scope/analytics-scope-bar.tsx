'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useGetOrganizationByCompanyQuery, useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { useGetCompanyListQuery } from '@/store/Reducer/user-list';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// ============================================================
// Analytics scope (Requirement Set #128, #131; Defects Report D-06)
//
// The selectors sit in the page header like on every other admin page
// (AnalyticsScopeHeaderControls); the analytics views read the same selection
// through useAnalyticsScope.
//
// Super admin: global by default; pick a company, then optionally some of its
// organizations. Organizer / manager: always their own company; optionally
// narrow to some of their organizations. Nothing selected = all. The backend
// enforces the same limits, so the selection only expresses what the user wants.
//
// Kept separate from the header's company selection used by other pages, so
// choosing "All companies" here never clears the company those pages need.
// ============================================================

export type AnalyticsUserType = 'super-admin' | 'organizer' | string;

export interface AnalyticsScope {
  /** Super admin only: the selected company (organizer user id). */
  companyOrganizer?: string;
  /** Selected organizations; omitted means every organization in scope. */
  organizations?: string[];
}

interface StoredSelection {
  companyId: string;
  organizationIds: string[];
}

interface Option {
  value: string;
  label: string;
}

const ALL = 'all';
const CHANGE_EVENT = 'analyticsScopeChanged';

/** Routes that show the analytics scope selectors in the header. */
export const ANALYTICS_SCOPE_ROUTES = [
  '/super-admin/analytics',
  '/super-admin/app-ordering/order-analytics',
  '/organizer/analytics',
  '/organizer/app-ordering/order-analytics',
];

export const isAnalyticsScopeRoute = (pathname: string) => ANALYTICS_SCOPE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const storageKey = (userType: string) => `analytics-scope:${userType}`;

const readSelection = (userType: string): StoredSelection => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(userType)) || 'null');
    return {
      companyId: userType === 'super-admin' && typeof parsed?.companyId === 'string' ? parsed.companyId : ALL,
      organizationIds: Array.isArray(parsed?.organizationIds) ? parsed.organizationIds.filter((id: unknown) => typeof id === 'string') : [],
    };
  } catch {
    return { companyId: ALL, organizationIds: [] };
  }
};

const writeSelection = (userType: string, selection: StoredSelection) => {
  try {
    window.localStorage.setItem(storageKey(userType), JSON.stringify(selection));
  } catch {
    /* storage unavailable — the event below still updates the open page */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { userType, selection } }));
};

/** Reactive selection shared by the header controls and the analytics views. */
const useStoredSelection = (userType: string) => {
  const [selection, setSelection] = useState<StoredSelection>({ companyId: ALL, organizationIds: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelection(readSelection(userType));
    setReady(true);
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ userType: string; selection: StoredSelection }>).detail;
      if (detail?.userType === userType) setSelection(detail.selection);
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, [userType]);

  const update = (next: StoredSelection) => {
    setSelection(next);
    writeSelection(userType, next);
  };

  return { selection, update, ready };
};

/** Query arguments for the analytics views. `ready` is false until the stored selection is read. */
export const useAnalyticsScope = (userType: AnalyticsUserType) => {
  const isAdmin = userType === 'super-admin';
  const { selection, ready } = useStoredSelection(userType);

  const scope = useMemo<AnalyticsScope>(() => {
    const next: AnalyticsScope = {};
    if (isAdmin && selection.companyId !== ALL) next.companyOrganizer = selection.companyId;
    if ((!isAdmin || selection.companyId !== ALL) && selection.organizationIds.length) next.organizations = selection.organizationIds;
    return next;
  }, [isAdmin, selection]);

  return { scope, ready };
};

const OrganizationsMultiSelect: React.FC<{
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  allLabel: string;
  isLoading?: boolean;
}> = ({ options, value, onChange, disabled, allLabel, isLoading }) => {
  const [open, setOpen] = useState(false);
  const selected = value.filter((id) => options.some((o) => o.value === id));
  const label =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label || '1 organization'
        : `${selected.length} organizations`;

  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Organizations"
          disabled={disabled}
          className="h-10 w-full cursor-pointer justify-between bg-white font-normal shadow-none dark:bg-[#171717]"
        >
          <span className="truncate">{isLoading ? 'Loading organizations…' : label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search organizations…" />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value={`__all__ ${allLabel}`} onSelect={() => onChange([])} className="cursor-pointer">
                <Check className={cn('mr-2 h-4 w-4', selected.length === 0 ? 'opacity-100' : 'opacity-0')} />
                All organizations
              </CommandItem>
              {options.map((option) => (
                <CommandItem key={option.value} value={`${option.label} ${option.value}`} onSelect={() => toggle(option.value)} className="cursor-pointer">
                  <Check className={cn('mr-2 h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/** Company + Organizations selectors rendered in the page header on analytics routes. */
export const AnalyticsScopeHeaderControls: React.FC<{ userType: AnalyticsUserType }> = ({ userType }) => {
  const isAdmin = userType === 'super-admin';
  const { selection, update } = useStoredSelection(userType);
  const { companyId, organizationIds } = selection;

  const { data: companyList, isLoading: isLoadingCompanies } = useGetCompanyListQuery({ page: 0, limit: '500' }, { skip: !isAdmin });
  const { data: companyOrgs, isFetching: isFetchingCompanyOrgs } = useGetOrganizationByCompanyQuery(
    { companyOrganizer: companyId },
    { skip: !isAdmin || companyId === ALL }
  );
  const { data: ownOrgs, isFetching: isFetchingOwnOrgs } = useGetOrganizationsOnOrganizerSideQuery({}, { skip: isAdmin });

  const companyOptions = useMemo<Option[]>(
    () =>
      ((companyList as any[]) || [])
        .map((company: any) => ({ value: company?._id, label: company?.companyDetails?.name || company?.organizationName || 'Unknown company' }))
        .filter((o) => o.value)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [companyList]
  );

  const organizationOptions = useMemo<Option[]>(() => {
    const list = isAdmin ? (companyOrgs as any)?.data : (ownOrgs as any)?.data;
    return ((list as any[]) || [])
      .map((org: any) => ({ value: org?._id, label: org?.basicInfo?.name || org?.title || 'Unknown organization' }))
      .filter((o) => o.value)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [isAdmin, companyOrgs, ownOrgs]);

  // Forget organizations that are no longer in the list (company switched, org removed).
  useEffect(() => {
    if (!organizationOptions.length || !organizationIds.length) return;
    const kept = organizationIds.filter((id) => organizationOptions.some((o) => o.value === id));
    if (kept.length !== organizationIds.length) update({ companyId, organizationIds: kept });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationOptions]);

  return (
    <div className="flex w-full gap-3 md:w-auto">
      {isAdmin && (
        <div className="w-full rounded-md bg-white md:w-auto md:min-w-50 dark:bg-[#171717]">
          <Select value={companyId} onValueChange={(next) => update({ companyId: next, organizationIds: [] })}>
            <SelectTrigger aria-label="Company" className="h-10 w-full cursor-pointer bg-white shadow-none md:min-w-50 dark:bg-[#171717]">
              <SelectValue placeholder={isLoadingCompanies ? 'Loading companies…' : 'All companies'} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value={ALL} className="cursor-pointer">
                All companies
              </SelectItem>
              {companyOptions.map((company) => (
                <SelectItem key={company.value} value={company.value} className="cursor-pointer">
                  {company.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-full rounded-md bg-white md:w-60 dark:bg-[#171717]">
        <OrganizationsMultiSelect
          options={organizationOptions}
          value={organizationIds}
          onChange={(next) => update({ companyId, organizationIds: next })}
          disabled={isAdmin && companyId === ALL}
          isLoading={isAdmin ? isFetchingCompanyOrgs : isFetchingOwnOrgs}
          allLabel="All organizations"
        />
      </div>
    </div>
  );
};
