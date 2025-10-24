'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useGetUserListQuery } from '@/store/Reducer/user-list';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
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
  organizations: DropdownOption | null;
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  organizations: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .defined(),
});

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const defaultCompany = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('selectedCompany');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const methods = useForm<FormValues>({
    resolver: yupResolver<FormValues, any, FormValues>(schema),
    defaultValues: { organizations: defaultCompany },
  });

  const { watch } = methods;
  const organizationsValue = watch('organizations');

  const { data: apiData, isLoading: isUserLoading } = useGetUserListQuery({
    page: 0,
    search: '',
    limit: 10000,
    userType: 'organizer',
  });

  const userOptions =
    apiData?.data?.map((u: any) => ({
      label: u?.basicInfo?.companyDetails?.name || 'Unknown Company',
      value: u?.basicInfo?._id,
    })) || [];

    
  useEffect(() => {
    if (organizationsValue === undefined) return;

    if (
      !organizationsValue ||
      (Array.isArray(organizationsValue) && organizationsValue.length === 0)
    ) {
      localStorage.removeItem('selectedCompany');
      window.dispatchEvent(new Event('companyChanged'));
      return;
    }

    localStorage.setItem('selectedCompany', JSON.stringify(organizationsValue));
    window.dispatchEvent(new Event('companyChanged'));
  }, [organizationsValue]);


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
  ];

  const shouldShowDropdown = superAdminUrls.some((url) =>
    pathname?.startsWith(url)
  );

  const showAdminDropdown =
    user?.accountState?.userType === 'admin' && shouldShowDropdown;
  const showOrganizerDropdown = user?.role === 'organizer';

  return (
    <div className="mt-4 flex flex-col-reverse justify-between gap-4 px-3 sm:px-5 md:my-8 md:items-center md:gap-6 lg:flex-row">
      <div className={`${open ? '' : 'md:ml-10'} w-full overflow-x-auto`}>
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap gap-x-1">
            {links?.map((link, i) => (
              <div key={i} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    {link.href ? (
                      <Link href={link.href}>{link.name}</Link>
                    ) : null}
                  </BreadcrumbLink>
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
          {showAdminDropdown && (
            <div className="w-full rounded-md bg-white md:w-[240px] dark:bg-[#171717]">
              <RHFCustomDropdown
                name="organizations"
                placeholder="Select Company"
                options={userOptions}
                isLoading={isUserLoading}
                showNone
              />
            </div>
          )}

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

        <Input
          placeholder="Search..."
          className="h-10 w-[100%] rounded-full bg-white pl-5 md:w-[240px] lg:w-[280px]"
        />

        <div className="flex items-center justify-end gap-3">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
