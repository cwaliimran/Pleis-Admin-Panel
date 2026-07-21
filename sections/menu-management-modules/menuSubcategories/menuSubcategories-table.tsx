'use client';

import { CustomDndProvider } from '@/components/providers/DndProvider';
import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Info, Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MenuSubcategoryTableRow from './menuSubcategories-table-row';
import { CategoryOption, SamplePageProps } from './types';

const HEAD_LABEL = [
  { id: 'drag', label: '', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'items', label: 'Items', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'center' },
];

const MenuSubcategoryTable: FC<SamplePageProps & { categories: CategoryOption[] }> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  handleReorder,
  reorderDisabled,
  onPageChange,
  limit = 10,
  categories,
  search = '',
  onSearch = () => {},
  status = '',
  onStatusChange = () => {},
  categoryId = '',
  onCategoryChange = () => {},
  onResetFilters = () => {},
}) => {
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

  const methods = useForm({
    defaultValues: {
      location: sheetLocation,
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    handleReorder?.(active.id as string, over.id as string);
  };

  const rowIds = data.map((item) => item._id);

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Item Category List</h3>

            {/* FILTER SHEET */}
            <Sheet>
              <SheetTrigger asChild>
                <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
                  <Settings2 className="h-5 w-5" />
                  <span className="whitespace-nowrap">Filter</span>
                </Badge>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary p-0">
                <SheetHeader className="mb-2 border-b pb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FormProvider {...methods}>
                  <form className="flex flex-col gap-6 px-4 py-2">
                    <TableFilters
                      className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                      searchFilter={{
                        placeholder: 'Search name...',
                        value: search,
                        onChange: onSearch,
                      }}
                      selectFilters={[
                        {
                          id: 'subcategory-status',
                          label: 'Status',
                          placeholder: 'Select by Status',
                          value: status,
                          onChange: onStatusChange,
                          options: [
                            { value: 'all', label: 'All' },
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                          ],
                        },
                        {
                          id: 'subcategory-category',
                          label: 'Category',
                          placeholder: 'All categories',
                          value: categoryId,
                          onChange: onCategoryChange,
                          options: [
                            { value: 'all', label: 'All categories' },
                            ...categories.map((category) => ({ value: category._id, label: category.code })),
                          ],
                        },
                      ]}
                      resetFilter={{
                        onReset: onResetFilters,
                        showResetButton: true,
                      }}
                      filtersAlignment="left"
                    />
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          {reorderDisabled && (
            <div className="text-muted-foreground mt-3 flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Clear search and filters, and view a single page, to drag-and-drop reorder subcategories.
            </div>
          )}

          <div className="mt-3 min-h-[45vh] rounded-lg border">
            <CustomDndProvider onDragEnd={handleDragEnd}>
              <Table className="w-full rounded-md border">
                <TableHeadCustom headLabel={HEAD_LABEL} />

                <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                  <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={data?.length || 0}>
                    {data?.map((item, idx) => (
                      <MenuSubcategoryTableRow
                        key={item?._id || idx}
                        item={item}
                        categories={categories}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        dragDisabled={reorderDisabled}
                      />
                    ))}
                  </TableBodyWrapper>
                </SortableContext>
              </Table>
            </CustomDndProvider>
          </div>

          <PaginationControls
            limit={limit}
            totalPages={totalPages}
            currentPage={currentPage}
            totalRecords={totalRecords}
            onPageChange={(p) => onPageChange?.(p)}
          />
        </Card>
      </div>
    </div>
  );
};

export default MenuSubcategoryTable;
