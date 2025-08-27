import Header from '@/app/common/header';
import VenueList from '@/sections/venue-old/venue-list';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Venues', href: '' },
        ]}
      />

      <VenueList />
    </div>
  );
};

export default Page;
