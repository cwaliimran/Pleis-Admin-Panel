'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetStreaksQuery, useGetUserStreaksQuery } from '@/store/Reducer/streaks-api';
import { useDeleteVenueMutation } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import NoStreak from './no-streak';
import StreakRuleCard from './streak-rule-card';
import StreakSkelton from './streak-skelton';
import StreaksModal from './streaks-modal';
import StreaksTable from './streaks-table';

interface StreaksViewProps {
  global?: boolean;
  userType?: 'organizer' | 'super-admin';
}

const StreaksView = ({ global, userType }: StreaksViewProps) => {
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
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { companyId: selectedCompany } = useCompanySelectionState();

  const [deleteVenue, { isLoading: deleteLoading }] = useDeleteVenueMutation();

  // FETCH STREAK RULES --------------------------
  const {
    data: streakRuleData,
    isLoading: streakRuleLoading,
    isFetching: streakRuleFetching,
  } = useGetStreaksQuery(
    {
      page: page - 1,
      search: '',
      limit,
      status: status === 'all' ? '' : status,
      companyOrganizer: selectedCompany || undefined,
    },
    {
      skip: global === true,
    }
  );

  // FETCH USER STREAKS --------------------------
  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetUserStreaksQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: selectedCompany || undefined,
    isGlobal: global,
  });

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

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  // ------------ EDIT FUNCTION FOR STATIC ------------
  const handleEdit = (id: string) => {
    console.log('id', id);
    openModal.onTrue();
    editModal.onTrue();
  };

  // ------------ EDIT FUNCTION FOR API VERSION ------------
  // const handleEdit = (id: string) => {
  //   const selectedData = localData?.find((item: any) => item?._id === id);

  //   if (selectedData) {
  //     setSelectedId(id);
  //     setSelectedRecord(selectedData);
  //     editModal.onTrue();
  //     openModal.onTrue();
  //   } else {
  //     showError('Reward not found');
  //   }
  // };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No promotion selected');
        return;
      }

      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  // DELETE CALL
  const onDelete = async () => {
    try {
      const response = await deleteVenue(selectedId).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      {!global && (
        <>
          <div>
            <div className="mt-3 flex w-full items-center justify-end md:mt-0">
              <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
                <Plus />
                Create Streaks Rule
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 rounded-md md:grid-cols-2">
            {streakRuleLoading || streakRuleFetching ? (
              <StreakSkelton />
            ) : streakRuleData?.data && streakRuleData.data.length > 0 ? (
              <>
                {streakRuleData?.data.map((data: any, idx: number) => (
                  <StreakRuleCard key={idx} visits={data?.visits} points={data?.points} global={global} />
                ))}
              </>
            ) : (
              <NoStreak handleCreateNew={handleCreateNew} />
            )}
          </div>
        </>
      )}

      <StreaksTable
        data={localData}
        meta={meta}
        global={global}
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

      {openModal.value && (
        <StreaksModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          selectedCompany={selectedCompany}
          userType={userType}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Streak"
        content="Are you sure you want to delete this streak?"
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

export default StreaksView;
