import Header from '@/app/common/header/header';
import SystemLogsViewer from '@/sections/system-logs/system-logs-viewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Info Logs - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'System Logs', href: '/super-admin/system-logs' },
          { name: 'Server Info' },
        ]}
      />
      <SystemLogsViewer
        source="app"
        title="Server Info"
        description="Backend process INFO logs (startup, MongoDB connected, crons, etc.) — not mobile-app logs. Files: logs/app/app.log"
        live
        initialLimit={500}
      />
    </div>
  );
};

export default Page;
