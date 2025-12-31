import Header from '@/app/common/header/header';
import TagTypeView from '@/sections/tag-type/tag-type-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tag Type - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Tag Type', href: '' },
        ]}
      />

      <TagTypeView />
    </div>
  );
};

export default Page;
