import Header from '@/app/common/header/header';
import PresetView from '@/sections/menu-management-modules/preset/preset-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preset - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Preset', href: '' },
        ]}
      />

      <PresetView />
    </div>
  );
};

export default Page;
