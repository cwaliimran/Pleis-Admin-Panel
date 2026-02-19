'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { useDeleteBundleMutation, useGetBundlesQuery } from '@/store/Reducer/bundles-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BundleModal from './bundle-modal/bundles-modal';
import BundleTable from './bundles-table';

// ============================================================
// STORAGE HELPERS
// ============================================================

const ORGANIZER_ORG_STORAGE_KEY = 'bundles-organizer-organization';

interface StoredOrganizerOrganization {
  value: string;
  label: string;
}

const OrganizerOrganizationStorage = {
  get: (): StoredOrganizerOrganization | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ORGANIZER_ORG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  set: (organization: StoredOrganizerOrganization | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (organization) {
        localStorage.setItem(ORGANIZER_ORG_STORAGE_KEY, JSON.stringify(organization));
      } else {
        localStorage.removeItem(ORGANIZER_ORG_STORAGE_KEY);
      }
    } catch {
      // Silently fail
    }
  },

  getId: (): string => {
    const stored = OrganizerOrganizationStorage.get();
    return stored?.value || '';
  },
};

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const organizationSchema = Yup.object().shape({
  organizationId: Yup.string().required('Organization is required'),
});

interface OrganizationFormValues {
  organizationId: string;
}

// ============================================================
// COMPONENT
// ============================================================

