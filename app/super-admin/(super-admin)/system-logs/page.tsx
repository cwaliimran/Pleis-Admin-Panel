import Header from '@/app/common/header/header';
import SystemLogsViewer from '@/sections/system-logs/system-logs-viewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Logs — Live Stream - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'System Logs', href: '/super-admin/system-logs' },
          { name: 'Live Stream' },
        ]}
      />
      <SystemLogsViewer
        title="Live Stream"
        description="Central live feed. Use Surface for Admin / App / Organizer / Staff (maps to logs/access/{role}/). Server Info & Errors are process-wide."
        live
      />
    </div>
  );
};

export default Page;
