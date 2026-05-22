'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteVenueMutation, useGetVenuesQuery, useUpdateVenueMutation } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import VenueTypeModalV2 from './venueTypeModal';
import VenueTypeTable from './venueTypeTable';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';

const VenueView = () => {
  const openModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteVenue, { isLoading: deleteVenueLoading }] = useDeleteVenueMutation();
  const [updateVenue, { isLoading: updateVenueLoading }] = useUpdateVenueMutation();
  const [updatingPrimaryId, setUpdatingPrimaryId] = useState<string | null>(null);

  const handlePinned = async (item: any) => {
    setUpdatingPrimaryId(item._id);
    try {
      const response = await updateVenue({ id: item._id, isPrimary: !item.isPrimary }).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
      } else {
        showSuccess(response?.message || 'Venue updated successfully');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setUpdatingPrimaryId(null);
    }
  };

  const { organizationId } = useCompanySelectionState();
  const { organizerOrganizationIds } = useCompanySelection();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetVenuesQuery({
    page: page - 1,
    search,
    limit,
    organization: organizerOrganizationIds || undefined,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    organizationId, // Refreshing purpose
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  });

  // Local state for venue types and meta
  const [venueTypes, setVenueTypes] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setVenueTypes(apiData.data);
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

  const handleCreateNew = () => {
    setSelectedVenueType(null);
    setSelectedId(null);
    setIsEditMode(false);
    openModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const venueTypeToEdit = venueTypes?.find((item: any) => item?._id === id);

    if (venueTypeToEdit) {
      setSelectedVenueType(venueTypeToEdit);
      setSelectedId(id);
      setIsEditMode(true);
      openModal.onTrue();
    } else {
      showError('Venue not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  const handleModalClose = () => {
    setSelectedVenueType(null);
    setSelectedId(null);
    setIsEditMode(false);
    openModal.onFalse();
  };

  // DELETE VENUE
  const onDelete = async () => {
    try {
      const response = await deleteVenue(selectedId).unwrap();

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Venue deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus className="" />
            Create Venue
          </Button>
        </div>
      </div>

      <VenueTypeTable
        data={venueTypes}
        meta={meta}
        loading={isLoading || isFetching}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handlePinned={handlePinned}
        updatingPrimaryId={updatingPrimaryId}
        updateVenueLoading={updateVenueLoading}
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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setSortBy('');
          setSortOrder('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <VenueTypeModalV2
          open={openModal.value}
          onClose={handleModalClose}
          isEditMode={isEditMode}
          selectedVenueData={selectedVenueType}
          selectedId={selectedId}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Venue"
        content="Are you sure you want to delete this venue?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteVenueLoading}
      />
    </div>
  );
};

export default VenueView;
