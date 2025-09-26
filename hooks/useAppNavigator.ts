'use client';

import { useRouter } from 'next/navigation';

export function useAppNavigator() {
  const router = useRouter();

  const navigate = (path: string) => {
    if (!path) return;
    router.push(path);
  };

  return { navigate };
}
