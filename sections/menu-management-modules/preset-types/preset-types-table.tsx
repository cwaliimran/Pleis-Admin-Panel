'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PresetTypeTableRow from './preset-types-table-row';
import { PresetCategoryOption, PresetSubcategoryOption, PresetTypeNameOption, SamplePageProps } from './types';

const HEAD_LABEL = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'subcategory', label: 'Subcategory', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'center' },
];

const PresetTypeTable: FC<
  SamplePageProps & { categories: PresetCategoryOption[]; subcategories: PresetSubcategoryOption[]; typeNames: PresetTypeNameOption[] }
> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  limit = 10,
  categories,
  subcategories,
  typeNames,
  search = '',
  onSearch = () => {},
  status = '',
  onStatusChange = () => {},
  categoryId = '',
  onCategoryChange = () => {},
  subcategoryId = '',
  onSubcategoryChange = () => {},
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

  const visibleSubcategories = categoryId ? subcategories.filter((subcategory) => subcategory.categoryId === categoryId) : subcategories;

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Preset Type List</h3>

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
                        placeholder: 'Search type name or code...',
                        value: search,
                        onChange: onSearch,
                      }}
                      selectFilters={[
                        {
                          id: 'preset-type-status',
                          label: 'Select by Status',
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
                          id: 'preset-type-category',
                          label: 'Category',
                          placeholder: 'All categories',
                          value: categoryId,
                          onChange: onCategoryChange,
                          options: [
                            { value: 'all', label: 'All categories' },
                            ...categories.map((category) => ({ value: category._id, label: category.code })),
                          ],
                        },
                        {
                          id: 'preset-type-subcategory',
                          label: 'Subcategory',
                          placeholder: 'All subcategories',
                          value: subcategoryId,
                          onChange: onSubcategoryChange,
                          options: [
                            { value: 'all', label: 'All subcategories' },
                            ...visibleSubcategories.map((subcategory) => ({ value: subcategory._id, label: subcategory.title })),
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

          <div className="mt-3 min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={HEAD_LABEL} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={data?.length || 0}>
                {data?.map((item, idx) => (
                  <PresetTypeTableRow
                    key={item?._id || idx}
                    item={item}
                    categories={categories}
                    subcategories={subcategories}
                    typeNames={typeNames}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
                ))}
              </TableBodyWrapper>
            </Table>
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

export default PresetTypeTable;
