import Header from '@/app/common/header/header';
import LevelStatusView from '@/sections/global-loyalty-modules/level-status/level-status-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Level Status - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Level Status', href: '' },
        ]}
      />

      <LevelStatusView />
    </div>
  );
};

export default Page;
