"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useQuickNavigation = () => {
  const router = useRouter();

  const navigate = useCallback(
    (url: string) => {
      // Use replace for faster navigation and prevent back button issues
      router.push(url);
    },
    [router]
  );

  return { navigate };
};
