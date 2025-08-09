import Header from '@/app/common/header';
import TransactionsView from '@/sections/transactions/transactions-view';

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Transactions', href: '' },
        ]}
      />

      <TransactionsView />
    </div>
  );
};

export default Page;
