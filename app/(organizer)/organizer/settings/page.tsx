import Header from '@/app/common/header/header';
import OrganizerSettingsView from '@/sections/loyalty-modules/organizer-loyalty-settings/organizer-settings-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Settings', href: '' },
        ]}
      />

      <OrganizerSettingsView />
    </div>
  );
};

export default Page;
