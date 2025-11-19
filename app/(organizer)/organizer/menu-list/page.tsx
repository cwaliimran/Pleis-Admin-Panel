import Header from '@/app/common/header/header';
import MenuListView from '@/sections/menu-management/menulist/menulist-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu List - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Menu List', href: '' },
        ]}
      />

      <MenuListView />
    </div>
  );
};

export default Page;
