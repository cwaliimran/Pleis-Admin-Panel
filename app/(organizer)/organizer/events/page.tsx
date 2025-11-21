import Header from '@/app/common/header/header';
import EventList from '@/sections/event/event-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-6">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Events', href: '' },
        ]}
      />

      <EventList userType="organizer" />
    </div>
  );
};

export default Page;
