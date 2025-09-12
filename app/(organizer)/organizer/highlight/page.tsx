import Header from '@/app/common/header';
// import HighlightView from '@/sections/highlight/highlight-view';
import HighlightsView from '@/sections/highlight-view/highlight-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Highlights', href: '' },
        ]}
      />

      <HighlightsView />
    </div>
  );
};

export default Page;
