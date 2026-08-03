import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
import StreaksViewV2 from '@/sections/loyalty-modules/streaks-v2/streaks-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Streaks - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Loyalty', href: '/super-admin' },
          { name: 'Streaks Analytics', href: '' },
        ]}
      />

      <CompanyGuard>
        <StreaksViewV2 />
      </CompanyGuard>
    </div>
  );
};

export default Page;
