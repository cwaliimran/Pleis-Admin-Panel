'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getNextAllergenCode, mockAllergensData } from './data';
import AllergenModal from './allergens-modal';
import AllergenTable from './allergens-table';
import { AllergenFormValues, AllergenRecord } from './types';

let nextAllergenId = mockAllergensData.length + 1;

const AllergensView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [allergens, setAllergens] = useState<AllergenRecord[]>(mockAllergensData);

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
  const [selectedRecord, setSelectedRecord] = useState<AllergenRecord | null>(null);

  const filteredSortedAllergens = useMemo(() => {
    let result = [...allergens];

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
  }, [allergens, search, status, date, sortBy, sortOrder]);

  const totalRecords = filteredSortedAllergens.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedAllergens = filteredSortedAllergens.slice((page - 1) * limit, page * limit);

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
    const selectedData = allergens.find((item) => item._id === id) || null;
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
    setAllergens((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Allergen deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onAllergenSubmit = (values: AllergenFormValues) => {
    if (editModal.value && selectedId) {
      setAllergens((prev) => prev.map((item) => (item._id === selectedId ? { ...item, ...values } : item)));
      showSuccess('Allergen updated successfully');
    } else {
      const newAllergen: AllergenRecord = {
        _id: `allergen-${nextAllergenId++}`,
        code: getNextAllergenCode(allergens),
        name: values.name,
        status: values.status,
        createdAt: formatDate(new Date())!,
      };
      setAllergens((prev) => [...prev, newAllergen]);
      showSuccess('Allergen created successfully');
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Allergen
          </Button>
        </div>
      </div>

      <AllergenTable
        data={paginatedAllergens}
        meta={meta}
        totalCount={allergens.length}
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
        <AllergenModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          nextCode={getNextAllergenCode(allergens)}
          onSubmit={onAllergenSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Allergen"
        content="Are you sure you want to delete this allergen?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default AllergensView;
