import Header from '@/app/common/header';
import VenueView from '@/sections/venue/venue-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venue - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Venues', href: '' },
        ]}
      />

      <VenueView />
    </div>
  );
};

export default Page;
