'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Building2, Users2 } from 'lucide-react';

interface CompanyGuardProps {
  children: React.ReactNode;
}

const CompanyGuard = ({ children }: CompanyGuardProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompanySelected, setIsCompanySelected] = useState<boolean>(false);
  const [isOrganizationSelected, setIsOrganizationSelected] = useState<boolean>(false);
  const pathname = usePathname();
  const requiresOrganizationSelection = useMemo(() => pathname?.startsWith('/super-admin/ticketing') ?? false, [pathname]);

  useEffect(() => {
    if (user?.accountState?.userType !== 'admin') {
      setIsCompanySelected(true);
      setIsOrganizationSelected(true);
      setIsLoading(false);
      return;
    }

    const checkCompanySelection = () => {
      try {
        const selectedCompany = localStorage.getItem('selectedCompany');

        if (!selectedCompany) {
          setIsCompanySelected(false);
          setIsOrganizationSelected(!requiresOrganizationSelection);
          setIsLoading(false);
          return;
        }

        const parsedCompany = JSON.parse(selectedCompany);

        if (!parsedCompany) {
          setIsCompanySelected(false);
          setIsOrganizationSelected(!requiresOrganizationSelection);
          setIsLoading(false);
          return;
        }

        // If it's an array (multi-select), check if it has items
        if (Array.isArray(parsedCompany) && parsedCompany.length === 0) {
          setIsCompanySelected(false);
          setIsOrganizationSelected(!requiresOrganizationSelection);
          setIsLoading(false);
          return;
        }

        const companyId = parsedCompany?.value ?? parsedCompany?.id ?? null;

        setIsCompanySelected(true);

        if (requiresOrganizationSelection) {
          const selectedOrganization = localStorage.getItem('selectedOrganization');

          if (!selectedOrganization) {
            setIsOrganizationSelected(false);
            setIsLoading(false);
            return;
          }

          const parsedOrganization = JSON.parse(selectedOrganization);

          if (!parsedOrganization) {
            setIsOrganizationSelected(false);
            setIsLoading(false);
            return;
          }

          if (Array.isArray(parsedOrganization) && parsedOrganization.length === 0) {
            setIsOrganizationSelected(false);
            setIsLoading(false);
            return;
          }

          if (parsedOrganization?.companyId && companyId && parsedOrganization.companyId !== companyId) {
            setIsOrganizationSelected(false);
            setIsLoading(false);
            return;
          }

          setIsOrganizationSelected(true);
        } else {
          setIsOrganizationSelected(true);
        }

        setIsLoading(false);
      } catch {
        setIsCompanySelected(false);
        setIsOrganizationSelected(!requiresOrganizationSelection);
        setIsLoading(false);
      }
    };

    checkCompanySelection();

    // Listen for storage changes (when company is selected)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCompany' || e.key === 'selectedOrganization') {
        checkCompanySelection();
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleCompanyChange = () => {
      checkCompanySelection();
    };

    const handleOrganizationChange = () => {
      checkCompanySelection();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('companyChanged', handleCompanyChange);
    window.addEventListener('organizationChanged', handleOrganizationChange);

    // Poll for changes every second (backup for same-tab detection)
    const intervalId = setInterval(checkCompanySelection, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('companyChanged', handleCompanyChange);
      window.removeEventListener('organizationChanged', handleOrganizationChange);
      clearInterval(intervalId);
    };
  }, [user, requiresOrganizationSelection]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isCompanySelected && user?.accountState?.userType === 'admin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Building2 className="text-primary h-10 w-10" />
          </div>
          <h2 className="text-foreground mb-3 text-2xl font-semibold">Select a Company</h2>
          <p className="text-muted-foreground mb-6">Please select a company from the dropdown in the header to view and manage rewards.</p>
        </div>
      </div>
    );
  }

  if (requiresOrganizationSelection && !isOrganizationSelected && user?.accountState?.userType === 'admin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Users2 className="text-primary h-10 w-10" />
          </div>
          <h2 className="text-foreground mb-3 text-2xl font-semibold">Select an Organization</h2>
          <p className="text-muted-foreground mb-6">Please select an organization from the dropdown in the header to continue.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CompanyGuard;
