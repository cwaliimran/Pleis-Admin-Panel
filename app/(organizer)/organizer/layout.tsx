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
                <SidebarTrigger className="mt-5 cursor-pointer md:ml-3 ml-0 md:relative fixed" />
                <main className="flex-1 p-6 bg-background">{children}</main>
                <aside className="fixed top-5 right-5 md:top-10 md:right-10">
                    {right}
                </aside>
            </SidebarProvider>

        </div>
    );
};

export default DashboardLayout;
