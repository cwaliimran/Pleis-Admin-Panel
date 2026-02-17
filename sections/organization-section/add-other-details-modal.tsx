import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useUpdateOrganizationMutation } from '@/store/Reducer/organization';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

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
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const initialGalleryMedia = useMemo<string[]>(() => newOrganization?.otherInfo?.galleryMedia || [], [newOrganization?.otherInfo?.galleryMedia]);

  // API Queries
  const { data: tagData } = useGetTagsQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const { data: venueData, isLoading: venueLoading } = useGetVenuesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
    date: undefined,
  });

  const { data: categoryData } = useGetCategoriesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
    date: undefined,
  });

  // Memoized Options
  const tagOptions = useMemo(() => buildTagOptions(tagData), [tagData]);
  const venueOptions = useMemo(() => buildVenueOptions(venueList, venueData), [venueList, venueData]);
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

  const { handleSubmit, reset, setValue } = methods;

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
  useEffect(() => {
    if (watchVenue && venueData?.data) {
      const selectedVenue = venueData.data.find((v: any) => v._id === watchVenue);

      if (selectedVenue?.location) {
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
    }
  }, [watchVenue, venueData, setValue]);

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
                <RHFCustomDropdown
                  name="venue"
                  label="Venue"
                  placeholder="Select Venue"
                  options={venueOptions}
                  isLoading={venueLoading}
                  showNone={false}
                />

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
                            <RHFTextField type="time" name={`${dayInfo.dayKey}.from`} placeholder="09:00" className="w-full rounded border p-1" />
                          </td>
                          <td className="p-2">
                            <RHFTextField type="time" name={`${dayInfo.dayKey}.to`} placeholder="23:00" className="w-full rounded border p-1" />
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

// import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
// import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
// import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// import { useUpdateOrganizationMutation } from '@/store/Reducer/organization';
// import { useGetTagsQuery } from '@/store/Reducer/tags';
// import { useGetVenuesQuery } from '@/store/Reducer/venue';
// import { getErrorMessage } from '@/utils/api';
// import { deleteFileFromAzure } from '@/utils/deleteFile';
// import { uploadFileToAzure } from '@/utils/fileUpload';
// import { showError, showSuccess } from '@/utils/toast';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Plus, X } from 'lucide-react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
// import { FieldValues, useForm, useWatch } from 'react-hook-form';
// import * as Yup from 'yup';

// // ============================================================
// // TYPES
// // ============================================================

// interface Location {
//   address: string;
//   city: string;
//   postalCode: string;
//   country: string;
//   coordinates: [number, number];
// }

// interface OperatingHours {
//   from: string;
//   to: string;
//   isOpen: string;
// }

// interface FormValues extends FieldValues {
//   description: string;
//   minAge: string;
//   tags: string[];
//   categories: string[];
//   galleryImages: File[];
//   existingGallery: string[];
//   venue: string;
//   monday: OperatingHours;
//   tuesday: OperatingHours;
//   wednesday: OperatingHours;
//   thursday: OperatingHours;
//   friday: OperatingHours;
//   saturday: OperatingHours;
//   sunday: OperatingHours;
//   status: string;
//   location: Location;
// }

// interface GalleryItem {
//   url: string;
//   key: string;
//   file?: File;
//   name?: string;
// }

// interface GalleryModalProps {
//   open: boolean;
//   onClose: () => void;
//   initialExisting: string[];
//   initialNewFiles: File[];
//   onSave: (keptExisting: string[], newFiles: File[]) => void;
// }

// interface AddOtherDetailsModalProps {
//   newOrganization?: any;
//   onClose: () => void;
//   open: boolean;
//   venueList: any[];
// }

// // ============================================================
// // CONSTANTS
// // ============================================================

// const DAYS_OF_WEEK = [
//   { day: 'Monday', dayKey: 'monday' },
//   { day: 'Tuesday', dayKey: 'tuesday' },
//   { day: 'Wednesday', dayKey: 'wednesday' },
//   { day: 'Thursday', dayKey: 'thursday' },
//   { day: 'Friday', dayKey: 'friday' },
//   { day: 'Saturday', dayKey: 'saturday' },
//   { day: 'Sunday', dayKey: 'sunday' },
// ] as const;

// const DEFAULT_OPERATING_HOURS: OperatingHours = {
//   from: '00:00',
//   to: '00:00',
//   isOpen: 'false',
// };

// const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// const defaultValues: FormValues = {
//   description: '',
//   minAge: '',
//   tags: [],
//   categories: [],
//   galleryImages: [],
//   existingGallery: [],
//   venue: '',
//   monday: { ...DEFAULT_OPERATING_HOURS },
//   tuesday: { ...DEFAULT_OPERATING_HOURS },
//   wednesday: { ...DEFAULT_OPERATING_HOURS },
//   thursday: { ...DEFAULT_OPERATING_HOURS },
//   friday: { ...DEFAULT_OPERATING_HOURS },
//   saturday: { ...DEFAULT_OPERATING_HOURS },
//   sunday: { ...DEFAULT_OPERATING_HOURS },
//   status: 'active',
//   location: {
//     address: '',
//     city: '',
//     postalCode: '',
//     country: '',
//     coordinates: [0, 0],
//   },
// };

// // ============================================================
// // VALIDATION SCHEMA
// // ============================================================

// const operatingHoursSchema = Yup.object().shape({
//   from: Yup.string().required('Required'),
//   to: Yup.string().required('Required'),
//   isOpen: Yup.string().required('Required'),
// });

// const schema = Yup.object().shape({
//   description: Yup.string().required('Description is required').max(500, 'Description must be at most 500 characters'),
//   minAge: Yup.string()
//     .optional()
//     .test('max-age', 'Age cannot exceed 110', (value) => {
//       if (!value || value === '') return true;
//       const numValue = Number(value);
//       return !isNaN(numValue) && numValue <= 110;
//     })
//     .test('min-age', 'Age must be at least 0', (value) => {
//       if (!value || value === '') return true;
//       const numValue = Number(value);
//       return !isNaN(numValue) && numValue >= 0;
//     }),
//   tags: Yup.array().of(Yup.string()).min(0),
//   categories: Yup.array().of(Yup.string()).min(1, 'At least one category is required').max(5, 'Maximum 5 categories allowed'),
//   galleryImages: Yup.mixed().nullable(),
//   existingGallery: Yup.array().of(Yup.string()),
//   venue: Yup.string().required('Venue is required'),
//   monday: operatingHoursSchema,
//   tuesday: operatingHoursSchema,
//   wednesday: operatingHoursSchema,
//   thursday: operatingHoursSchema,
//   friday: operatingHoursSchema,
//   saturday: operatingHoursSchema,
//   sunday: operatingHoursSchema,
//   status: Yup.string().required('Status is required'),
//   location: Yup.object().shape({
//     address: Yup.string().required('Address is required'),
//     city: Yup.string().required('City is required'),
//     postalCode: Yup.string(),
//     country: Yup.string().required('Country is required'),
//     coordinates: Yup.array().of(Yup.number()).length(2, 'Coordinates must be an array of 2 numbers'),
//   }),
// });

// // ============================================================
// // HELPER FUNCTIONS
// // ============================================================

// const getOperatingHoursFromData = (data: any, dayKey: string): OperatingHours => ({
//   from: data?.operatingHours?.[dayKey]?.from || '00:00',
//   to: data?.operatingHours?.[dayKey]?.to || '00:00',
//   isOpen: data?.operatingHours?.[dayKey]?.isOpen ? 'true' : 'false',
// });

// const buildOperatingHoursPayload = (formData: FormValues) => {
//   const result: Record<string, any> = {};

//   DAYS_OF_WEEK.forEach(({ dayKey }) => {
//     const dayData = formData[dayKey] as OperatingHours;
//     result[dayKey] = dayData.isOpen === 'true' ? { ...dayData, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false };
//   });

//   return result;
// };

// const validateAndUploadImages = async (files: File[]): Promise<string[]> => {
//   const uploadPromises = files.map(async (file) => {
//     if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//       throw new Error('Only JPEG, PNG, GIF, or WEBP images are allowed.');
//     }
//     if (file.size > MAX_IMAGE_SIZE) {
//       throw new Error('Image size must be less than 5MB.');
//     }
//     return await uploadFileToAzure(file);
//   });

//   return Promise.all(uploadPromises);
// };

// /**
//  * Extracts filename from a URL or returns the string if it's already a filename
//  * Example: "https://example.com/container/abc123.jpg" -> "abc123.jpg"
//  */
// const extractFilenameFromUrl = (urlOrFilename: string): string => {
//   if (!urlOrFilename) return '';

//   // If it's already just a filename (no slashes or protocol), return as is
//   if (!urlOrFilename.includes('/') && !urlOrFilename.includes('http')) {
//     return urlOrFilename;
//   }

//   try {
//     // Try to parse as URL and get the last segment
//     const url = new URL(urlOrFilename);
//     const pathname = url.pathname;
//     const segments = pathname.split('/').filter(Boolean);
//     return segments[segments.length - 1] || urlOrFilename;
//   } catch {
//     // If URL parsing fails, try to get last segment after splitting by '/'
//     const segments = urlOrFilename.split('/').filter(Boolean);
//     return segments[segments.length - 1] || urlOrFilename;
//   }
// };

// /**
//  * Checks if gallery has changed by comparing initial and current state
//  */
// const hasGalleryChanged = (initialGallery: string[], currentExisting: string[], newFiles: File[]): boolean => {
//   // If there are new files, gallery has changed
//   if (newFiles.length > 0) {
//     return true;
//   }

//   // If counts differ, gallery has changed
//   if (initialGallery.length !== currentExisting.length) {
//     return true;
//   }

//   // Check if all initial items are still present
//   const sortedInitial = [...initialGallery].sort();
//   const sortedCurrent = [...currentExisting].sort();

//   return !sortedInitial.every((item, index) => item === sortedCurrent[index]);
// };

// /**
//  * Gets the list of removed gallery items
//  */
// const getRemovedGalleryItems = (initialGallery: string[], currentExisting: string[]): string[] => {
//   return initialGallery.filter((item) => !currentExisting.includes(item));
// };

// // ============================================================
// // GALLERY MODAL COMPONENT
// // ============================================================

// const GalleryModal: React.FC<GalleryModalProps> = ({ open, onClose, initialExisting, initialNewFiles, onSave }) => {
//   const [images, setImages] = useState<GalleryItem[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!open) {
//       previewUrls.forEach((url) => URL.revokeObjectURL(url));
//       setPreviewUrls([]);
//       setImages([]);
//       return;
//     }

//     const newPreviews: string[] = [];
//     const newImages: GalleryItem[] = initialNewFiles.map((f) => {
//       const purl = URL.createObjectURL(f);
//       newPreviews.push(purl);
//       return { url: purl, key: `new_${f.name}_${Math.random()}`, file: f };
//     });

//     const existingImages: GalleryItem[] = initialExisting.map((url) => ({
//       url: url,
//       key: url,
//       name: url,
//     }));

//     setImages([...existingImages, ...newImages]);
//     setPreviewUrls(newPreviews);

//     return () => {
//       newPreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, initialExisting, initialNewFiles]);

//   const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const added: GalleryItem[] = [];
//     const newPrevs: string[] = [];

//     Array.from(files).forEach((f) => {
//       if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
//         showError(`Invalid file type for ${f.name}. Only JPEG, PNG, GIF, or WEBP allowed.`);
//         return;
//       }
//       if (f.size > MAX_IMAGE_SIZE) {
//         showError(`File ${f.name} is too large. Must be less than 5MB.`);
//         return;
//       }
//       const purl = URL.createObjectURL(f);
//       newPrevs.push(purl);
//       added.push({
//         url: purl,
//         key: `new_${f.name}_${Math.random()}`,
//         file: f,
//       });
//     });

//     if (added.length > 0) {
//       setImages((prev) => [...prev, ...added]);
//       setPreviewUrls((prev) => [...prev, ...newPrevs]);
//     }

//     // Reset input to allow selecting same file again
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleRemove = (key: string) => {
//     setImages((prev) => {
//       const item = prev.find((i) => i.key === key);
//       if (item && item.file) {
//         URL.revokeObjectURL(item.url);
//         setPreviewUrls((p) => p.filter((u) => u !== item.url));
//       }
//       return prev.filter((i) => i.key !== key);
//     });
//   };

//   const handleSave = () => {
//     const keptExisting = images.filter((i) => i.name).map((i) => i.name!);
//     const newFiles = images.filter((i) => i.file).map((i) => i.file!);
//     onSave(keptExisting, newFiles);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0" />
//       <DialogContent
//         aria-describedby={undefined}
//         className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col md:max-w-[630px]!"
//       >
//         <DialogHeader>
//           <DialogTitle>
//             <div className="mb-3 flex items-center justify-start gap-x-2">
//               <h2>Manage Gallery</h2>
//               <div>
//                 <Button className="h-7 w-8 rounded-full p-0" onClick={() => fileInputRef.current?.click()}>
//                   <Plus />
//                 </Button>
//                 <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={handleAdd} />
//               </div>
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="w-full flex-1 overflow-y-auto px-0">
//           {images.length === 0 ? (
//             <p className="text-center text-gray-500">No images in gallery.</p>
//           ) : (
//             <div className="grid grid-cols-3 gap-4">
//               {images.map((img) => (
//                 <div key={img.key} className="relative">
//                   <Image src={img.url} alt="Gallery image" className="h-32 w-full rounded object-cover" height={100} width={100} />
//                   <Button variant="destructive" size="sm" className="absolute top-1 right-1" onClick={() => handleRemove(img.key)}>
//                     <X />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-center gap-4 border-t p-4 pb-0">
//           <Button onClick={onClose} variant="outline">
//             Cancel
//           </Button>
//           <Button className="px-6" onClick={handleSave}>
//             Save
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // ============================================================
// // MAIN COMPONENT
// // ============================================================

// const AddOtherDetailsModal: React.FC<AddOtherDetailsModalProps> = ({ newOrganization, onClose, open, venueList }) => {
//   const router = useRouter();
//   const [imageUploading, setImageUploading] = useState(false);
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

//   // Store initial gallery state for comparison
//   const initialGalleryMedia = useMemo<string[]>(() => newOrganization?.otherInfo?.galleryMedia || [], [newOrganization?.otherInfo?.galleryMedia]);

//   const { data: tagData } = useGetTagsQuery({
//     page: 0,
//     search: '',
//     limit: '100',
//     status: '',
//   });

//   const { data: venueData, isLoading: venueLoading } = useGetVenuesQuery({
//     page: 0,
//     search: '',
//     limit: '100',
//     status: '',
//     date: undefined,
//   });

//   const { data: categoryData } = useGetCategoriesQuery({
//     page: 0,
//     search: '',
//     limit: '100',
//     status: '',
//     date: undefined,
//   });

//   const tagOptions = useMemo(
//     () =>
//       tagData?.data?.map((tag: any) => ({
//         label: tag?.title,
//         value: tag?._id,
//       })) || [],
//     [tagData]
//   );

//   const venueOptions = useMemo(
//     () =>
//       (venueList && venueList.length > 0
//         ? venueList.map((venue: any) => ({
//             label: venue?.venueTitle,
//             value: venue?.venueId,
//           }))
//         : venueData?.data?.map((venue: any) => ({
//             label: venue?.title,
//             value: venue?._id,
//           }))) || [],
//     [venueList, venueData]
//   );

//   const categoryOptions = useMemo(
//     () =>
//       categoryData?.data?.map((category: any) => ({
//         label: category?.title,
//         value: category?._id,
//       })) || [],
//     [categoryData]
//   );

//   const formDefaultValues = useMemo<FormValues>(() => {
//     if (!newOrganization?.otherInfo) {
//       return defaultValues;
//     }

//     return {
//       ...defaultValues,
//       description: newOrganization.otherInfo.description || '',
//       minAge: String(newOrganization.otherInfo.minAge ?? ''),
//       tags: newOrganization.otherInfo.tags?.map((tag: any) => tag.id) || [],
//       categories: newOrganization.otherInfo.categories?.map((cat: any) => cat._id) || [],
//       existingGallery: initialGalleryMedia,
//       venue: newOrganization.venue?._id || '',
//       monday: getOperatingHoursFromData(newOrganization, 'monday'),
//       tuesday: getOperatingHoursFromData(newOrganization, 'tuesday'),
//       wednesday: getOperatingHoursFromData(newOrganization, 'wednesday'),
//       thursday: getOperatingHoursFromData(newOrganization, 'thursday'),
//       friday: getOperatingHoursFromData(newOrganization, 'friday'),
//       saturday: getOperatingHoursFromData(newOrganization, 'saturday'),
//       sunday: getOperatingHoursFromData(newOrganization, 'sunday'),
//       status: newOrganization.status || 'active',
//       location: {
//         address: newOrganization.location?.fullAddress || '',
//         city: newOrganization.location?.city || '',
//         postalCode: newOrganization.location?.postalCode || '',
//         country: newOrganization.location?.country || '',
//         coordinates: newOrganization.location?.coordinates || [0, 0],
//       },
//     };
//   }, [newOrganization, initialGalleryMedia]);

//   const methods = useForm<FormValues>({
//     resolver: yupResolver(schema) as any,
//     defaultValues: formDefaultValues,
//     mode: 'onChange',
//   });

//   const { handleSubmit, reset, setValue } = methods;

//   const watchGalleryImages = useWatch({ control: methods.control, name: 'galleryImages' }) || [];
//   const watchExistingGallery = useWatch({ control: methods.control, name: 'existingGallery' }) || [];
//   const watchVenue = useWatch({ control: methods.control, name: 'venue' });

//   // Reset form when modal opens with new data
//   useEffect(() => {
//     if (open) {
//       reset(formDefaultValues);
//     }
//   }, [open, formDefaultValues, reset]);

//   // Auto-populate location when venue changes
//   useEffect(() => {
//     if (watchVenue && venueData?.data) {
//       const selectedVenue = venueData.data.find((v: any) => v._id === watchVenue);

//       if (selectedVenue?.location) {
//         setValue('location.address', selectedVenue.location.fullAddress || '', { shouldValidate: true, shouldDirty: true });
//         setValue('location.city', selectedVenue.location.city || '', {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//         setValue('location.postalCode', selectedVenue.location.postalCode || '', { shouldValidate: true, shouldDirty: true });
//         setValue('location.country', selectedVenue.location.country || '', {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//         setValue('location.coordinates', selectedVenue.location.coordinates || [0, 0], { shouldValidate: true, shouldDirty: true });
//       }
//     }
//   }, [watchVenue, venueData, setValue]);

//   const onSubmit = handleSubmit(async (formData) => {
//     let uploadedGalleryMedia: string[] = [];
//     let removedItems: string[] = [];

//     try {
//       if (!newOrganization?._id) {
//         throw new Error('Organization ID is missing');
//       }

//       setImageUploading(true);

//       // Check if gallery has actually changed
//       const galleryChanged = hasGalleryChanged(initialGalleryMedia, formData.existingGallery, formData.galleryImages);

//       // Only process gallery if there are changes
//       if (galleryChanged) {
//         // Get removed items for later deletion
//         removedItems = getRemovedGalleryItems(initialGalleryMedia, formData.existingGallery);

//         // Upload new images if any
//         if (formData.galleryImages && formData.galleryImages.length > 0) {
//           uploadedGalleryMedia = await validateAndUploadImages(formData.galleryImages);
//         }
//       }

//       // Build payload
//       const payload: any = {
//         otherInfo: {
//           description: formData.description,
//           minAge: formData.minAge ? Number(formData.minAge) : undefined,
//           tags: formData.tags,
//           categories: formData.categories,
//         },
//         operatingHours: buildOperatingHoursPayload(formData),
//         status: formData.status,
//         venue: formData.venue,
//         location: {
//           fullAddress: formData.location.address,
//           city: formData.location.city,
//           postalCode: formData.location.postalCode,
//           country: formData.location.country,
//           coordinates: formData.location.coordinates,
//         },
//       };

//       // Only include galleryMedia in payload if it changed
//       if (galleryChanged) {
//         // Convert existing URLs to filenames and combine with newly uploaded filenames
//         const existingFilenames = formData.existingGallery.map(extractFilenameFromUrl);
//         payload.otherInfo.galleryMedia = [...existingFilenames, ...uploadedGalleryMedia];
//       }

//       const response = await updateOrganization({
//         id: newOrganization._id,
//         ...payload,
//       }).unwrap();

//       if (!response) {
//         showError('No response from server. Please try again later.');
//         return;
//       }

//       if (response.error) {
//         const errorMessage = getErrorMessage(response.error);
//         showError(errorMessage);
//         return;
//       }

//       // Delete removed files only after successful update AND only if gallery changed
//       if (galleryChanged && removedItems.length > 0) {
//         // Extract filenames from URLs for deletion
//         const filesToDelete = removedItems.map(extractFilenameFromUrl);
//         await Promise.all(filesToDelete.map((file) => deleteFileFromAzure(file)));
//       }

//       showSuccess(response?.message || 'Details updated successfully');

//       setImageUploading(false);
//       reset();
//       onClose();

//       // Navigate based on current path
//       if (typeof window !== 'undefined') {
//         const currentPath = window.location.pathname;
//         if (currentPath === '/organizer/organization/create-organization') {
//           router.push('/organizer/organization/organization-list');
//         } else if (currentPath === '/super-admin/organization/create-organization') {
//           router.push('/super-admin/organization/organization-list');
//         }
//       }
//     } catch (error) {
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);

//       // Delete newly uploaded files on error (rollback)
//       if (uploadedGalleryMedia.length > 0) {
//         await Promise.all(uploadedGalleryMedia.map((file) => deleteFileFromAzure(file)));
//       }

//       setImageUploading(false);
//     } finally {
//       setImageUploading(false);
//     }
//   });

//   const handleGallerySave = (keptExisting: string[], newFiles: File[]) => {
//     setValue('existingGallery', keptExisting, { shouldDirty: true });
//     setValue('galleryImages', newFiles, { shouldDirty: true });
//     setGalleryOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0" />
//       <DialogContent
//         aria-describedby={undefined}
//         className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[630px]"
//         onInteractOutside={(event) => {
//           const target = event.target as HTMLElement;
//           if (target.closest('.pac-container')) {
//             event.preventDefault();
//           }
//         }}
//       >
//         <DialogHeader>
//           <DialogTitle>Add Other Details</DialogTitle>
//         </DialogHeader>

//         <div className="w-full px-4">
//           <FormProvider methods={methods} onSubmit={onSubmit}>
//             <div className="mt-4 flex w-full flex-col gap-4">
//               <RHFTextField name="description" label="Description" placeholder="Enter Description" rows={2} multiline />

//               <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
//                 <RHFTextField type="number" name="minAge" label="Age (optional)" placeholder="Min Age 5" />
//               </div>

//               <div className="grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-1">
//                 <RHFCustomDropdown
//                   name="venue"
//                   label="Venue"
//                   placeholder="Select Venue"
//                   options={venueOptions}
//                   isLoading={venueLoading}
//                   showNone={false}
//                 />

//                 <RHFCustomCombobox
//                   name="tags"
//                   label="Select Tags"
//                   placeholder="Select tags"
//                   className="w-full flex-1"
//                   multiple={true}
//                   allowCustom={false}
//                   options={tagOptions}
//                 />

//                 <RHFCustomCombobox
//                   name="categories"
//                   label="Select Categories"
//                   placeholder="Select categories"
//                   className="w-full flex-1"
//                   multiple={true}
//                   allowCustom={false}
//                   options={categoryOptions}
//                 />
//               </div>

//               <div className="w-full">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gallery Images</label>
//                 <Button type="button" onClick={() => setGalleryOpen(true)} className="mt-2">
//                   Manage Gallery
//                 </Button>
//               </div>

//               <div className="w-full">
//                 <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Operating Hours</h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-100 dark:bg-[#272727]">
//                         <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Day</th>
//                         <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Opening</th>
//                         <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Closing</th>
//                         <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {DAYS_OF_WEEK.map((dayInfo) => (
//                         <tr key={dayInfo.dayKey} className="border-t dark:border-gray-700">
//                           <td className="p-2 text-sm text-gray-700 dark:text-gray-300">{dayInfo.day}</td>
//                           <td className="p-2">
//                             <RHFTextField type="time" name={`${dayInfo.dayKey}.from`} placeholder="09:00" className="w-full rounded border p-1" />
//                           </td>
//                           <td className="p-2">
//                             <RHFTextField type="time" name={`${dayInfo.dayKey}.to`} placeholder="23:00" className="w-full rounded border p-1" />
//                           </td>
//                           <td className="p-2">
//                             <RHFSelectField
//                               name={`${dayInfo.dayKey}.isOpen`}
//                               className="w-full rounded border p-1"
//                               options={[
//                                 { label: 'Open', value: 'true' },
//                                 { label: 'Closed', value: 'false' },
//                               ]}
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <RHFTextField
//                 name="location.address"
//                 label="Location (from selected venue)"
//                 placeholder="Select a venue to see location"
//                 disabled={true}
//                 multiline
//                 rows={2}
//               />

//               <RHFSelectField
//                 name="status"
//                 label="Status"
//                 placeholder="Select Status"
//                 className="w-full flex-1"
//                 options={[
//                   { label: 'Active', value: 'active' },
//                   { label: 'Inactive', value: 'inactive' },
//                 ]}
//               />
//             </div>

//             <div className="mt-2 flex w-full items-center justify-center">
//               <Button
//                 type="submit"
//                 className="bg-primary hover:bg-primary/80 mt-3 h-10 cursor-pointer px-10 text-white"
//                 disabled={isLoading || imageUploading || !methods.formState.isValid}
//               >
//                 {isLoading || imageUploading ? 'Saving...' : 'Save'}
//               </Button>
//             </div>
//           </FormProvider>
//         </div>
//       </DialogContent>

//       <GalleryModal
//         open={galleryOpen}
//         onClose={() => setGalleryOpen(false)}
//         initialExisting={watchExistingGallery}
//         initialNewFiles={watchGalleryImages}
//         onSave={handleGallerySave}
//       />
//     </Dialog>
//   );
// };

// export default AddOtherDetailsModal;
