import Header from '@/app/common/header/header';
import DiscountsView from '@/sections/menu-management-modules/discounts/discounts-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discounts - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Discounts', href: '' },
        ]}
      />

      <DiscountsView userType="organizer" />
    </div>
  );
};

export default Page;
