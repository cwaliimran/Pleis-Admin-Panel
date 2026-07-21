'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getNextServingCode, mockServingData } from './data';
import ServingModal from './serving-modal';
import ServingTable from './serving-table';
import { ServingFormValues, ServingRecord } from './types';

let nextServingId = mockServingData.length + 1;

const ServingView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [servings, setServings] = useState<ServingRecord[]>(mockServingData);

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
  const [selectedRecord, setSelectedRecord] = useState<ServingRecord | null>(null);

  const filteredSortedServings = useMemo(() => {
    let result = [...servings];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.type.toLowerCase().includes(term) || item.code.toLowerCase().includes(term));
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
        if (sortBy === 'type') return a.type.localeCompare(b.type) * direction;
        return 0;
      });
    }

    return result;
  }, [servings, search, status, date, sortBy, sortOrder]);

  const totalRecords = filteredSortedServings.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedServings = filteredSortedServings.slice((page - 1) * limit, page * limit);

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
    const selectedData = servings.find((item) => item._id === id) || null;
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
    setServings((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Serving deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onServingSubmit = (values: ServingFormValues) => {
    if (editModal.value && selectedId) {
      setServings((prev) =>
        prev.map((item) =>
          item._id === selectedId
            ? { ...item, level2: (values.level2 || null) as ServingRecord['level2'], type: values.type, unit: values.unit || undefined, status: values.status }
            : item
        )
      );
      showSuccess('Serving updated successfully');
    } else {
      const newServing: ServingRecord = {
        _id: `serving-${nextServingId++}`,
        code: getNextServingCode(servings),
        level2: (values.level2 || null) as ServingRecord['level2'],
        type: values.type,
        unit: values.unit || undefined,
        status: values.status,
        createdAt: formatDate(new Date())!,
      };
      setServings((prev) => [...prev, newServing]);
      showSuccess('Serving created successfully');
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Serving
          </Button>
        </div>
      </div>

      <ServingTable
        data={paginatedServings}
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
        <ServingModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          nextCode={getNextServingCode(servings)}
          onSubmit={onServingSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Serving"
        content="Are you sure you want to delete this serving?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default ServingView;
