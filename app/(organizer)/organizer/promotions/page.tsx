import Header from '@/app/common/header';
import PromotionsView from '@/sections/promotions/promotions-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Promotions', href: '' },
        ]}
      />

      <PromotionsView />
    </div>
  );
};

export default Page;
