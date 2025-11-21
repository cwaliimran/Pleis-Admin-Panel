import Header from '@/app/common/header/header';
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

      <StreaksView global={false} />
    </div>
  );
};

export default Page;
