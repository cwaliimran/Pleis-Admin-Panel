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
                <div className="md:relative fixed md:top-0 top-16 left-0 right-0 flex flex-col flex-1">
                    <SidebarTrigger className="mt-5 cursor-pointer md:ml-3 ml-0 border md border-red-600 " />
                    <main className="flex-1 md:p-6 px-2 pt-10 bg-background">{children}</main>
                </div>
                <aside className="fixed top-5 right-5 md:top-10 md:right-10">
                    {right}
                </aside>
            </SidebarProvider>

        </div>
    );
};

export default DashboardLayout;
