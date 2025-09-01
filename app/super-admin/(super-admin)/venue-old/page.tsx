import Header from '@/app/common/header';
// import VenueList from '@/sections/venue-old/venue-list';
import VenueView from '@/sections/venue/venue-view';

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
