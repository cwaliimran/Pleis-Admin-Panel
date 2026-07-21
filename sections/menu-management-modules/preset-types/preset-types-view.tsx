'use client';

import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getNextPresetTypeCode, mockPresetCategories, mockPresetSubcategories, mockPresetTypeNames, mockPresetTypeRecords } from './data';
import PresetTypeModal from './preset-types-modal';
import PresetTypeTable from './preset-types-table';
import { PresetTypeFormValues, PresetTypeRecord } from './types';

let nextPresetTypeId = mockPresetTypeRecords.length + 1;

const PresetTypesView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [presetTypes, setPresetTypes] = useState<PresetTypeRecord[]>(mockPresetTypeRecords);

  const categories = mockPresetCategories;
  const subcategories = mockPresetSubcategories;
  const typeNames = mockPresetTypeNames;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PresetTypeRecord | null>(null);

  const filteredPresetTypes = useMemo(() => {
    let result = [...presetTypes];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => {
        const typeName = typeNames.find((type) => type._id === item.typeNameId)?.title || '';
        return item.code.toLowerCase().includes(term) || typeName.toLowerCase().includes(term) || (item.name || '').toLowerCase().includes(term);
      });
    }

    if (status && status !== 'all') {
      result = result.filter((item) => item.status === status);
    }

    if (categoryId && categoryId !== 'all') {
      result = result.filter((item) => item.categoryId === categoryId);
    }

    if (subcategoryId && subcategoryId !== 'all') {
      result = result.filter((item) => item.subcategoryId === subcategoryId);
    }

    return result;
  }, [presetTypes, search, status, categoryId, subcategoryId, typeNames]);

  const totalRecords = filteredPresetTypes.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedPresetTypes = filteredPresetTypes.slice((page - 1) * limit, page * limit);

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
    const selectedData = presetTypes.find((item) => item._id === id) || null;
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
    setPresetTypes((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Preset type deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onPresetTypeSubmit = (values: PresetTypeFormValues) => {
    if (editModal.value && selectedId) {
      setPresetTypes((prev) =>
        prev.map((item) =>
          item._id === selectedId
            ? {
                ...item,
                categoryId: values.categoryId,
                subcategoryId: values.subcategoryId,
                typeNameId: values.typeNameId,
                name: values.name || undefined,
                description: values.description || undefined,
                examples: values.examples || undefined,
                status: values.status,
              }
            : item
        )
      );
      showSuccess('Preset type updated successfully');
    } else {
      const newPresetType: PresetTypeRecord = {
        _id: `preset-new-${nextPresetTypeId++}`,
        code: getNextPresetTypeCode(presetTypes, values.categoryId),
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        typeNameId: values.typeNameId,
        name: values.name || undefined,
        description: values.description || undefined,
        examples: values.examples || undefined,
        status: values.status,
        createdAt: formatDate(new Date())!,
      };
      setPresetTypes((prev) => [...prev, newPresetType]);
      showSuccess('Preset type created successfully');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Preset Types</h2>
          <p className="text-muted-foreground text-sm">Pleis-defined item taxonomy. Used to classify menu items across all venues.</p>
        </div>

        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Preset Type
        </Button>
      </div>

      <PresetTypeTable
        data={paginatedPresetTypes}
        meta={meta}
        categories={categories}
        subcategories={subcategories}
        typeNames={typeNames}
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
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setSubcategoryId('');
          setPage(1);
        }}
        subcategoryId={subcategoryId}
        onSubcategoryChange={(val) => {
          setSubcategoryId(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setCategoryId('');
          setSubcategoryId('');
          setSearch('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <PresetTypeModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          categories={categories}
          subcategories={subcategories}
          typeNames={typeNames}
          onSubmit={onPresetTypeSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Preset Type"
        content="Are you sure you want to delete this preset type?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default PresetTypesView;
