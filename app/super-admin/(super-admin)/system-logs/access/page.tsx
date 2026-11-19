import Header from '@/app/common/header/header';
import SystemLogsViewer from '@/sections/system-logs/system-logs-viewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTTP Request Logs - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'System Logs', href: '/super-admin/system-logs' },
          { name: 'HTTP Requests' },
        ]}
      />
      <SystemLogsViewer
        source="access"
        title="HTTP Requests"
        description="API hits by role folder: logs/access/admin, /app, /organizer, /staff, /webhook, /all. Pick a Surface to open that folder’s files."
        live
        initialLimit={500}
      />
    </div>
  );
};

export default Page;
