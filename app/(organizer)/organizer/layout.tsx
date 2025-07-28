// "use client"
// import SidebarToggleButton from "@/app/common/siebarToggleButton";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import React, { FC } from "react";

// interface DashboardLayoutProps {
//     left?: React.ReactNode;
//     right?: React.ReactNode;
//     children: React.ReactNode;
// }

// const DashboardLayout: FC<DashboardLayoutProps> = ({ left, right, children }) => {
//     return (
//         <div className="flex min-h-screen ">
//             <SidebarProvider >
//                 <aside className=" border-r">{left}</aside>

//                 <SidebarToggleButton fromOrganizer={true}/>
//                 <main className="flex-1 dark:bg-black md:px-5 px-2  bg-[#f8f6f7]">{children}</main>

//                 <aside className="fixed top-5 right-5 md:top-10 md:right-10">
//                     {right}
//                 </aside>
//             </SidebarProvider>

//         </div>
//     );
// };

// export default DashboardLayout;

"use client";

import SidebarToggleButton from "@/app/common/siebarToggleButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OrganizerGuard } from "@/components/guards";
import React, { FC } from "react";

interface DashboardLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({
  left,
  right,
  children,
}) => {
  return (
    <OrganizerGuard>
      <div className="flex min-h-screen">
        <SidebarProvider>
          {/* Sidebar */}
          <aside className="sticky top-0 h-screen z-20">{left}</aside>
          <SidebarToggleButton />

          <main className="flex-1 dark:bg-black md:px-5 px-2  bg-[#f8f6f7]">
            {children}
          </main>

          <aside className="fixed top-5 right-5 md:top-10 md:right-10">
            {right}
          </aside>
        </SidebarProvider>
      </div>
    </OrganizerGuard>
  );
};

export default DashboardLayout;
