import Header from '@/app/common/header';
import HighlightsView from '@/sections/highlight-view/highlight-view';
// import HighlightView from '@/sections/highlight/highlight-view';

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
      {/* <HighlightView /> */}
    </div>
  );
};

export default Page;
