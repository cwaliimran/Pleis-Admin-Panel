'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrganizationByCompanyQuery } from '@/store/Reducer/organization';
import { useGetCompanyListQuery } from '@/store/Reducer/user-list';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Profile from './profile';

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

interface DropdownOption {
  label: string;
  value: string;
}

interface FormValues {
  organizations: string | null;
  ticketingOrganization: string | null;
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  organizations: yup.string().nullable().defined(),
  ticketingOrganization: yup.string().nullable().defined(),
});

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const defaultCompany = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('selectedCompany');
      const parsed = stored ? JSON.parse(stored) : null;
      // Return just the value (ID) since schema expects string
      return parsed?.value || null;
    } catch {
      return null;
    }
  }, []);

  const defaultOrganization = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedCompany = localStorage.getItem('selectedCompany');
      const parsedCompany = storedCompany ? JSON.parse(storedCompany) : null;
      const activeCompanyId = parsedCompany?.value;

      const stored = localStorage.getItem('selectedOrganization');
      const parsed = stored ? JSON.parse(stored) : null;

      if (parsed?.companyId && parsed.companyId !== activeCompanyId) {
        return null;
      }

      return parsed?.value || null;
    } catch {
      return null;
    }
  }, []);

  const methods = useForm<FormValues>({
    resolver: yupResolver<FormValues, any, FormValues>(schema),
    defaultValues: { organizations: defaultCompany, ticketingOrganization: defaultOrganization },
  });

  const { watch, setValue } = methods;
  const organizationsValue = watch('organizations');
  const ticketingOrganizationValue = watch('ticketingOrganization');
  const previousCompanyRef = useRef<string | null>(organizationsValue ?? null);

  const superAdminUrls = [
    '/super-admin/loyalty',
    '/super-admin/rewards',
    '/super-admin/challenges',
    '/super-admin/promotions',
    '/super-admin/members',
    '/super-admin/settings',
    '/super-admin/referrals',
    '/super-admin/transactions',
    '/super-admin/menu-list',
    '/super-admin/menuItems',
    '/super-admin/ticketing',
    '/super-admin/streaks',
  ];

  const shouldShowDropdown = superAdminUrls.some((url) => pathname?.startsWith(url));
  const requiresOrganizationDropdown = pathname?.startsWith('/super-admin/ticketing') ?? false;

  const { data: companyList, isLoading: isUserLoading } = useGetCompanyListQuery(
    {},
    {
      skip: !shouldShowDropdown || user?.accountState?.userType !== 'admin',
    }
  );

  const { data: organizationResponse, isLoading: isOrganizationsLoading } = useGetOrganizationByCompanyQuery(
    {
      companyOrganizer: organizationsValue || undefined,
    },
    {
      skip: !shouldShowDropdown || !requiresOrganizationDropdown || user?.accountState?.userType !== 'admin' || !organizationsValue,
    }
  );

  const userOptions = useMemo(
    () =>
      companyList?.map((u: any) => ({
        label: u?.companyDetails?.name || 'Unknown Company',
        value: u?._id,
      })) || [],
    [companyList]
  );

  const organizationOptions = useMemo(
    () =>
      organizationResponse?.data?.map((organization: any) => ({
        label: organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizationResponse]
  );

  useEffect(() => {
    if (!requiresOrganizationDropdown) return;

    if (!organizationsValue) {
      if (ticketingOrganizationValue !== null) {
        setValue('ticketingOrganization', null, { shouldDirty: false, shouldValidate: false });
      }
      previousCompanyRef.current = null;
      localStorage.removeItem('selectedOrganization');
      window.dispatchEvent(new Event('organizationChanged'));
      return;
    }

    const previousCompany = previousCompanyRef.current;
    if (previousCompany && previousCompany !== organizationsValue) {
      setValue('ticketingOrganization', null, { shouldDirty: false, shouldValidate: false });
      localStorage.removeItem('selectedOrganization');
      window.dispatchEvent(new Event('organizationChanged'));
    }

    previousCompanyRef.current = organizationsValue;
  }, [organizationsValue, requiresOrganizationDropdown, setValue, ticketingOrganizationValue]);

  useEffect(() => {
    if (!requiresOrganizationDropdown) return;
    if (ticketingOrganizationValue === undefined) return;

    if (!ticketingOrganizationValue || !organizationsValue) {
      localStorage.removeItem('selectedOrganization');
      window.dispatchEvent(new Event('organizationChanged'));
      return;
    }

    const fullOption = organizationOptions.find((opt: DropdownOption) => opt.value === ticketingOrganizationValue);
    const organizationToSave = fullOption || { value: ticketingOrganizationValue, label: 'Unknown Organization', companyId: organizationsValue };

    localStorage.setItem(
      'selectedOrganization',
      JSON.stringify({
        ...organizationToSave,
        companyId: organizationsValue,
      })
    );
    window.dispatchEvent(new Event('organizationChanged'));
  }, [ticketingOrganizationValue, organizationOptions, requiresOrganizationDropdown, organizationsValue]);

  useEffect(() => {
    if (!requiresOrganizationDropdown) return;
    if (!ticketingOrganizationValue) return;
    if (isOrganizationsLoading) return;

    const hasMatchingOption = organizationOptions.some((opt: DropdownOption) => opt.value === ticketingOrganizationValue);

    if (!hasMatchingOption) {
      setValue('ticketingOrganization', null, { shouldDirty: false, shouldValidate: false });
      localStorage.removeItem('selectedOrganization');
      window.dispatchEvent(new Event('organizationChanged'));
    }
  }, [organizationOptions, requiresOrganizationDropdown, ticketingOrganizationValue, setValue, isOrganizationsLoading]);

  useEffect(() => {
    if (organizationsValue === undefined) return;

    if (!organizationsValue) {
      localStorage.removeItem('selectedCompany');
      window.dispatchEvent(new Event('companyChanged'));
      return;
    }

    // organizationsValue is now just a string (the ID)
    // Find the full option object to save both label and value
    const fullOption = userOptions.find((opt: DropdownOption) => opt.value === organizationsValue);
    const companyToSave = fullOption || { value: organizationsValue, label: 'Unknown' };

    localStorage.setItem('selectedCompany', JSON.stringify(companyToSave));
    window.dispatchEvent(new Event('companyChanged'));
  }, [organizationsValue, userOptions]);

  const showAdminDropdown = user?.accountState?.userType === 'admin' && shouldShowDropdown;
  const showOrganizationDropdown = showAdminDropdown && requiresOrganizationDropdown && Boolean(organizationsValue);
  const showOrganizerDropdown = user?.role === 'organizer';

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
            {showAdminDropdown && (
              <div className="w-full rounded-md bg-white md:w-[240px] dark:bg-[#171717]">
                <RHFCustomDropdown
                  name="organizations"
                  placeholder="Select Company"
                  options={userOptions}
                  isLoading={isUserLoading}
                  showNone={false}
                />
              </div>
            )}

            {showOrganizationDropdown && (
              <div className="w-full rounded-md bg-white md:w-[240px] dark:bg-[#171717]">
                <RHFCustomDropdown
                  name="ticketingOrganization"
                  placeholder="Select Organization"
                  options={organizationOptions}
                  isLoading={isOrganizationsLoading}
                  showNone={false}
                />
              </div>
            )}
          </div>

          {showOrganizerDropdown && (
            <div className="w-full rounded-md bg-white md:w-[240px] dark:bg-[#171717]">
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

        <Input placeholder="Search..." className="h-10 w-full rounded-full bg-white pl-5 md:w-[240px] lg:w-[280px]" />

        <div className="flex items-center justify-end gap-3">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
