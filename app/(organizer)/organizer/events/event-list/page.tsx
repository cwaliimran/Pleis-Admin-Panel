import Header from '@/app/common/header';
import EventList from '@/sections/event/event-list';

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
