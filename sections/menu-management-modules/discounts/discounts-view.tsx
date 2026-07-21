'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockDiscountsData } from './data';
import DiscountModal from './discounts-modal';
import DiscountTable from './discounts-table';
import { DiscountFormValues, DiscountRecord } from './types';

let nextDiscountId = mockDiscountsData.length + 1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- userType kept for the route contract; will scope mock data once the v2 API lands
const DiscountsView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(mockDiscountsData);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiscountRecord | null>(null);

  const filteredSortedDiscounts = useMemo(() => {
    let result = [...discounts];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.title.toLowerCase().includes(term));
    }

    if (status && status !== 'all') {
      result = result.filter((item) => item.status === status);
    }

    if (type && type !== 'all') {
      result = result.filter((item) => item.type === type);
    }

    if (startDate) {
      const target = formatDate(startDate);
      result = result.filter((item) => item.startDate.startsWith(target!));
    }

    if (endDate) {
      const target = formatDate(endDate);
      result = result.filter((item) => item.endDate.startsWith(target!));
    }

    if (sortBy && sortOrder) {
      const direction = sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title) * direction;
          case 'startDate':
            return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * direction;
          case 'endDate':
            return (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * direction;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [discounts, search, status, type, startDate, endDate, sortBy, sortOrder]);

  const totalRecords = filteredSortedDiscounts.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedDiscounts = filteredSortedDiscounts.slice((page - 1) * limit, page * limit);

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
    const selectedData = discounts.find((item) => item._id === id) || null;
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
    setDiscounts((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Discount deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onDiscountSubmit = (values: DiscountFormValues) => {
    const startDateTime = `${formatDate(values.startDateDate)}T${values.startTime}`;
    const endDateTime = `${formatDate(values.endDateDate)}T${values.endTime}`;

    if (editModal.value && selectedId) {
      setDiscounts((prev) =>
        prev.map((item) =>
          item._id === selectedId
            ? {
                ...item,
                title: values.title,
                description: values.description || undefined,
                type: values.type,
                value: Number(values.value),
                itemIds: values.itemIds,
                startDate: startDateTime,
                endDate: endDateTime,
              }
            : item
        )
      );
      showSuccess('Discount updated successfully');
    } else {
      const newDiscount: DiscountRecord = {
        _id: `discount-${nextDiscountId++}`,
        title: values.title,
        description: values.description || undefined,
        type: values.type,
        value: Number(values.value),
        itemIds: values.itemIds,
        startDate: startDateTime,
        endDate: endDateTime,
        status: 'active',
        createdAt: formatDate(new Date())!,
      };
      setDiscounts((prev) => [newDiscount, ...prev]);
      showSuccess('Discount created successfully');
    }
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Discount
          </Button>
        </div>
      </div>

      <DiscountTable
        data={paginatedDiscounts}
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
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={() => {
          setStatus('');
          setType('');
          setStartDate(undefined);
          setEndDate(undefined);
          setSearch('');
          setSortBy('');
          setSortOrder('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <DiscountModal open={openModal.value} onClose={openModal.onFalse} isEdit={editModal.value} selectedData={selectedRecord} onSubmit={onDiscountSubmit} />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Discount"
        content="Are you sure you want to delete this discount?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default DiscountsView;
