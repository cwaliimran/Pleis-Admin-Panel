import Header from '@/app/common/header';
import EventDetailsPage from '@/sections/event/eventDetailsPage';

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
