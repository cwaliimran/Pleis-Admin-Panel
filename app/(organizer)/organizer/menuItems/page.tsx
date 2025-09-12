import Header from '@/app/common/header';
import MenuItemsView from '@/sections/menuItems/menuItems-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Menu Items', href: '' },
        ]}
      />

      <MenuItemsView />
    </div>
  );
};

export default Page;
