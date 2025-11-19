'use client';

import { CompanySelectionStorage } from '@/app/common/header/company-selection-storage';
import { useEffect, useState } from 'react';

interface CompanySelectionState {
  companyId: string | null;
  organizationId: string | null;
  isLoading: boolean;
}

/**
 * Hook to track company and organization selection changes
 * Automatically re-renders when selection changes
 */
export function useCompanySelectionState(): CompanySelectionState {
  const [state, setState] = useState<CompanySelectionState>({
    companyId: CompanySelectionStorage.getCompanyId(),
    organizationId: CompanySelectionStorage.getOrganizationId(),
    isLoading: true,
  });

  useEffect(() => {
    // Initial load
    setState({
      companyId: CompanySelectionStorage.getCompanyId(),
      organizationId: CompanySelectionStorage.getOrganizationId(),
      isLoading: false,
    });

    // Subscribe to changes
    const unsubscribe = CompanySelectionStorage.onSelectionChange((event) => {
      setState({
        companyId: event.detail.companyId,
        organizationId: event.detail.organizationId,
        isLoading: false,
      });
    });

    return unsubscribe;
  }, []);

  return state;
}
