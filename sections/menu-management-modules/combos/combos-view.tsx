'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useDeleteComboMutation, useGetCombosQuery } from '@/store/Reducer/combos-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import ComboModal from './combos-modal';
import ComboTable from './combos-table';
import { ComboRecord } from './types';

type ComboViewProps = {
  userType: 'super-admin' | 'organizer';
};

const ComboView = ({ userType }: ComboViewProps) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const { companyId } = useCompanySelectionState();
  // Organizer requests are scoped to the logged-in organizer's own company server-side;
  // only super-admin needs the header's selected company sent explicitly.
  const scopedCompanyId = userType === 'super-admin' ? companyId : undefined;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ComboRecord | null>(null);

  const { data, isLoading, isFetching } = useGetCombosQuery(
    {
      page: page - 1,
      limit,
      search,
      status: !status || status === 'all' ? undefined : status,
      companyOrganizer: scopedCompanyId,
      sortBy,
      sortOrder,
    },
    { skip: userType === 'super-admin' && !companyId }
  );

  const [deleteCombo, { isLoading: deleteLoading }] = useDeleteComboMutation();

  const combos: ComboRecord[] = data?.data || [];
  const meta = data?.meta || { currentPage: page, totalPages: 1, totalRecords: 0, limit };

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const selectedData = combos.find((item) => item._id === id) || null;
    setSelectedId(id);
    setSelectedRecord(selectedData);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  const onDelete = async () => {
    try {
      await deleteCombo(selectedId).unwrap();
      showSuccess('Combo deleted successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Combos</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            A combo bundles existing menu items at a combined price. Items stay standalone; the combo appears in every menu that contains all of them.
          </p>
        </div>

        <div className="mt-3 flex w-full shrink-0 items-center justify-end gap-x-3 md:mt-0 md:w-auto">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Combo
          </Button>
        </div>
      </div>

      <ComboTable
        data={combos}
        meta={meta}
        loading={isLoading || isFetching}
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
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={() => {
          setStatus('');
          setSearch('');
          setSortBy('');
          setSortOrder('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <ComboModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          companyId={scopedCompanyId}
          userType={userType}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Combo"
        content="Are you sure you want to delete this combo?"
        isLoading={deleteLoading}
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default ComboView;
