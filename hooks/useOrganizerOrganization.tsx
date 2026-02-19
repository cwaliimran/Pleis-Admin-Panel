'use client';

import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form'; // <-- native RHF FormProvider, not your custom one
import * as Yup from 'yup';

// ============================================================
// TYPES
// ============================================================

interface StoredOrganizerOrganization {
  value: string;
  label: string;
}

interface UseOrganizerOrganizationOptions {
  userType: 'organizer' | 'super-admin';
  storageKey: string;
  overrideOrganizationId?: string;
}

interface UseOrganizerOrganizationReturn {
  organizationId: string | undefined; // null is coerced to undefined — Error 1 fixed
  isOrgRequired: boolean;
  OrganizationDropdown: React.ReactNode;
}

interface OrganizationFormValues {
  organizationId: string;
}

// ============================================================
// STORAGE FACTORY
// ============================================================

const createStorage = (storageKey: string) => ({
  get: (): StoredOrganizerOrganization | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  set: (organization: StoredOrganizerOrganization | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (organization) {
        localStorage.setItem(storageKey, JSON.stringify(organization));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {}
  },

  getId: (): string => {
    if (typeof window === 'undefined') return '';
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return '';
      const parsed = JSON.parse(stored);
      return parsed?.value || '';
    } catch {
      return '';
    }
  },
});

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const organizationSchema = Yup.object().shape({
  organizationId: Yup.string().required('Organization is required'),
});

// ============================================================
// HOOK
// ============================================================

export const useOrganizerOrganization = ({
  userType,
  storageKey,
  overrideOrganizationId,
}: UseOrganizerOrganizationOptions): UseOrganizerOrganizationReturn => {
  // null → undefined coercion fixes Error 1
  const { organizationId: adminOrganizationId } = useCompanySelectionState();
  const adminOrgId = adminOrganizationId ?? undefined;

  const isOrganizer = userType === 'organizer';
  const storage = useMemo(() => createStorage(storageKey), [storageKey]);
  const showDropdown = isOrganizer && !overrideOrganizationId;

  // ---- Form ----
  const organizationMethods = useForm<OrganizationFormValues>({
    resolver: yupResolver(organizationSchema),
    defaultValues: { organizationId: storage.getId() },
    mode: 'onChange',
  });

  const { watch, setValue } = organizationMethods;
  const selectedOrganizerOrganizationId = watch('organizationId');

  // ---- API ----
  const {
    data: organizerOrganizationsResponse,
    isLoading: isLoadingOrganizations,
    isFetching: isFetchingOrganizations,
  } = useGetOrganizationsOnOrganizerSideQuery({}, { skip: !showDropdown });

  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((org: any) => ({
        label: org?.title || org?.basicInfo?.name || 'Unknown Organization',
        value: org?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  // ---- Auto-select: current valid → localStorage → first option ----
  useEffect(() => {
    if (!showDropdown || organizerOrganizationOptions.length === 0) return;

    const storedOrgId = storage.getId();

    if (
      selectedOrganizerOrganizationId &&
      organizerOrganizationOptions.some((opt: { value: string }) => opt.value === selectedOrganizerOrganizationId)
    ) {
      return;
    }

    if (storedOrgId && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === storedOrgId)) {
      setValue('organizationId', storedOrgId);
      return;
    }

    setValue('organizationId', organizerOrganizationOptions[0].value);
  }, [showDropdown, organizerOrganizationOptions, selectedOrganizerOrganizationId, setValue, storage]);

  // ---- Persist to localStorage ----
  useEffect(() => {
    if (!showDropdown) return;

    if (!selectedOrganizerOrganizationId) {
      storage.set(null);
      return;
    }

    const selectedOption = organizerOrganizationOptions.find(
      (opt: { value: string; label: string }) => opt.value === selectedOrganizerOrganizationId
    );

    if (selectedOption) {
      storage.set({ value: selectedOption.value, label: selectedOption.label });
    }
  }, [showDropdown, selectedOrganizerOrganizationId, organizerOrganizationOptions, storage]);

  // ---- Resolve final organizationId (no null, always string | undefined) ----
  const organizationId: string | undefined = overrideOrganizationId
    ? overrideOrganizationId
    : showDropdown
      ? selectedOrganizerOrganizationId || undefined
      : adminOrgId;

  const isOrgRequired = showDropdown && !organizationId;

  // ---- Dropdown JSX ----
  // Uses native RHF FormProvider (renders no <form> tag) instead of
  // the custom FormProvider wrapper — fixes nested <form> Error 2
  const OrganizationDropdown = showDropdown ? (
    <FormProvider {...organizationMethods}>
      <div className="w-60">
        <RHFCustomDropdown
          name="organizationId"
          placeholder="Select Organization"
          options={organizerOrganizationOptions}
          isLoading={isLoadingOrganizations || isFetchingOrganizations}
          showNone={false}
        />
      </div>
    </FormProvider>
  ) : null;

  return { organizationId, isOrgRequired, OrganizationDropdown };
};
