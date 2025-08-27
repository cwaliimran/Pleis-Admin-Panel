import Header from '@/app/common/header';
import TagsView from '@/sections/tags/tags-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Tags', href: '' },
        ]}
      />

      <TagsView />
    </div>
  );
};

export default Page;
