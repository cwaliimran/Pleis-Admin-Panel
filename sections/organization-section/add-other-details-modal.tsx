import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useUpdateOrganizationMutation } from '@/store/Reducer/organization';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { ALLOWED_IMAGE_TYPES, DAYS_OF_WEEK, MAX_IMAGE_SIZE, OPEN_CLOSED_OPTIONS, STATUS_OPTIONS } from './constants';
import {
  buildCategoryOptions,
  buildFormDefaultValues,
  buildOperatingHoursPayload,
  buildTagOptions,
  buildVenueOptions,
  extractFilenameFromUrl,
  getRemovedGalleryItems,
  hasGalleryChanged,
  otherDetailsSchema,
  validateAndUploadImages,
} from './org-helpers';
import type { AddOtherDetailsModalProps, FormValues, GalleryItem, GalleryModalProps } from './types';

const GalleryModal: React.FC<GalleryModalProps> = ({ open, onClose, initialExisting, initialNewFiles, onSave }) => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setImages([]);
      return;
    }

    const newPreviews: string[] = [];
    const newImages: GalleryItem[] = initialNewFiles.map((f) => {
      const purl = URL.createObjectURL(f);
      newPreviews.push(purl);
      return { url: purl, key: `new_${f.name}_${Math.random()}`, file: f };
    });

    const existingImages: GalleryItem[] = initialExisting.map((url) => ({
      url: url,
      key: url,
      name: url,
    }));

    setImages([...existingImages, ...newImages]);
    setPreviewUrls(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialExisting, initialNewFiles]);

  const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const added: GalleryItem[] = [];
    const newPrevs: string[] = [];

    Array.from(files).forEach((f) => {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        showError(`Invalid file type for ${f.name}. Only JPEG, PNG, GIF, or WEBP allowed.`);
        return;
      }
      if (f.size > MAX_IMAGE_SIZE) {
        showError(`File ${f.name} is too large. Must be less than 5MB.`);
        return;
      }
      const purl = URL.createObjectURL(f);
      newPrevs.push(purl);
      added.push({
        url: purl,
        key: `new_${f.name}_${Math.random()}`,
        file: f,
      });
    });

    if (added.length > 0) {
      setImages((prev) => [...prev, ...added]);
      setPreviewUrls((prev) => [...prev, ...newPrevs]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (key: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item && item.file) {
        URL.revokeObjectURL(item.url);
        setPreviewUrls((p) => p.filter((u) => u !== item.url));
      }
      return prev.filter((i) => i.key !== key);
    });
  };

  const handleSave = () => {
    const keptExisting = images.filter((i) => i.name).map((i) => i.name!);
    const newFiles = images.filter((i) => i.file).map((i) => i.file!);
    onSave(keptExisting, newFiles);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col md:max-w-[650px]!"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3 flex items-center justify-start gap-x-2">
              <h2>Manage Gallery</h2>
              <div>
                <Button className="h-7 w-8 rounded-full p-0" onClick={() => fileInputRef.current?.click()}>
                  <Plus />
                </Button>
                <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={handleAdd} />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full flex-1 overflow-y-auto px-0">
          {images.length === 0 ? (
            <p className="text-center text-gray-500">No images in gallery.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.key} className="relative">
                  <Image src={img.url} alt="Gallery image" className="h-32 w-full rounded object-cover" height={100} width={100} />
                  <Button variant="destructive" size="sm" className="absolute top-1 right-1" onClick={() => handleRemove(img.key)}>
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 border-t p-4 pb-0">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button className="px-6" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const AddOtherDetailsModal: React.FC<AddOtherDetailsModalProps> = ({ newOrganization, onClose, open, venueList }) => {
  const router = useRouter();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const initialGalleryMedia = useMemo<string[]>(() => newOrganization?.otherInfo?.galleryMedia || [], [newOrganization?.otherInfo?.galleryMedia]);

  // API Queries
  const { data: tagData } = useGetTagsQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  // No longer fetching venues from API; using venueList prop only

  const { data: categoryData } = useGetCategoriesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
    date: undefined,
  });

  // Memoized Options
  const tagOptions = useMemo(() => buildTagOptions(tagData), [tagData]);
  const venueOptions = useMemo(() => buildVenueOptions(venueList, undefined), [venueList]);
  const categoryOptions = useMemo(() => buildCategoryOptions(categoryData), [categoryData]);

  // Form Setup
  const formDefaultValues = useMemo<FormValues>(
    () => buildFormDefaultValues(newOrganization, initialGalleryMedia),
    [newOrganization, initialGalleryMedia]
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(otherDetailsSchema) as any,
    defaultValues: formDefaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, reset, setValue, getValues } = methods;

  // Watchers
  const watchGalleryImages = useWatch({ control: methods.control, name: 'galleryImages' }) || [];
  const watchExistingGallery = useWatch({ control: methods.control, name: 'existingGallery' }) || [];
  const watchVenue = useWatch({ control: methods.control, name: 'venue' });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset(formDefaultValues);
    }
  }, [open, formDefaultValues, reset]);

  // Auto-populate location when venue changes
  // useEffect(() => {
  //   if (watchVenue && venueList) {
  //     const selectedVenue = venueList.find((v: any) => v._id === watchVenue);

  //     if (selectedVenue?.location) {
  //       setValue('location.address', selectedVenue.location.fullAddress || '', {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //       setValue('location.city', selectedVenue.location.city || '', {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //       setValue('location.postalCode', selectedVenue.location.postalCode || '', {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //       setValue('location.country', selectedVenue.location.country || '', {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //       setValue('location.coordinates', selectedVenue.location.coordinates || [0, 0], {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //     }
  //   }
  // }, [watchVenue, venueList, setValue]);

  useEffect(() => {
    if (!watchVenue || !venueList) return;

    const selectedVenue = venueList.find((v: any) => v._id === watchVenue);

    // Only auto-populate if location fields are currently empty
    // (avoids overwriting data on edit)
    const currentAddress = getValues('location.address');
    if (selectedVenue?.location && !currentAddress) {
      setValue('location.address', selectedVenue.location.fullAddress || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('location.city', selectedVenue.location.city || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('location.postalCode', selectedVenue.location.postalCode || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('location.country', selectedVenue.location.country || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('location.coordinates', selectedVenue.location.coordinates || [0, 0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchVenue, venueList, setValue, getValues, open]);

  // Form Submit Handler
  const onSubmit = handleSubmit(async (formData) => {
    let uploadedGalleryMedia: string[] = [];
    let removedItems: string[] = [];

    try {
      if (!newOrganization?._id) {
        throw new Error('Organization ID is missing');
      }

      setImageUploading(true);

      const galleryChanged = hasGalleryChanged(initialGalleryMedia, formData.existingGallery, formData.galleryImages);

      if (galleryChanged) {
        removedItems = getRemovedGalleryItems(initialGalleryMedia, formData.existingGallery);

        if (formData.galleryImages && formData.galleryImages.length > 0) {
          uploadedGalleryMedia = await validateAndUploadImages(formData.galleryImages);
        }
      }

      const payload: any = {
        otherInfo: {
          description: formData.description,
          minAge: formData.minAge ? Number(formData.minAge) : undefined,
          tags: formData.tags,
          categories: formData.categories,
        },
        operatingHours: buildOperatingHoursPayload(formData),
        status: formData.status,
        venue: formData.venue,
        location: {
          fullAddress: formData.location.address,
          city: formData.location.city,
          postalCode: formData.location.postalCode,
          country: formData.location.country,
          coordinates: formData.location.coordinates,
        },
      };

      if (galleryChanged) {
        const existingFilenames = formData.existingGallery.map(extractFilenameFromUrl);
        payload.otherInfo.galleryMedia = [...existingFilenames, ...uploadedGalleryMedia];
      }

      const response = await updateOrganization({
        id: newOrganization._id,
        ...payload,
      }).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (galleryChanged && removedItems.length > 0) {
        const filesToDelete = removedItems.map(extractFilenameFromUrl);
        await Promise.all(filesToDelete.map((file) => deleteFileFromAzure(file)));
      }

      showSuccess(response?.message || 'Details updated successfully');

      setImageUploading(false);
      reset();
      onClose();

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath === '/organizer/organization/create-organization') {
          router.push('/organizer/organization/organization-list');
        } else if (currentPath === '/super-admin/organization/create-organization') {
          router.push('/super-admin/organization/organization-list');
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);

      if (uploadedGalleryMedia.length > 0) {
        await Promise.all(uploadedGalleryMedia.map((file) => deleteFileFromAzure(file)));
      }

      setImageUploading(false);
    } finally {
      setImageUploading(false);
    }
  });

  const handleGallerySave = (keptExisting: string[], newFiles: File[]) => {
    setValue('existingGallery', keptExisting, { shouldDirty: true });
    setValue('galleryImages', newFiles, { shouldDirty: true });
    setGalleryOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[630px]"
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('.pac-container')) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Other Details</DialogTitle>
        </DialogHeader>

        <div className="w-full px-4">
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex w-full flex-col gap-4">
              <RHFTextField name="description" label="Description" placeholder="Enter Description" rows={2} multiline />

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <RHFTextField type="number" name="minAge" label="Age (optional)" placeholder="Min Age 5" />
              </div>

              <div className="grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-1">
                <RHFCustomDropdown name="venue" label="Venue" placeholder="Select Venue" options={venueOptions} isLoading={false} showNone={false} />

                <RHFCustomCombobox
                  name="tags"
                  label="Select Tags"
                  placeholder="Select tags"
                  className="w-full flex-1"
                  multiple={true}
                  allowCustom={false}
                  options={tagOptions}
                />

                <RHFCustomCombobox
                  name="categories"
                  label="Select Categories"
                  placeholder="Select categories"
                  className="w-full flex-1"
                  multiple={true}
                  allowCustom={false}
                  options={categoryOptions}
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gallery Images</label>
                <Button type="button" onClick={() => setGalleryOpen(true)} className="mt-2">
                  Manage Gallery
                </Button>
              </div>

              <div className="w-full">
                <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Operating Hours</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-[#272727]">
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Day</th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Opening</th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Closing</th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS_OF_WEEK.map((dayInfo) => (
                        <tr key={dayInfo.dayKey} className="border-t dark:border-gray-700">
                          <td className="p-2 text-sm text-gray-700 dark:text-gray-300">{dayInfo.day}</td>
                          <td className="p-2">
                            <Controller
                              name={`${dayInfo.dayKey}.from`}
                              control={methods.control}
                              render={({ field }) => (
                                <Time24hInput
                                  title={`${dayInfo.day} opening time`}
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="HH:mm"
                                  className="w-full"
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <Controller
                              name={`${dayInfo.dayKey}.to`}
                              control={methods.control}
                              render={({ field }) => (
                                <Time24hInput
                                  title={`${dayInfo.day} closing time`}
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="HH:mm"
                                  className="w-full"
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <RHFSelectField name={`${dayInfo.dayKey}.isOpen`} className="w-full rounded border p-1" options={OPEN_CLOSED_OPTIONS} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <RHFTextField
                name="location.address"
                label="Location (from selected venue)"
                placeholder="Select a venue to see location"
                disabled={true}
                multiline
                rows={2}
              />

              <RHFSelectField name="status" label="Status" placeholder="Select Status" className="w-full flex-1" options={STATUS_OPTIONS} />
            </div>

            <div className="mt-2 flex w-full items-center justify-center">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/80 mt-3 h-10 cursor-pointer px-10 text-white"
                disabled={isLoading || imageUploading || !methods.formState.isValid}
              >
                {isLoading || imageUploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </FormProvider>
        </div>
      </DialogContent>

      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialExisting={watchExistingGallery}
        initialNewFiles={watchGalleryImages}
        onSave={handleGallerySave}
      />
    </Dialog>
  );
};

export default AddOtherDetailsModal;
