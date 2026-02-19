'use client';

import { Button } from '@/components/ui/button';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { useGetReservationsQuery } from '@/store/Reducer/reservations-api';
import { formatDate } from '@/utils/format-time';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import ReservationBody from './reservation-body';
import ReservationHeader from './reservation-header';
import ReservationModal from './reservation-modal';
import { ReservationsApiResponse } from './reservation-types';

// ============================================================
// STORAGE HELPERS
// ============================================================

const ORGANIZER_ORG_STORAGE_KEY = 'reservation-organizer-organization';

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

type ReservationViewProps = {
  userType: 'super-admin' | 'organizer';
  event?: any;
};

const ReservationView = ({ userType, event }: ReservationViewProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [range, setRange] = useState('today');
  const [status, setStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { companyId, organizationId: adminOrganizationId } = useCompanySelectionState();

  // When an event is passed in, its org always takes priority — no dropdown needed
  const organizationIdFromEvent = event?.basicInfo?.organization?._id || undefined;
  const isOrganizer = userType === 'organizer';

  // Show dropdown only for organizer users on standalone pages (no event context)
  const showOrgDropdown = isOrganizer && !organizationIdFromEvent;

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
  } = useGetOrganizationsOnOrganizerSideQuery({}, { skip: !showOrgDropdown });

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
    if (!showOrgDropdown || organizerOrganizationOptions.length === 0) return;

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
  }, [showOrgDropdown, organizerOrganizationOptions, selectedOrganizerOrganizationId, setOrganizationValue]);

  // Persist selection to localStorage
  useEffect(() => {
    if (!showOrgDropdown) return;

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
  }, [showOrgDropdown, selectedOrganizerOrganizationId, organizerOrganizationOptions]);

  // Resolve effective organizationId:
  // event org → organizer dropdown → admin global selection
  const organizationId = organizationIdFromEvent || (showOrgDropdown ? selectedOrganizerOrganizationId : adminOrganizationId);

  const isOrganizerOrgLoading = isLoadingOrganizerOrganizations || isFetchingOrganizerOrganizations;
  const companyOrganizer = companyId || undefined;

  // Reset page when organization changes
  useEffect(() => {
    setPage(1);
  }, [organizationId]);

  // ============================================================
  // DATA FETCHING
  // ============================================================

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetReservationsQuery(
    {
      page: page - 1,
      limit,
      range: date ? undefined : range,
      date: date ? formatDate(date) : undefined,
      organizationsId: organizationId || undefined,
      status: status === 'all' ? undefined : status,
    },
    { skip: !organizationId }
  );

  const reservationsData: ReservationsApiResponse['data'] | undefined = apiData?.data;
  const meta: ReservationsApiResponse['meta'] | undefined = apiData?.meta;

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleCreateNew = () => {
    setSelectedData(null);
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setIsEdit(false);
    setSelectedData(null);
  };

  const handleEdit = (reservation: any) => {
    setSelectedData(reservation);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    if (newRange) setDate(undefined);
    setPage(1);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) setRange('');
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* Top Bar: Org Dropdown (left) + Create Reservation (right) */}
      <div className="flex w-full items-center justify-end gap-3 md:mb-5">
        {showOrgDropdown && (
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
          disabled={showOrgDropdown && !organizationId}
        >
          <Plus />
          Create Reservation
        </Button>
      </div>

      {/* Guard: organizer must pick org before seeing content */}
      {showOrgDropdown && !organizationId ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Select an Organization</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Please select an organization from the dropdown above to view reservations</p>
        </div>
      ) : (
        <>
          <ReservationHeader
            date={date}
            onDateChange={handleDateChange}
            range={range}
            onRangeChange={handleRangeChange}
            status={status}
            onStatusChange={handleStatusChange}
          />

          <ReservationBody
            isLoading={isLoading || isFetching}
            data={reservationsData}
            organizationId={organizationId}
            meta={meta}
            onPageChange={handlePageChange}
            limit={limit}
            companyOrganizer={companyOrganizer}
            onLimitChange={(l) => setLimit(l)}
            onEdit={handleEdit}
          />
        </>
      )}

      {openModal && (
        <ReservationModal
          open={openModal}
          onClose={handleClose}
          isEdit={isEdit}
          selectedData={selectedData}
          organizationId={organizationId}
          event={event}
        />
      )}
    </>
  );
};

