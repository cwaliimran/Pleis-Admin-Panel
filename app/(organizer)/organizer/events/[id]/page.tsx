import Header from '@/app/common/header/header';
import EventDetailsPage from '@/sections/event/eventDetailsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Event - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-6">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Events', href: '/organizer/events' },
          { name: 'Event Detail', href: '' },
        ]}
      />

      <EventDetailsPage />
    </div>
  );
};

export default Page;
