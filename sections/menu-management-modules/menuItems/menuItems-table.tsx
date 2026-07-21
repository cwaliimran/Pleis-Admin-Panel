'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MenuItemTableRow from './menuItems-table-row';
import { CategoryOption, MenuItemRecord, MenuOption, PresetTypeOption, SamplePageProps, SubcategoryOption } from './types';

const HEAD_LABEL = [
  { id: 'photo', label: 'Photo', align: 'left' },
  {
    id: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    sortKey: 'menuItemName',
  },
  {
    id: 'menu',
    label: 'Menu',
    align: 'left',
    sortable: true,
    sortKey: 'menuName',
  },
  {
    id: 'subcategory',
    label: 'Subcategory',
    align: 'left',
    sortable: true,
    sortKey: 'subcategory',
  },
  {
    id: 'type',
    label: 'Type',
    align: 'left',
    sortable: true,
    sortKey: 'type',
  },
  {
    id: 'serving',
    label: 'Serving',
    align: 'left',
    sortable: true,
    sortKey: 'serving',
  },
  {
    id: 'price',
    label: 'Price (€)',
    align: 'left',
    sortable: true,
    sortKey: 'price',
  },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'center' },
];

const MenuItemTable: FC<
  SamplePageProps & {
    menus: MenuOption[];
    categories: CategoryOption[];
    subcategories: SubcategoryOption[];
    presetTypes: PresetTypeOption[];
    allItems: MenuItemRecord[];
  }
> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  limit = 10,
  menus,
  categories,
  subcategories,
  presetTypes,
  allItems,
  // filters states bellow
  search = '',
  onSearch = () => {},
  status = '',
  onStatusChange = () => {},
  date,
  onDateChange = () => {},
  menuId = '',
  onMenuChange = () => {},
  categoryId = '',
  onCategoryChange = () => {},
  subcategoryId = '',
  onSubcategoryChange = () => {},
  onResetFilters = () => {},
  sortBy = '',
  sortOrder = '',
  onSortChange,
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : null,
  };

  const handleSort = (key: string) => {
    if (sortBy !== key) {
      onSortChange?.(key, 'asc');
    } else if (sortOrder === 'asc') {
      onSortChange?.(key, 'desc');
    } else if (sortOrder === 'desc') {
      onSortChange?.('', '');
    } else {
      onSortChange?.(key, 'asc');
    }
  };

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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Menu Items List</h3>

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
                    {/* Date Range Filters full width */}
                    <div className="flex w-full flex-col gap-3">
                      <div className="flex w-full flex-col gap-3">
                        <label htmlFor="sheet-event-start-date" className="px-1 text-sm font-medium">
                          Select Date
                        </label>
                        <div className="w-full">
                          <TableFilters
                            className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                            dateFilter={{
                              id: 'menu-item-date',
                              placeholder: 'Select date',
                              value: date,
                              onChange: onDateChange,
                            }}
                            searchFilter={{
                              placeholder: 'Search name...',
                              value: search,
                              onChange: onSearch,
                            }}
                            selectFilters={[
                              {
                                id: 'menu-item-status',
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
                                id: 'menu-item-menu',
                                label: 'Select Menu',
                                placeholder: 'All menus',
                                value: menuId,
                                onChange: onMenuChange,
                                options: [
                                  { value: 'all', label: 'All menus' },
                                  ...menus.map((menu) => ({ value: menu._id, label: menu.title })),
                                ],
                              },
                              {
                                id: 'menu-item-category',
                                label: 'Category',
                                placeholder: 'All categories',
                                value: categoryId,
                                onChange: onCategoryChange,
                                options: [
                                  { value: 'all', label: 'All categories' },
                                  ...categories.map((category) => ({ value: category._id, label: category.title })),
                                ],
                              },
                              {
                                id: 'menu-item-subcategory',
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
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={HEAD_LABEL} onSort={handleSort} sortConfig={sortConfig} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={data?.length || 0}>
                {data?.map((item, idx) => (
                  <MenuItemTableRow
                    key={item?._id || idx}
                    item={item}
                    menus={menus}
                    subcategories={subcategories}
                    presetTypes={presetTypes}
                    allItems={allItems}
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

export default MenuItemTable;
