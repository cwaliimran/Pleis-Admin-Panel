'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { RHFMultiSelectCount } from '@/components/rhf/rhf-multiselect-count';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrganizationByCompanyQuery, useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { useGetCompanyListQuery } from '@/store/Reducer/user-list';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Profile from '../profile';
import { CompanySelectionStorage } from './company-selection-storage';
import NavigationSearch from './navigation-search';
import { RouteConfig } from './route-config';
import { CompanyOption, OrganizationOption, OrganizerOrganization, StoredCompany, StoredOrganization } from './types';

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

interface FormValues {
  companyId: string | null;
  organizationId: string | null;
  organizerOrganizations: string[];
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  companyId: yup.string().nullable().defined(),
  organizationId: yup.string().nullable().defined(),
  organizerOrganizations: yup.array().of(yup.string().required()).defined().default([]),
});

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();
  const previousCompanyRef = useRef<string | null>(null);

  // Organizer routes where dropdown should be shown
  const ORGANIZER_DROPDOWN_ROUTES = [
    // '/organizer/organization',
    // '/organizer/organization/organization-list',

    '/organizer/venue',
    '/organizer/venue-list',

    '/organizer/events',
    '/organizer/events/event-list',

    // '/organizer/reviews',
    // '/organizer/qr-codes',
    '/organizer/updates',

    '/organizer/menu-list',
    '/organizer/menuItems',

    '/organizer/loyalty',
    // '/organizer/rewards',
    // '/organizer/streaks',
    // '/organizer/members',
    // '/organizer/challenges',
    // '/organizer/promotions',
    // '/organizer/referrals',
    // '/organizer/referrals/analytics',
    // '/organizer/transactions',
    // '/organizer/settings',

    '/organizer/ticketing',
    '/organizer/giveaways',
    '/organizer/ticketing-transactions',

    // '/organizer/reservation',
    // '/organizer/calendar',
    '/organizer/analytics',
    '/organizer/reservation-transactions',

    // '/organizer/app-ordering/order-management',
    // '/organizer/app-ordering/menu-management',
    '/organizer/app-ordering/order-analytics',
    '/organizer/app-ordering/order-transactions',
    // '/organizer/app-ordering/order-settings',

    '/organizer/subscription',
    // '/organizer/user/user-list',
    '/organizer/analytics',
    '/organizer/transactions-history',
    // '/organizer/bundles',
    // '/organizer/promo-code',
    // '/organizer/marketing-requests',
  ];

  // Helper to check if dropdown should be shown for organizer
  const shouldShowOrganizerDropdown = (pathname: string) => {
    return ORGANIZER_DROPDOWN_ROUTES.some((route) => pathname.startsWith(route));
  };

  // Get route requirements
  const routeRequirements = useMemo(() => RouteConfig.getRouteRequirements(pathname || ''), [pathname]);

  // Initialize form with stored values
  const methods = useForm<FormValues>({
    resolver: yupResolver<FormValues, any, FormValues>(schema),
    defaultValues: {
      companyId: CompanySelectionStorage.getCompanyId(),
      organizationId: CompanySelectionStorage.getOrganizationId(),
      organizerOrganizations: CompanySelectionStorage.getOrganizerOrganizationIds(),
    },
  });

  const { watch, setValue } = methods;
  const companyId = watch('companyId');
  const organizationId = watch('organizationId');
  const selectedOrganizerOrganizations = watch('organizerOrganizations');

  // Determine if dropdowns should be shown
  const isAdmin = user?.accountState?.userType === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const shouldShowCompanyDropdown = isAdmin && routeRequirements.requiresCompany;
  const shouldShowOrganizationDropdown = isAdmin && routeRequirements.requiresOrganization && Boolean(companyId);
  const showOrganizerDropdown = isOrganizer && shouldShowOrganizerDropdown(pathname || '');

  // Fetch company list
  const {
    data: companyList,
    isLoading: isLoadingCompanies,
    isFetching,
  } = useGetCompanyListQuery(
    {
      page: 0,
      limit: '100',
    },
    {
      skip: !shouldShowCompanyDropdown,
    }
  );

  // Fetch organization list
  const {
    data: organizationResponse,
    isLoading: isLoadingOrganizations,
    isFetching: organizatonFetching,
  } = useGetOrganizationByCompanyQuery(
    {
      companyOrganizer: companyId || undefined,
    },
    {
      skip: !shouldShowOrganizationDropdown || !companyId,
    }
  );

  // Fetch organizer organizations
  const { data: organizerOrganizationsResponse } = useGetOrganizationsOnOrganizerSideQuery(
    {},
    {
      skip: !showOrganizerDropdown,
    }
  );

  // Transform company data to dropdown options
  const companyOptions = useMemo<CompanyOption[]>(
    () =>
      companyList?.map((company: any) => ({
        label: company?.companyDetails?.name || 'Unknown Company',
        value: company?._id,
      })) || [],
    [companyList]
  );

  // Transform organization data to dropdown options
  const organizationOptions = useMemo<OrganizationOption[]>(
    () =>
      organizationResponse?.data?.map((organization: any) => ({
        label: organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
        companyId: companyId || '',
      })) || [],
    [organizationResponse, companyId]
  );

  // Transform organizer organizations data to dropdown options
  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((organization: any) => ({
        label: organization?.title || organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  // Handle company changes
  useEffect(() => {
    if (companyId === undefined) return;

    const previousCompany = previousCompanyRef.current;

    // If company changed, clear organization
    if (previousCompany && previousCompany !== companyId) {
      setValue('organizationId', null, { shouldDirty: false, shouldValidate: false });
      CompanySelectionStorage.setSelectedOrganization(null);
    }

    previousCompanyRef.current = companyId;

    // Update storage
    if (!companyId) {
      CompanySelectionStorage.setSelectedCompany(null);
      return;
    }

    const fullOption = companyOptions.find((opt) => opt.value === companyId);
    const companyToSave: StoredCompany = fullOption || {
      value: companyId,
      label: 'Unknown Company',
    };

    CompanySelectionStorage.setSelectedCompany(companyToSave);
  }, [companyId, companyOptions, setValue]);

  // Handle organization changes
  useEffect(() => {
    if (!routeRequirements.requiresOrganization) return;
    if (organizationId === undefined) return;

    if (!organizationId || !companyId) {
      CompanySelectionStorage.setSelectedOrganization(null);
      return;
    }

    const fullOption = organizationOptions.find((opt) => opt.value === organizationId);
    const organizationToSave: StoredOrganization = fullOption || {
      value: organizationId,
      label: 'Unknown Organization',
      companyId: companyId,
    };

    CompanySelectionStorage.setSelectedOrganization(organizationToSave);
  }, [organizationId, organizationOptions, companyId, routeRequirements.requiresOrganization]);

  // Validate organization belongs to selected company
  useEffect(() => {
    if (!routeRequirements.requiresOrganization) return;
    if (!organizationId) return;
    if (isLoadingOrganizations) return;

    const hasMatchingOption = organizationOptions.some((opt) => opt.value === organizationId);

    if (!hasMatchingOption) {
      setValue('organizationId', null, { shouldDirty: false, shouldValidate: false });
      CompanySelectionStorage.setSelectedOrganization(null);
    }
  }, [organizationOptions, organizationId, setValue, isLoadingOrganizations, routeRequirements.requiresOrganization]);

  // Clear organization when company is cleared
  useEffect(() => {
    if (!routeRequirements.requiresOrganization) return;

    if (!companyId) {
      if (organizationId !== null) {
        setValue('organizationId', null, { shouldDirty: false, shouldValidate: false });
      }
      CompanySelectionStorage.setSelectedOrganization(null);
    }
  }, [companyId, organizationId, routeRequirements.requiresOrganization, setValue]);

  // Handle organizer organizations changes
  useEffect(() => {
    if (!showOrganizerDropdown) return;
    if (selectedOrganizerOrganizations === undefined) return;

    const organizationsToSave: OrganizerOrganization[] = selectedOrganizerOrganizations
      .map((id) => {
        const option = organizerOrganizationOptions.find((opt: { value: string; label: string }) => opt.value === id);
        return option || { value: id, label: 'Unknown Organization' };
      })
      .filter(Boolean);

    CompanySelectionStorage.setOrganizerOrganizations(organizationsToSave.length > 0 ? organizationsToSave : null);
  }, [selectedOrganizerOrganizations, organizerOrganizationOptions, showOrganizerDropdown]);

  return (
    <div className="mt-4 flex flex-col-reverse justify-between gap-4 px-3 sm:px-5 md:my-8 md:items-center md:gap-6 lg:flex-row">
      <div className={`${open ? '' : 'md:ml-10'} w-full overflow-x-auto`}>
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap gap-x-1">
            {links?.map((link, i) => (
              <div key={i} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>{link.href ? <Link href={link.href}>{link.name}</Link> : null}</BreadcrumbLink>
                  {!link.href && <BreadcrumbPage>{link.name}</BreadcrumbPage>}
                </BreadcrumbItem>
                {link.href && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:items-start">
        <FormProvider methods={methods} onSubmit={() => {}}>
          <div className="flex gap-3">
            {shouldShowCompanyDropdown && (
              <div className="w-full rounded-md bg-white md:w-60 dark:bg-[#171717]">
                <RHFCustomDropdown
                  name="companyId"
                  placeholder="Select Company"
                  options={companyOptions}
                  isLoading={isLoadingCompanies || isFetching}
                  showNone={pathname === '/super-admin/transactions-history'}
                />
              </div>
            )}

            {shouldShowOrganizationDropdown && (
              <>
                {isLoadingOrganizations || isLoadingCompanies || isFetching || organizatonFetching ? (
                  <div className="w-full space-y-2 md:md:w-60">
                    <Skeleton className="h-8 flex-1 cursor-not-allowed rounded-xl border-gray-200 px-5" />
                  </div>
                ) : (
                  <div className="w-full rounded-md bg-white md:w-60 dark:bg-[#171717]">
                    <RHFCustomDropdown
                      name="organizationId"
                      placeholder="Select Organization"
                      options={organizationOptions}
                      isLoading={isLoadingOrganizations}
                      showNone={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {showOrganizerDropdown && (
            <div className="w-full rounded-md bg-white md:w-60 dark:bg-[#171717]">
              <RHFMultiSelectCount name="organizerOrganizations" placeholder="Select Organizations" options={organizerOrganizationOptions} />
            </div>
          )}
        </FormProvider>

        <NavigationSearch />

        <div className="flex items-center justify-end gap-3">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