const BundlesView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { companyId, organizationId: adminOrganizationId } = useCompanySelectionState();
  const isOrganizer = userType === 'organizer';

  // ============================================================
  // ORGANIZER ORGANIZATION FORM
  // ============================================================

  const organizationMethods = useForm<OrganizationFormValues>({
    resolver: yupResolver(organizationSchema),
    defaultValues: {
      organizationId: OrganizerOrganizationStorage.getId(),
    },
    mode: 'onChange',
  });

  const { watch: watchOrganization, setValue: setOrganizationValue } = organizationMethods;
  const selectedOrganizerOrganizationId = watchOrganization('organizationId');

  const {
    data: organizerOrganizationsResponse,
    isLoading: isLoadingOrganizerOrganizations,
    isFetching: isFetchingOrganizerOrganizations,
  } = useGetOrganizationsOnOrganizerSideQuery({}, { skip: !isOrganizer });

  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((organization: any) => ({
        label: organization?.title || organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  // Auto-select: 1. current valid, 2. localStorage, 3. first option
  useEffect(() => {
    if (!isOrganizer || organizerOrganizationOptions.length === 0) return;

    const currentSelection = selectedOrganizerOrganizationId;
    const storedOrgId = OrganizerOrganizationStorage.getId();

    if (currentSelection && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === currentSelection)) {
      return;
    }

    if (storedOrgId && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === storedOrgId)) {
      setOrganizationValue('organizationId', storedOrgId);
      return;
    }

    setOrganizationValue('organizationId', organizerOrganizationOptions[0].value);
  }, [isOrganizer, organizerOrganizationOptions, selectedOrganizerOrganizationId, setOrganizationValue]);

  // Persist selection to localStorage
  useEffect(() => {
    if (!isOrganizer) return;

    if (!selectedOrganizerOrganizationId) {
      OrganizerOrganizationStorage.set(null);
      return;
    }

    const selectedOption = organizerOrganizationOptions.find(
      (opt: { value: string; label: string }) => opt.value === selectedOrganizerOrganizationId
    );

    if (selectedOption) {
      OrganizerOrganizationStorage.set({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  }, [isOrganizer, selectedOrganizerOrganizationId, organizerOrganizationOptions]);

  // Resolve effective organizationId
  const organizationId = isOrganizer ? selectedOrganizerOrganizationId : adminOrganizationId;
  const isOrganizerOrgLoading = isLoadingOrganizerOrganizations || isFetchingOrganizerOrganizations;

  // Reset to page 1 when org changes
  useEffect(() => {
    setPage(1);
  }, [organizationId]);

  // ============================================================
  // DATA FETCHING
  // ============================================================

  const [deleteBundle, { isLoading: deleteLoading }] = useDeleteBundleMutation();

  const { data: apiData, isLoading } = useGetBundlesQuery(
    {
      page: page - 1,
      search,
      limit,
      status: status === 'all' ? '' : status,
      date: date ? formatDate(date) : undefined,
      organization: organizationId || undefined,
    },
    { skip: isOrganizer && !organizationId }
  );

  const [localData, setLocalData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setLocalData(apiData.data);
      setMeta(
        apiData.meta || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    }
  }, [apiData, page, limit]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const selectedData = localData?.find((item: any) => item?._id === id);

    if (selectedData) {
      setSelectedId(id);
      setSelectedRecord(selectedData);
      editModal.onTrue();
      openModal.onTrue();
    } else {
      showError('Bundle not found');
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No Bundle selected');
        return;
      }
      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  const onDelete = async () => {
    try {
      const response = await deleteBundle(selectedId).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Deleted successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div>
      {/* Top Bar */}
      <div className="mt-3 flex w-full items-center justify-end gap-3 md:mt-0">
        {isOrganizer && (
          <FormProvider methods={organizationMethods} onSubmit={() => {}}>
            <div className="w-60">
              <RHFCustomDropdown
                name="organizationId"
                placeholder="Select Organization"
                options={organizerOrganizationOptions}
                isLoading={isOrganizerOrgLoading}
                showNone={false}
              />
            </div>
          </FormProvider>
        )}

        <Button
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
          onClick={handleCreateNew}
          disabled={isOrganizer && !organizationId}
        >
          <Plus />
          Create Bundle
        </Button>
      </div>

      {/* Guard: organizer must select org first */}
      {isOrganizer && !organizationId ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Select an Organization</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Please select an organization from the dropdown above to view bundles</p>
        </div>
      ) : (
        <BundleTable
          data={localData}
          meta={meta}
          loading={isLoading}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          search={search}
          limit={limit}
          page={page}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          date={date}
          onDateChange={(val) => {
            setDate(val);
            setPage(1);
          }}
          onResetFilters={() => {
            setStatus('');
            setDate(undefined);
            setSearch('');
            setPage(1);
          }}
        />
      )}

      {openModal.value && (
        <BundleModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          companyId={companyId}
          organizationId={organizationId}
          userType={userType}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Bundle"
        content="Are you sure you want to delete this bundle?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default BundlesView;

// 'use client';

// import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
// import { Button } from '@/components/ui/button';
// import { useBoolean } from '@/hooks/useBoolean';
// import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
// import { useDeleteBundleMutation, useGetBundlesQuery } from '@/store/Reducer/bundles-api';
// import { getErrorMessage } from '@/utils/api';
// import { formatDate } from '@/utils/format-time';
// import { showError, showSuccess } from '@/utils/toast';
// import { Plus } from 'lucide-react';
// import { useCallback, useEffect, useState } from 'react';
// import BundleModal from './bundle-modal/bundles-modal';
// import BundleTable from './bundles-table';

// const BundlesView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
//   const openModal = useBoolean();
//   const editModal = useBoolean();
//   const deleteModal = useBoolean();

//   // Pagination and filter state
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState<string>('');
//   const [date, setDate] = useState<Date | undefined>(undefined);

//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [selectedRecord, setSelectedRecord] = useState<any>(null);

//   const { companyId, organizationId } = useCompanySelectionState();

//   const [deleteBundle, { isLoading: deleteLoading }] = useDeleteBundleMutation();

//   const { data: apiData, isLoading } = useGetBundlesQuery({
//     page: page - 1,
//     search,
//     limit,
//     status: status === 'all' ? '' : status,
//     date: date ? formatDate(date) : undefined,
//   });

//   const [localData, setLocalData] = useState<any[]>([]);

//   const [meta, setMeta] = useState<any>({
//     currentPage: page,
//     totalPages: 1,
//     totalRecords: 0,
//     limit,
//   });

//   useEffect(() => {
//     if (apiData?.data) {
//       setLocalData(apiData.data);
//       setMeta(
//         apiData.meta || {
//           currentPage: page,
//           totalPages: 1,
//           totalRecords: 0,
//           limit,
//         }
//       );
//     }
//   }, [apiData, page, limit]);

//   const handleCreateNew = () => {
//     setSelectedRecord(null);
//     setSelectedId(null);
//     editModal.onFalse();
//     openModal.onTrue();
//   };

//   // ------------ EDIT FUNCTION FOR API VERSION ------------
//   const handleEdit = (id: string) => {
//     const selectedData = localData?.find((item: any) => item?._id === id);

//     if (selectedData) {
//       setSelectedId(id);
//       setSelectedRecord(selectedData);
//       editModal.onTrue();
//       openModal.onTrue();
//     } else {
//       showError('Bundle not found');
//     }
//   };

//   const handleDelete = useCallback(
//     (id: string) => {
//       if (!id) {
//         showError('No Bundle selected');
//         return;
//       }

//       setSelectedId(id);
//       deleteModal.onTrue();
//     },
//     [deleteModal]
//   );

//   // DELETE CALL
//   const onDelete = async () => {
//     try {
//       const response = await deleteBundle(selectedId).unwrap();

//       if (response?.error) {
//         const errorMessage = getErrorMessage(response.error);
//         showError(errorMessage);
//         return;
//       }

//       showSuccess(response?.message || 'Deleted successfully');

//       setSelectedId(null);
//       deleteModal.onFalse();
//     } catch (error) {
//       showError(getErrorMessage(error));
//     }
//   };

//   return (
//     <div>
//       <div>
//         <div className="mt-3 flex w-full items-center justify-end md:mt-0">
//           <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
//             <Plus />
//             Create Bundle
//           </Button>
//         </div>
//       </div>

//       <BundleTable
//         data={localData}
//         meta={meta}
//         loading={isLoading}
//         handleDelete={handleDelete}
//         handleEdit={handleEdit}
//         onPageChange={setPage}
//         onLimitChange={(l) => {
//           setLimit(l);
//           setPage(1);
//         }}
//         onSearch={(val) => {
//           setSearch(val);
//           setPage(1);
//         }}
//         search={search}
//         limit={limit}
//         page={page}
//         status={status}
//         onStatusChange={(val) => {
//           setStatus(val);
//           setPage(1);
//         }}
//         date={date}
//         onDateChange={(val) => {
//           setDate(val);
//           setPage(1);
//         }}
//         onResetFilters={() => {
//           setStatus('');
//           setDate(undefined);
//           setSearch('');
//           setPage(1);
//         }}
//       />

//       {openModal.value && (
//         <BundleModal
//           open={openModal.value}
//           onClose={openModal.onFalse}
//           isEdit={editModal.value}
//           selectedData={selectedRecord}
//           companyId={companyId}
//           organizationId={organizationId}
//         />
//       )}

//       <ConfirmDialog
//         open={deleteModal.value}
//         title="Delete Bundle"
//         content="Are you sure you want to delete this bundle?"
//         onClose={() => {
//           deleteModal.onFalse();
//           setSelectedId(null);
//         }}
//         onConfirm={onDelete}
//         isLoading={deleteLoading}
//       />
//     </div>
//   );
// };

// export default BundlesView;
