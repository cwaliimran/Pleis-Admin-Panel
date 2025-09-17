import Header from '@/app/common/header';
import VenueTypeView from '@/sections/venueType/venueTypeView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venue Type - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Venue Type', href: '' },
        ]}
      />

      <VenueTypeView />
    </div>
  );
};

export default Page;
