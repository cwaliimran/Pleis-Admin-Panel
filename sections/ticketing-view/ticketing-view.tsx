'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TicketingModal from './ticketing-modal';
import TicketingTable from './ticketing-table';
import { useDeleteTicketingMutation, useGetTicketingQuery } from '@/store/Reducer/ticketing-api';

const defaultValues = {
  title: '',
  status: 'active',
};

const TicketingView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<any>(null);

  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || 'null');

  const [deleteTicketing, { isLoading: deleteTicketingLoading }] = useDeleteTicketingMutation();

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetTicketingQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? undefined : status,
    date: date ? formatDate(date) : undefined,
  });

  // console.log('apiData', apiData?.data || []);

  const [venueTypes, setVenueTypes] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      // setVenueTypes(apiData.data);
      // setMeta(
      //   apiData.meta || {
      //     currentPage: page,
      //     totalPages: 1,
      //     totalRecords: 0,
      //     limit,
      //   }
      // );
      setVenueTypes([...apiData.data]);
      setMeta({ ...apiData.meta });
    }
  }, [apiData, page, limit]);

  const schema = Yup.object().shape({
    title: Yup.string().required('Tag Name is required'),
    status: Yup.string().oneOf(['active', 'inactive']),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const CloseModal = () => {
    methods.reset(defaultValues);
    setSelectedVenueType(null);
    setSelectedId(null);
    openModal.onFalse();
    editModal.onFalse();
  };

  const handleEdit = (id: string) => {
    console.log('id', id);
    openModal.onTrue();
    editModal.onTrue();
  };

  // const handleEdit = (id: string) => {
  //   const venueTypeToEdit = venueTypes?.find((item: any) => item._id === id);
  //   if (venueTypeToEdit) {
  //     setSelectedVenueType(venueTypeToEdit);
  //     setSelectedId(id);
  //     editModal.onTrue();
  //     openModal.onTrue();
  //   } else {
  //     showError('Tag not found');
  //   }
  // };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // DELETE API CALL
  const onDelete = async () => {
    try {
      const response = await deleteTicketing(selectedId).unwrap();

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Tag deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
      refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete tag:', errorMessage);
      showError(errorMessage);
    }
  };

  const handleCreateNew = () => {
    setSelectedVenueType(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Ticket
          </Button>
        </div>
      </div>

      <TicketingTable
        data={venueTypes}
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

      <TicketingModal open={openModal.value} onClose={CloseModal} editMode={editModal.value} selectedData={selectedVenueType} />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Ticket"
        content="Are you sure you want to delete this ticket?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteTicketingLoading}
      />
    </div>
  );
};

export default TicketingView;
