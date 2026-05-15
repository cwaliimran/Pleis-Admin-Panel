'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { cn } from '@/lib/utils';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useImportPresetMenuItemsMutation } from '@/store/Reducer/menu-items-api';
import { useGetPresetMenuQuery } from '@/store/Reducer/preset-menu-api';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import { Loader2, Package, Search } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

interface PresetItem {
  _id: string;
  title: string;
  description?: string;
  basePrice: number | string;
  discountPrice?: number | string | null;
  category?: {
    _id: string;
    title: string;
  };
  imageInfo?: {
    url: string;
  };
  image?: string;
  taxPercent?: number | string;
  type?: string;
}

interface PresetImportScreenProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
  companyOrganizer?: string | null;
}

const PresetImportScreen: React.FC<PresetImportScreenProps> = ({ open, onClose, onImportComplete, companyOrganizer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set());
  const [isMenuSelectDialogOpen, setIsMenuSelectDialogOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState('');

  const [importPresetMenuItems, { isLoading: importLoading }] = useImportPresetMenuItemsMutation();

  const { data: presetData, isLoading: presetLoading } = useGetPresetMenuQuery({
    page: 0,
    search: searchQuery,
    limit: '500',
    status: 'active',
    date: undefined,
  });

  const { data: menuListData, isLoading: menuListLoading } = useGetMenuListQuery(
    {
      search: '',
      page: 0,
      status: 'active',
      date: undefined,
      limit: '500',
      companyOrganizer,
      organizations: undefined,
    },
    {
      skip: !open,
    }
  );

  // Helper function to safely convert to number
  const toSafeNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  // Filter and search presets
  const filteredPresets = useMemo(() => {
    if (!presetData?.data) return [];

    return presetData.data.filter((preset: PresetItem) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        preset.title?.toLowerCase().includes(searchLower) ||
        preset.description?.toLowerCase().includes(searchLower) ||
        preset.category?.title?.toLowerCase().includes(searchLower)
      );
    });
  }, [presetData, searchQuery]);

  // Toggle preset selection
  const handleTogglePreset = (presetId: string) => {
    setSelectedPresets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(presetId)) {
        newSet.delete(presetId);
      } else {
        newSet.add(presetId);
      }
      return newSet;
    });
  };

  // Get image URL with fallback
  const getImageUrl = (preset: PresetItem): string | null => {
    const img = preset?.imageInfo?.url || preset?.image;
    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
      return null;
    }
    return img;
  };

  const menuOptions = useMemo(() => {
    const rawMenus = menuListData?.data || [];
    return rawMenus.map((menu: any) => ({
      value: menu?._id,
      label: menu?.title || menu?.name || 'Untitled Menu',
    }));
  }, [menuListData]);

  const handleOpenImportDialog = () => {
    if (selectedPresets.size === 0) {
      showError('Please select at least one preset item to import');
      return;
    }

    if (!companyOrganizer) {
      showError('Company organizer is required to import preset items');
      return;
    }

    setIsMenuSelectDialogOpen(true);
  };

  const handleImport = async () => {
    if (!selectedMenuId) {
      showError('Please select a menu');
      return;
    }

    if (!companyOrganizer) {
      showError('Company organizer is required');
      return;
    }

    try {
      const payload = {
        menu: selectedMenuId,
        companyOrganizer,
        presetItems: Array.from(selectedPresets),
      };

      const response = await importPresetMenuItems(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      // showSuccess(response?.message || 'Preset items imported successfully');
      setIsMenuSelectDialogOpen(false);
      setSelectedMenuId('');
      setSelectedPresets(new Set());
      onImportComplete?.();
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    setSelectedPresets(new Set());
    setSearchQuery('');
    setIsMenuSelectDialogOpen(false);
    setSelectedMenuId('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full max-w-300! flex-col overflow-hidden"
        >
          <DialogHeader className="border-b pb-4 dark:border-gray-700">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Import Preset Menu Items
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Select preset items to quickly add to your menu. You can customize them later.
            </p>
          </DialogHeader>

          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Search and Select All */}
            <div className="flex flex-col gap-3 border-b px-1 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search presets by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-lg border-2 bg-white pr-4 pl-10 text-sm transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Preset Grid */}
            <div className="flex-1 overflow-y-auto px-1 py-4">
              {presetLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
              ) : filteredPresets.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center">
                  <Package className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">No Presets Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'Try adjusting your search terms' : 'No preset items available to import'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredPresets.map((preset: PresetItem) => {
                    const isSelected = selectedPresets.has(preset._id);
                    const imageUrl = getImageUrl(preset);

                    return (
                      <div
                        key={preset._id}
                        onClick={() => handleTogglePreset(preset._id)}
                        className={cn(
                          'group relative cursor-pointer overflow-hidden rounded-lg border bg-white transition-colors duration-150 hover:shadow-md dark:bg-gray-800',
                          isSelected ? 'border-blue-500 shadow-sm dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
                        )}
                      >
                        {/* Checkbox */}
                        <div className="absolute top-2 right-2 z-10">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleTogglePreset(preset._id)}
                            className={cn(
                              'h-5 w-5 rounded border transition-all',
                              isSelected
                                ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700'
                            )}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Image */}
                        <div className="relative h-36 w-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={preset.title}
                              width={400}
                              height={400}
                              className="h-full w-full transform-gpu object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={cn('flex h-full w-full items-center justify-center text-4xl', imageUrl ? 'hidden' : '')}>🍽️</div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-between p-3">
                          {/* Top section with title and price */}
                          <div className="mb-0.5 flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{preset.title}</h3>
                            <div className="text-right whitespace-nowrap">
                              <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                                €{toSafeNumber(preset.basePrice, 0).toFixed(2)}
                              </span>
                              {preset.discountPrice &&
                                toSafeNumber(preset.discountPrice, 0) > 0 &&
                                toSafeNumber(preset.discountPrice, 0) < toSafeNumber(preset.basePrice, 0) && (
                                  <div className="text-xs font-medium text-gray-400 line-through dark:text-gray-500">
                                    €{toSafeNumber(preset.discountPrice, 0).toFixed(2)}
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Category and Description */}
                          {preset.category && <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">{preset.category.title}</p>}

                          {preset.description && (
                            <p className="line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{preset.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-1 pt-4 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPresets.size > 0 ? (
                  <span className="font-semibold">
                    {selectedPresets.size} item{selectedPresets.size > 1 ? 's' : ''} selected
                  </span>
                ) : (
                  <span>Select items to import</span>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="h-11 px-6 font-semibold">
                  Cancel
                </Button>

                {importLoading ? (
                  <Button disabled className="h-11 cursor-not-allowed bg-blue-600 px-6 text-white hover:bg-blue-600">
                    <ButtonLoading title="Importing" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleOpenImportDialog}
                    disabled={selectedPresets.size === 0}
                    className="h-11 bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Import {selectedPresets.size > 0 ? `(${selectedPresets.size})` : ''}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>

      <Dialog open={isMenuSelectDialogOpen} onOpenChange={setIsMenuSelectDialogOpen}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0" />
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto w-full max-w-125!">
          <DialogHeader>
            <DialogTitle>Select Menu For Import</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose the target menu where {selectedPresets.size} preset item{selectedPresets.size > 1 ? 's' : ''} will be imported.
            </p>

            <div className="space-y-2">
              <div className="text-sm font-semibold">Menu</div>
              <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
                <SelectTrigger className="h-11 w-full border-2">
                  <SelectValue placeholder={menuListLoading ? 'Loading menus...' : 'Select menu'} />
                </SelectTrigger>
                <SelectContent>
                  {menuOptions.map((option: { value: string; label: string }) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsMenuSelectDialogOpen(false)} disabled={importLoading}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={importLoading || !selectedMenuId} className="bg-blue-600 text-white hover:bg-blue-700">
                {importLoading ? <ButtonLoading title="Importing" /> : 'Confirm Import'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PresetImportScreen;
