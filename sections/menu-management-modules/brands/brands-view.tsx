'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockBrandsData } from './data';
import BrandModal from './brands-modal';
import BrandTable from './brands-table';
import { BrandFormValues, BrandRecord } from './types';

let nextBrandId = mockBrandsData.length + 1;

const BrandsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [brands, setBrands] = useState<BrandRecord[]>(mockBrandsData);

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
  const [selectedRecord, setSelectedRecord] = useState<BrandRecord | null>(null);

  const filteredSortedBrands = useMemo(() => {
    let result = [...brands];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(term) || item.principal.toLowerCase().includes(term));
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
        if (sortBy === 'name') return a.name.localeCompare(b.name) * direction;
        if (sortBy === 'principal') return a.principal.localeCompare(b.principal) * direction;
        return 0;
      });
    }

    return result;
  }, [brands, search, status, date, sortBy, sortOrder]);

  const totalRecords = filteredSortedBrands.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedBrands = filteredSortedBrands.slice((page - 1) * limit, page * limit);

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
    const selectedData = brands.find((item) => item._id === id) || null;
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
    setBrands((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Brand deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onBrandSubmit = (values: BrandFormValues) => {
    if (editModal.value && selectedId) {
      setBrands((prev) => prev.map((item) => (item._id === selectedId ? { ...item, ...values } : item)));
      showSuccess('Brand updated successfully');
    } else {
      const newBrand: BrandRecord = {
        _id: `brand-${nextBrandId++}`,
        name: values.name,
        principal: values.principal,
        status: values.status,
        createdAt: formatDate(new Date())!,
      };
      setBrands((prev) => [newBrand, ...prev]);
      showSuccess('Brand created successfully');
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Brand
          </Button>
        </div>
      </div>

      <BrandTable
        data={paginatedBrands}
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
        <BrandModal open={openModal.value} onClose={openModal.onFalse} isEdit={editModal.value} selectedData={selectedRecord} onSubmit={onBrandSubmit} />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Brand"
        content="Are you sure you want to delete this brand?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default BrandsView;
