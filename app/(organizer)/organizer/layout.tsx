'use client';

import BillkoKeyWarning from '@/app/common/billko-key-warning';
import SidebarToggleButton from '@/app/common/siebarToggleButton';
import { OrganizerGuard } from '@/components/guards';
import PartnerLegalGate from '@/components/legal/PartnerLegalGate';
import { SidebarProvider } from '@/components/ui/sidebar';
import React, { FC } from 'react';

interface DashboardLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ left, right, children }) => {
  return (
    <OrganizerGuard>
      {/* Hard gate: nothing below renders until Partner T&C + Privacy Policy are accepted. */}
      <PartnerLegalGate>
        {/* Persistent top-centre warning while the Billko API key is unset */}
        <BillkoKeyWarning />

        <div className="flex min-h-screen">
          <SidebarProvider>
            {/* Sidebar */}
            <aside className="sticky top-0 z-20 h-screen">{left}</aside>
            <SidebarToggleButton />

            {/* `min-w-0` lets this shrink below its content's intrinsic width.
                Without it a wide table widens the whole page instead of
                scrolling inside its own container. */}
            <main className="min-w-0 flex-1 bg-[#f8f6f7] px-2 md:px-5 dark:bg-black">{children}</main>

            <aside className="fixed top-5 right-5 md:top-10 md:right-10">{right}</aside>
          </SidebarProvider>
        </div>
      </PartnerLegalGate>
    </OrganizerGuard>
  );
};

export default DashboardLayout;
