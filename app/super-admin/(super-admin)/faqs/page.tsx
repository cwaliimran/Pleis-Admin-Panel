import Header from '@/app/common/header/header';
import FaqsView from '@/sections/faqs-view/faqs-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'FAQs', href: '/super-admin/faqs' },
        ]}
      />

      <FaqsView />
    </div>
  );
};

export default Page;

