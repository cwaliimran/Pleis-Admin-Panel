import Header from '@/app/common/header/header';
import MenuItemView from '@/sections/menu-management/menuItems/menuItems-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Items - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Menu Items', href: '' },
        ]}
      />

      <MenuItemView />
    </div>
  );
};

export default Page;
