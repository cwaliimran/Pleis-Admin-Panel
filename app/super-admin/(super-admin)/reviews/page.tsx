import Header from '@/app/common/header/header';
import CompanyGuard from '@/components/guards/CompanyGuard';
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
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Reviews', href: '/super-admin/reviews' },
        ]}
      />

      <CompanyGuard>
        <ReviewsView />
      </CompanyGuard>
    </div>
  );
};

export default Page;
