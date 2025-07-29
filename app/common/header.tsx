"use client";
import { ModeToggle } from "@/components/atoms/mode-toggle";
import FormProvider from "@/components/rhf";
import { RHFMultiSelect } from "@/components/rhf/rhf-multiselect";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { defaultValues, schema } from "@/lib/schemas/organization-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { FC } from "react";
import { useForm } from "react-hook-form";
import Profile from "./profile";

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const { user } = useAuth();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = () => {};

  return (
    <div className="flex flex-col-reverse lg:flex-row md:items-center justify-between gap-4 md:gap-6 px-3 sm:px-5 md:my-8 mt-4">
      {/* Breadcrumbs */}
      <div className={`${open ? "" : "md:ml-10"} w-full overflow-x-auto`}>
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
      <div className="flex flex-col-reverse sm:flex-row md:items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <Input
          placeholder="Search..."
          className=" w-[100%]  md:w-[240px] lg:w-[280px] h-10 rounded-full pl-5 bg-white"
        />
        {user?.role === "organizer" && (
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="w-full md:w-[240px] lg:w-[240px] bg-white rounded-md">
              <RHFMultiSelect
                name="suppliers"
                placeholder="Select Organizations"
                options={[
                  { value: "org1", label: "Org 1" },
                  { value: "org2", label: "Org 2" },
                  { value: "org3", label: "Org 3" },
                ]}
              />
            </div>
          </FormProvider>
        )}

        <div className="flex gap-3 items-center justify-end">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
