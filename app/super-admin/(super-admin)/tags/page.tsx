import Header from '@/app/common/header';
import TagsView from '@/sections/tags/tags-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags - Pleis',
};

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
