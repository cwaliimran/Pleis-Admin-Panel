'use client';

import { Button } from '@/components/ui/button';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.userSlice);

  const handleGoBack = () => {
    if (user?.role === 'admin') router.push('/super-admin');
    else if (user?.role === 'organizer') router.push('/organizer');
    else router.push('/');
  };

  return (
    <>
      <section className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">404</h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">Something&#39;s missing.</p>
            <p className="text-md mb-4 font-light text-gray-600 dark:text-gray-400">You don&#39;t have permission to access this area.</p>

            <Button onClick={handleGoBack} variant="default" className="mt-2 cursor-pointer px-6 py-3">
              Go Back
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
