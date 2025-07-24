
"use client";
import React, { FC, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Profile from "./profile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/atoms/mode-toggle";
import { useSidebar } from "@/components/ui/sidebar";

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

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
                    {link.href ? <Link href={link.href}>{link.name}</Link> : null}
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

        <Select
          value={selectedOrganization}
          onValueChange={setSelectedOrganization}
        >
          <SelectTrigger className="w-full md:w-[180px] h-10 bg-white">
            <SelectValue placeholder="Select Organization" />
          </SelectTrigger>
          <SelectContent className="dark:bg-secondary">
            <SelectItem value="org1">Organization 1</SelectItem>
            <SelectItem value="org2">Organization 2</SelectItem>
            <SelectItem value="org3">Organization 3</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-3 items-center justify-end">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
