import Header from '@/app/common/header';
// import VenueList from '@/sections/venue-old/venue-list';
import VenueView from '@/sections/venue/venue-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venues - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Venues', href: '' },
        ]}
      />

      <VenueView />
    </div>
  );
};

export default Page;
