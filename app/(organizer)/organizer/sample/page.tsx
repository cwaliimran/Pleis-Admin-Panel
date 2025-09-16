import Header from '@/app/common/header';
import SampleView from '@/sections/sample-table/sample-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Sample Page', href: '' },
        ]}
      />

      <SampleView />
    </div>
  );
};

export default Page;
