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
// Super admin: global by default; pick a company, then optionally some of its
// organizations. Organizer / manager: always their own company; optionally
// narrow to some of their organizations. Nothing selected = all. The backend
// enforces the same limits, so this bar only expresses what the user wants.
// ============================================================

export type AnalyticsUserType = 'super-admin' | 'organizer' | string;

export interface AnalyticsScope {
  /** Super admin only: the selected company (organizer user id). */
  companyOrganizer?: string;
  /** Selected organizations; omitted means every organization in scope. */
  organizations?: string[];
}

interface Option {
  value: string;
  label: string;
}

const ALL = 'all';
const storageKey = (userType: string) => `analytics-scope:${userType}`;

const readStored = (userType: string): { companyId: string; organizationIds: string[] } => {
  try {
    const raw = window.localStorage.getItem(storageKey(userType));
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      companyId: typeof parsed?.companyId === 'string' ? parsed.companyId : ALL,
      organizationIds: Array.isArray(parsed?.organizationIds) ? parsed.organizationIds : [],
    };
  } catch {
    return { companyId: ALL, organizationIds: [] };
  }
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
          className="h-10 w-full cursor-pointer justify-between bg-white font-normal shadow-none md:w-72 dark:bg-[#1a1a1a]"
        >
          <span className="truncate">{isLoading ? 'Loading organizations…' : label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search organizations…" />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value={`__all__ ${allLabel}`} onSelect={() => onChange([])} className="cursor-pointer">
                <Check className={cn('mr-2 h-4 w-4', selected.length === 0 ? 'opacity-100' : 'opacity-0')} />
                {allLabel}
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  onSelect={() => toggle(option.value)}
                  className="cursor-pointer"
                >
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

/**
 * Scope for both analytics screens. Returns the query arguments and the bar to
 * render above the figures.
 */
export const useAnalyticsScope = (userType: AnalyticsUserType) => {
  const isAdmin = userType === 'super-admin';
  const [companyId, setCompanyId] = useState<string>(ALL);
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);

  // Remember the last scope per role (a convenience only; the page works without it).
  useEffect(() => {
    const stored = readStored(userType);
    setCompanyId(isAdmin ? stored.companyId : ALL);
    setOrganizationIds(stored.organizationIds);
    setRestored(true);
  }, [userType, isAdmin]);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(storageKey(userType), JSON.stringify({ companyId, organizationIds }));
    } catch {
      /* storage unavailable — keep the in-memory scope */
    }
  }, [restored, userType, companyId, organizationIds]);

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

  // Drop organizations that are not in the current list (company switched, org removed).
  const effectiveOrgIds = useMemo(
    () => (organizationOptions.length ? organizationIds.filter((id) => organizationOptions.some((o) => o.value === id)) : organizationIds),
    [organizationIds, organizationOptions]
  );

  const scope = useMemo<AnalyticsScope>(() => {
    const next: AnalyticsScope = {};
    if (isAdmin && companyId !== ALL) next.companyOrganizer = companyId;
    if ((!isAdmin || companyId !== ALL) && effectiveOrgIds.length) next.organizations = effectiveOrgIds;
    return next;
  }, [isAdmin, companyId, effectiveOrgIds]);

  const companyLabel = isAdmin ? (companyId === ALL ? 'All companies' : companyOptions.find((c) => c.value === companyId)?.label || 'Company') : null;
  const orgLabel =
    effectiveOrgIds.length === 0
      ? isAdmin && companyId === ALL
        ? 'all organizations'
        : 'all organizations of this company'
      : effectiveOrgIds.length === 1
        ? organizationOptions.find((o) => o.value === effectiveOrgIds[0])?.label || '1 organization'
        : `${effectiveOrgIds.length} organizations`;

  const ScopeBar = (
    <div className="dark:bg-secondary mt-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:flex-wrap md:items-end dark:border-gray-800">
      {isAdmin && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Company</span>
          <Select
            value={companyId}
            onValueChange={(next) => {
              setCompanyId(next);
              setOrganizationIds([]);
            }}
          >
            <SelectTrigger aria-label="Company" className="h-10 w-full cursor-pointer bg-white shadow-none md:w-72 dark:bg-[#1a1a1a]">
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

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Organizations</span>
        <OrganizationsMultiSelect
          options={organizationOptions}
          value={effectiveOrgIds}
          onChange={setOrganizationIds}
          disabled={isAdmin && companyId === ALL}
          isLoading={isAdmin ? isFetchingCompanyOrgs : isFetchingOwnOrgs}
          allLabel={isAdmin && companyId === ALL ? 'Choose a company first' : 'All organizations'}
        />
      </div>

      <p className="text-sm text-gray-500 md:ml-auto dark:text-gray-400">
        Showing {companyLabel ? `${companyLabel} · ` : ''}
        {orgLabel}
      </p>
    </div>
  );

  return { scope, ScopeBar, ready: restored };
};
