import Header from '@/app/common/header';
import HighlightsView from '@/sections/highlight-view/highlight-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Highlights - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Highlights', href: '' },
        ]}
      />

      <HighlightsView />
    </div>
  );
};

export default Page;
