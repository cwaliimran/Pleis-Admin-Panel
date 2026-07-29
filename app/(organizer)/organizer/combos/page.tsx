import Header from '@/app/common/header/header';
import ComboView from '@/sections/menu-management-modules/combos/combos-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combos - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Combos', href: '' },
        ]}
      />

      <ComboView userType="organizer" />
    </div>
  );
};

export default Page;
