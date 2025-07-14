"use client"
import React, { FC } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Profile from './profile';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ModeToggle } from '@/components/atoms/mode-toggle';
import { useSidebar } from '@/components/ui/sidebar';

interface HeaderProps {
    links?: {
        name: string;
        href?: string;
    }[];
}

const Header: FC<HeaderProps> = ({ links }) => {
    const { open } = useSidebar();

    return (
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4  md:my-8 mt-8 mb-4">
            <div className={` ${open ? "" : "md:ml-10"} ml-3`}>
                <Breadcrumb>
                    <BreadcrumbList>
                        {links?.map((link, index) => (
                            <div key={index} className="flex items-center">
                                <BreadcrumbItem  >
                                    <BreadcrumbLink asChild>
                                        {link.href && <Link href={link.href} > {link.name} </Link>}
                                    </BreadcrumbLink>
                                    {!link.href && <BreadcrumbPage>{link.name}</BreadcrumbPage>}
                                </BreadcrumbItem>
                                {link.href && <BreadcrumbSeparator />}
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Search and Profile */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6 xl:gap-5 2xl:gap-5 md:mt-0 mt-7">
                <Input
                    placeholder="Search..."
                    className="w-full md:w-[300px] lg:w-[400px] xl:w-[500px] h-10 rounded-full pl-5"
                />
                <ModeToggle />
                <Profile />
            </div>
        </div>
    );
};

export default Header;
