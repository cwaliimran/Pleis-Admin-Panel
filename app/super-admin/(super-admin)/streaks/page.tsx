import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import StreaksView from '@/sections/streaks/streaks-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Streaks - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Streaks', href: '' },
        ]}
      />

      <CompanyGuard>
        <StreaksView global={false} />
      </CompanyGuard>
    </div>
  );
};

export default Page;
