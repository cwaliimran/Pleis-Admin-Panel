import Header from '@/app/common/header/header';
import PartnerLegalView from '@/sections/legal/PartnerLegalView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Legal', href: '' },
        ]}
      />

      <PartnerLegalView />
    </div>
  );
};

export default Page;