export default ReservationView;

// 'use client';

// import { Button } from '@/components/ui/button';
// import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
// import { useGetReservationsQuery } from '@/store/Reducer/reservations-api';
// import { formatDate } from '@/utils/format-time';
// import { Plus } from 'lucide-react';
// import React, { useState } from 'react';
// import ReservationBody from './reservation-body';
// import ReservationHeader from './reservation-header';
// import ReservationModal from './reservation-modal';
// import { ReservationsApiResponse } from './reservation-types';

// type ReservationViewProps = {
//   event?: any;
// };

// const ReservationView = ({ event }: ReservationViewProps) => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   const organizationIdFromEvent = event?.basicInfo?.organization?._id || undefined;

//   const [range, setRange] = useState('today');
//   const [status, setStatus] = useState('');
//   const [openModal, setOpenModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [selectedData, setSelectedData] = useState<any>(null);
//   const [date, setDate] = useState<Date | undefined>(undefined);

//   const { companyId, organizationId } = useCompanySelectionState();

//   const companyOrganizer = companyId || undefined;

//   const {
//     data: apiData,
//     isLoading,
//     isFetching,
//   } = useGetReservationsQuery({
//     page: page - 1,
//     limit,
//     range: date ? undefined : range,
//     date: date ? formatDate(date) : undefined,
//     organizationsId: organizationIdFromEvent || organizationId || undefined,
//     status: status === 'all' ? undefined : status,
//     // organizationsId: organizationId || undefined,
//     // companyOrganizer,
//   });

//   const reservationsData: ReservationsApiResponse['data'] | undefined = apiData?.data;
//   const meta: ReservationsApiResponse['meta'] | undefined = apiData?.meta;

//   const handleCreateNew = () => {
//     setSelectedData(null);
//     setIsEdit(false);
//     setOpenModal(true);
//   };

//   const handleClose = () => {
//     setOpenModal(false);
//     setIsEdit(false);
//     setSelectedData(null);
//   };

//   const handleEdit = (reservation: any) => {
//     setSelectedData(reservation);
//     setIsEdit(true);
//     setOpenModal(true);
//   };

//   const handlePageChange = (newPage: number) => setPage(newPage);

//   // Fix: When range changes, clear date
//   const handleRangeChange = (newRange: string) => {
//     setRange(newRange);
//     if (newRange) {
//       setDate(undefined);
//     }
//     setPage(1);
//   };

//   const handleDateChange = (newDate: Date | undefined) => {
//     setDate(newDate);
//     if (newDate) {
//       setRange('');
//     }
//     setPage(1);
//   };

//   const handleStatusChange = (newStatus: string) => {
//     setStatus(newStatus);
//     setPage(1);
//   };

//   return (
//     <>
//       <div className="flex w-full items-center justify-end md:mb-5">
//         <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
//           <Plus />
//           Create Reservation
//         </Button>
//       </div>

//       <ReservationHeader
//         date={date}
//         onDateChange={handleDateChange}
//         range={range}
//         onRangeChange={handleRangeChange}
//         status={status}
//         onStatusChange={handleStatusChange}
//       />

//       <ReservationBody
//         isLoading={isLoading || isFetching}
//         data={reservationsData}
//         // organizationId={organizationId}
//         organizationId={organizationIdFromEvent || organizationId}
//         meta={meta}
//         onPageChange={handlePageChange}
//         limit={limit}
//         companyOrganizer={companyOrganizer}
//         onLimitChange={(l) => setLimit(l)}
//         onEdit={handleEdit}
//       />

//       {openModal && (
//         <ReservationModal
//           open={openModal}
//           onClose={handleClose}
//           isEdit={isEdit}
//           selectedData={selectedData}
//           organizationId={organizationIdFromEvent || organizationId}
//           event={event}
//         />
//       )}
//     </>
//   );
// };

// export default ReservationView;
