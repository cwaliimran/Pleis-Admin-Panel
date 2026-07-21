'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getNextDietTagCode, mockDietTagsData } from './data';
import DietTagModal from './diet-tags-modal';
import DietTagTable from './diet-tags-table';
import { DietTagFormValues, DietTagRecord } from './types';

let nextDietTagId = mockDietTagsData.length + 1;

const DietTagsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [dietTags, setDietTags] = useState<DietTagRecord[]>(mockDietTagsData);

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
  const [selectedRecord, setSelectedRecord] = useState<DietTagRecord | null>(null);

  const filteredSortedDietTags = useMemo(() => {
    let result = [...dietTags];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.tag.toLowerCase().includes(term) || item.description.toLowerCase().includes(term));
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
        if (sortBy === 'tag') return a.tag.localeCompare(b.tag) * direction;
        return 0;
      });
    }

    return result;
  }, [dietTags, search, status, date, sortBy, sortOrder]);

  const totalRecords = filteredSortedDietTags.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedDietTags = filteredSortedDietTags.slice((page - 1) * limit, page * limit);

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
    const selectedData = dietTags.find((item) => item._id === id) || null;
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
    setDietTags((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Diet tag deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onDietTagSubmit = (values: DietTagFormValues) => {
    if (editModal.value && selectedId) {
      setDietTags((prev) => prev.map((item) => (item._id === selectedId ? { ...item, ...values } : item)));
      showSuccess('Diet tag updated successfully');
    } else {
      const newDietTag: DietTagRecord = {
        _id: `diet-${nextDietTagId++}`,
        code: getNextDietTagCode(dietTags),
        tag: values.tag,
        description: values.description,
        status: values.status,
        createdAt: formatDate(new Date())!,
      };
      setDietTags((prev) => [...prev, newDietTag]);
      showSuccess('Diet tag created successfully');
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Diet Tag
          </Button>
        </div>
      </div>

      <DietTagTable
        data={paginatedDietTags}
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
        <DietTagModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          nextCode={getNextDietTagCode(dietTags)}
          onSubmit={onDietTagSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Diet Tag"
        content="Are you sure you want to delete this diet tag?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default DietTagsView;
