'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getNextDaypartCode, mockDaypartData } from './data';
import DaypartModal from './daypart-modal';
import DaypartTable from './daypart-table';
import { DaypartFormValues, DaypartRecord } from './types';

let nextDaypartId = mockDaypartData.length + 1;

const DaypartView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [dayparts, setDayparts] = useState<DaypartRecord[]>(mockDaypartData);

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
  const [selectedRecord, setSelectedRecord] = useState<DaypartRecord | null>(null);

  const filteredSortedDayparts = useMemo(() => {
    let result = [...dayparts];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(term));
    }

    if (status && status !== 'all') {
      result = result.filter((item) => item.status === status);
    }

    if (date) {
      const target = formatDate(date);
      result = result.filter((item) => item.createdAt === target);
    }

    if (sortBy && sortOrder) {
      const direction = sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (sortBy === 'code') return a.code.localeCompare(b.code) * direction;
        if (sortBy === 'name') return a.name.localeCompare(b.name) * direction;
        return 0;
      });
    }

    return result;
  }, [dayparts, search, status, date, sortBy, sortOrder]);

  const totalRecords = filteredSortedDayparts.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedDayparts = filteredSortedDayparts.slice((page - 1) * limit, page * limit);

  const meta = {
    currentPage: page,
    totalPages,
    totalRecords,
    limit,
  };

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const selectedData = dayparts.find((item) => item._id === id) || null;
    setSelectedId(id);
    setSelectedRecord(selectedData);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    setDayparts((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Daypart deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onDaypartSubmit = (values: DaypartFormValues) => {
    if (editModal.value && selectedId) {
      setDayparts((prev) =>
        prev.map((item) =>
          item._id === selectedId
            ? {
                ...item,
                name: values.name,
                startTime: values.startTime,
                endTime: values.endTime,
                isAllDay: values.isAllDay,
                status: values.status,
              }
            : item
        )
      );
      showSuccess('Daypart updated successfully');
    } else {
      const newDaypart: DaypartRecord = {
        _id: `daypart-${nextDaypartId++}`,
        code: getNextDaypartCode(dayparts),
        name: values.name,
        startTime: values.startTime,
        endTime: values.endTime,
        isAllDay: values.isAllDay,
        status: values.status,
        createdAt: formatDate(new Date())!,
      };
      setDayparts((prev) => [...prev, newDaypart]);
      showSuccess('Daypart created successfully');
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Daypart
          </Button>
        </div>
      </div>

      <DaypartTable
        data={paginatedDayparts}
        meta={meta}
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
        <DaypartModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          nextCode={getNextDaypartCode(dayparts)}
          onSubmit={onDaypartSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Daypart"
        content="Are you sure you want to delete this daypart?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default DaypartView;
