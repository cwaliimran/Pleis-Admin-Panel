"use client"
import SidebarToggleButton from "@/app/common/siebarToggleButton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { FC } from "react";

interface DashboardLayoutProps {
    left?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ left, right, children }) => {
    return (
        <div className="flex min-h-screen ">
            <SidebarProvider >
                <aside className=" border-r">{left}</aside>
               
                <SidebarToggleButton fromOrganizer={true}/>
                {/* <main className="flex-1 md:p-6 px-2 pt-10 bg-background">{children}</main> */}
                <main className="flex-1 bg-background md:mx-5">{children}</main>
                
                <aside className="fixed top-5 right-5 md:top-10 md:right-10">
                    {right}
                </aside>
            </SidebarProvider>

        </div>
    );
};

export default DashboardLayout;
