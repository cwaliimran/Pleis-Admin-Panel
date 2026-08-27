import Header from '@/app/common/header/header';
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
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Streaks', href: '' },
        ]}
      />

      <StreaksViewV2 userType="organizer" />
    </div>
  );
};

export default Page;
