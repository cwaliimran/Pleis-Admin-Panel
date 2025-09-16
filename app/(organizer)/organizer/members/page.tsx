import Header from '@/app/common/header';
import MembersView from '@/sections/members/members-view';
// import MembersView from '@/sections/members-old/members-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Members', href: '' },
        ]}
      />

      <MembersView />
    </div>
  );
};

export default Page;
