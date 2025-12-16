'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrganizationByCompanyQuery } from '@/store/Reducer/organization';
import { useGetCompanyListQuery } from '@/store/Reducer/user-list';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Profile from '../profile';
import { CompanySelectionStorage } from './company-selection-storage';
import { RouteConfig } from './route-config';
import { CompanyOption, OrganizationOption, StoredCompany, StoredOrganization } from './types';

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

interface FormValues {
  companyId: string | null;
  organizationId: string | null;
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  companyId: yup.string().nullable().defined(),
  organizationId: yup.string().nullable().defined(),
});

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();
  const previousCompanyRef = useRef<string | null>(null);

  // Get route requirements
  const routeRequirements = useMemo(() => RouteConfig.getRouteRequirements(pathname || ''), [pathname]);

  // Initialize form with stored values
  const methods = useForm<FormValues>({
    resolver: yupResolver<FormValues, any, FormValues>(schema),
    defaultValues: {
      companyId: CompanySelectionStorage.getCompanyId(),
      organizationId: CompanySelectionStorage.getOrganizationId(),
    },
  });

  const { watch, setValue } = methods;
  const companyId = watch('companyId');
  const organizationId = watch('organizationId');

  // Determine if dropdowns should be shown
  const isAdmin = user?.accountState?.userType === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const shouldShowCompanyDropdown = isAdmin && routeRequirements.requiresCompany;
  const shouldShowOrganizationDropdown = isAdmin && routeRequirements.requiresOrganization && Boolean(companyId);

  // Fetch company list
  const {
    data: companyList,
    isLoading: isLoadingCompanies,
    isFetching,
  } = useGetCompanyListQuery(
    {},
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

          {isOrganizer && (
            <div className="w-full rounded-md bg-white md:w-60 dark:bg-[#171717]">
              <RHFMultiSelect
                name="organizations"
                placeholder="Select Organizations"
                options={[
                  { value: 'org1', label: 'Org 1' },
                  { value: 'org2', label: 'Org 2' },
                  { value: 'org3', label: 'Org 3' },
                ]}
              />
            </div>
          )}
        </FormProvider>

        <Input placeholder="Search..." className="h-10 w-full rounded-full bg-white pl-5 md:w-60 lg:w-[280px]" />

        <div className="flex items-center justify-end gap-3">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
