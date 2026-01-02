import Header from '@/app/common/header/header';
import ReviewsView from '@/sections/reviews/reviews-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Reviews', href: '' },
        ]}
      />

      <ReviewsView userType="organizer" />
    </div>
  );
};

export default Page;
