'use client';
import { ModeToggle } from '@/components/atoms/mode-toggle';
import FormProvider from '@/components/rhf';
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
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import Profile from './profile';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();
  console.log('user', user);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = () => {};

  // URLs where organization dropdown should be shown for admin users
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

  const shouldShowOrganizationDropdown = superAdminUrls.some((url) =>
    pathname?.startsWith(url)
  );

  return (
    <div className="mt-4 flex flex-col-reverse justify-between gap-4 px-3 sm:px-5 md:my-8 md:items-center md:gap-6 lg:flex-row">
      {/* Breadcrumbs */}
      <div className={`${open ? '' : 'md:ml-10'} w-full overflow-x-auto`}>
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap gap-x-1">
            {links?.map((link, index) => (
              <div key={index} className="flex items-center">
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

      {/* Right-side Controls */}
      <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:items-start">
        {user?.accountState?.userType === 'admin' &&
          shouldShowOrganizationDropdown && (
            <>
              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="w-full rounded-md bg-white md:w-[240px] lg:w-[240px] dark:bg-[#171717]">
                  <RHFCustomDropdown
                    name="organizations"
                    placeholder="Select Company"
                    options={[
                      { value: 'org1', label: 'Company 1' },
                      { value: 'org2', label: 'Company 2' },
                      { value: 'org3', label: 'Company 3' },
                    ]}
                    isLoading={false}
                    showNone={false}
                  />
                </div>
              </FormProvider>
            </>
          )}

        <Input
          placeholder="Search..."
          className="h-10 w-[100%] rounded-full bg-white pl-5 md:w-[240px] lg:w-[280px]"
        />

        {user?.role === 'organizer' && (
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="w-full rounded-md bg-white md:w-[240px] lg:w-[240px] dark:bg-[#171717]">
              <RHFMultiSelect
                name="suppliers"
                placeholder="Select Organizations"
                options={[
                  { value: 'org1', label: 'Org 1' },
                  { value: 'org2', label: 'Org 2' },
                  { value: 'org3', label: 'Org 3' },
                ]}
              />
            </div>
          </FormProvider>
        )}

        <div className="flex items-center justify-end gap-3">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
