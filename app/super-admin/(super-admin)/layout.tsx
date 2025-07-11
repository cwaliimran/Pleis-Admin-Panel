
"use client";

import SidebarToggleButton from "@/app/common/siebarToggleButton";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import React, { FC } from "react";

interface DashboardLayoutProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ left, right, children }) => {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        {/* Sidebar */}
        <aside className="relative z-20">
          {left}
        </aside>       
         <SidebarToggleButton />

        <main className="flex-1 bg-background">{children}</main>

        <aside className="fixed top-5 right-5 md:top-10 md:right-10">
          {right}
        </aside>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
