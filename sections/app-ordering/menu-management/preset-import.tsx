'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { cn } from '@/lib/utils';
import { useGetPresetMenuQuery } from '@/store/Reducer/preset-menu-api';
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
}

const PresetImportScreen: React.FC<PresetImportScreenProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set());

  const { data: presetData, isLoading: presetLoading } = useGetPresetMenuQuery({
    page: 0,
    search: searchQuery,
    limit: '10000',
    status: 'active',
    date: undefined,
  });

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

  // Select all presets
  const handleSelectAll = () => {
    if (selectedPresets.size === filteredPresets.length) {
      setSelectedPresets(new Set());
    } else {
      setSelectedPresets(new Set(filteredPresets.map((preset: PresetItem) => preset._id)));
    }
  };

  // Get image URL with fallback
  const getImageUrl = (preset: PresetItem): string | null => {
    const img = preset?.imageInfo?.url || preset?.image;
    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
      return null;
    }
    return img;
  };

  // Import selected presets
  //   const handleImport = async () => {
  //     if (selectedPresets.size === 0) {
  //       showError('Please select at least one preset to import');
  //       return;
  //     }

  //     const selectedItems = filteredPresets.filter((preset: PresetItem) => selectedPresets.has(preset._id));

  //     try {
  //       let successCount = 0;
  //       let errorCount = 0;

  //       for (const preset of selectedItems) {
  //         try {
  //           const payload = {
  //             title: preset.title,
  //             description: preset.description || '',
  //             basePrice: toSafeNumber(preset.basePrice, 0),
  //             discountPrice: preset.discountPrice ? toSafeNumber(preset.discountPrice, undefined) : null,
  //             taxPercent: toSafeNumber(preset.taxPercent, 0),
  //             type: preset.type || 'food',
  //             category: preset.category?._id || '',
  //             menu: selectedCompany?.menuId || '', // You may need to adjust this based on your data structure
  //             image: preset.imageInfo?.url || preset.image || '',
  //             startTime: '12:00 AM',
  //             endTime: '11:59 PM',
  //           };

  //           const response = await addMenuItem(payload).unwrap();

  //           if (response?.error) {
  //             errorCount++;
  //           } else {
  //             successCount++;
  //           }
  //         } catch (error) {
  //           errorCount++;
  //           console.error(`Error importing ${preset.title}:`, error);
  //         }
  //       }

  //       if (successCount > 0) {
  //         showSuccess(`Successfully imported ${successCount} menu item${successCount > 1 ? 's' : ''}`);
  //       }

  //       if (errorCount > 0) {
  //         showError(`Failed to import ${errorCount} item${errorCount > 1 ? 's' : ''}`);
  //       }

  //       if (successCount > 0) {
  //         setSelectedPresets(new Set());
  //         onImportComplete?.();
  //         onClose();
  //       }
  //     } catch (error) {
  //       const errorMessage = getErrorMessage(error);
  //       showError(errorMessage || 'Failed to import presets. Please try again.');
  //     }
  //   };

  const handleClose = () => {
    setSelectedPresets(new Set());
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full max-w-[1200px]! flex-col overflow-hidden"
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

              <Button
                variant="outline"
                onClick={handleSelectAll}
                disabled={filteredPresets.length === 0}
                className="h-11 shrink-0 gap-2 font-semibold"
              >
                {selectedPresets.size === filteredPresets.length && filteredPresets.length > 0 ? 'Deselect All' : 'Select All'}
              </Button>
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredPresets.map((preset: PresetItem) => {
                    const isSelected = selectedPresets.has(preset._id);
                    const imageUrl = getImageUrl(preset);

                    return (
                      <div
                        key={preset._id}
                        onClick={() => handleTogglePreset(preset._id)}
                        className={cn(
                          'group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-all hover:shadow-lg dark:bg-gray-800',
                          isSelected ? 'border-blue-500 shadow-md dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
                        )}
                      >
                        {/* Checkbox */}
                        <div className="absolute top-3 right-3 z-10">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleTogglePreset(preset._id)}
                            className={cn(
                              'h-6 w-6 rounded-md border-2 transition-all',
                              isSelected
                                ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700'
                            )}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Image */}
                        <div className="relative h-40 w-full overflow-hidden bg-linear-to-br from-blue-500/10 to-purple-500/10">
                          {imageUrl ? (
                            // <img
                            //   src={imageUrl}
                            //   alt={preset.title}
                            //   className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            //   onError={(e) => {
                            //     e.currentTarget.style.display = 'none';
                            //     e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            //   }}
                            // />
                            <Image
                              src={imageUrl}
                              alt={preset.title}
                              width={400}
                              height={400}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={cn('flex h-full w-full items-center justify-center text-5xl', imageUrl ? 'hidden' : '')}>🍽️</div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="mb-1 line-clamp-1 font-bold text-gray-900 dark:text-gray-100">{preset.title}</h3>

                          {preset.category && <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">{preset.category.title}</p>}

                          {preset.description && (
                            <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{preset.description}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              €{toSafeNumber(preset.basePrice, 0).toFixed(2)}
                            </span>
                            {preset.discountPrice &&
                              toSafeNumber(preset.discountPrice, 0) > 0 &&
                              toSafeNumber(preset.discountPrice, 0) < toSafeNumber(preset.basePrice, 0) && (
                                <span className="text-sm font-medium text-gray-400 line-through dark:text-gray-500">
                                  €{toSafeNumber(preset.discountPrice, 0).toFixed(2)}
                                </span>
                              )}
                          </div>
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

                {false ? (
                  <Button disabled className="h-11 cursor-not-allowed bg-blue-600 px-6 text-white hover:bg-blue-600">
                    <ButtonLoading title="Importing" />
                  </Button>
                ) : (
                  <Button
                    // onClick={handleImport}
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
    </Dialog>
  );
};

export default PresetImportScreen;
