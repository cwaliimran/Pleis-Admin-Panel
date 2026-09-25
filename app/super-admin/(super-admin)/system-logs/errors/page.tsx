import Header from '@/app/common/header/header';
import SystemLogsViewer from '@/sections/system-logs/system-logs-viewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Errors & Warnings - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'System Logs', href: '/super-admin/system-logs' },
          { name: 'Errors & Warnings' },
        ]}
      />
      <SystemLogsViewer
        source="error"
        title="Errors & Warnings"
        description="Backend WARN/ERROR lines (Mongo failures, request crashes, shutdowns). Same server for admin + app APIs. Files: logs/app/error.log"
        live
        initialLimit={800}
      />
    </div>
  );
};

export default Page;
