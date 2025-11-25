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
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FieldValues, useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';

interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: [number, number];
}
interface OperatingHours {
  from: string;
  to: string;
  isOpen: string;
}
interface FormValues extends FieldValues {
  description: string;
  minAge: string;
  tags: string[];
  categories: string[];
  galleryImages: File[];
  existingGallery: string[];
  venue: string;
  monday: OperatingHours;
  tuesday: OperatingHours;
  wednesday: OperatingHours;
  thursday: OperatingHours;
  friday: OperatingHours;
  saturday: OperatingHours;
  sunday: OperatingHours;
  status: string;
  location: Location;
}

const defaultValues: FormValues = {
  description: '',
  minAge: '',
  tags: [],
  categories: [],
  galleryImages: [],
  existingGallery: [],
  venue: '',
  monday: { from: '00:00', to: '00:00', isOpen: 'false' },
  tuesday: { from: '00:00', to: '00:00', isOpen: 'false' },
  wednesday: { from: '00:00', to: '00:00', isOpen: 'false' },
  thursday: { from: '00:00', to: '00:00', isOpen: 'false' },
  friday: { from: '00:00', to: '00:00', isOpen: 'false' },
  saturday: { from: '00:00', to: '00:00', isOpen: 'false' },
  sunday: { from: '00:00', to: '00:00', isOpen: 'false' },
  status: 'active',
  location: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [0, 0],
  },
};

const schema = Yup.object().shape({
  description: Yup.string().required('Description is required').max(500, 'Description must be at most 500 characters'),
  minAge: Yup.string(),
  tags: Yup.array().of(Yup.string()).min(0),
  categories: Yup.array().of(Yup.string()).min(1, 'At least one category is required').max(5, 'Maximum 5 categories allowed'),
  galleryImages: Yup.mixed().nullable(),
  existingGallery: Yup.array().of(Yup.string()),
  venue: Yup.string().required('Venue is required'),
  monday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  tuesday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  wednesday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  thursday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  friday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  saturday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  sunday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    isOpen: Yup.string().required('Required'),
  }),
  status: Yup.string().required('Status is required'),
  location: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string(),
    country: Yup.string().required('Country is required'),
    coordinates: Yup.array().of(Yup.number()).length(2, 'Coordinates must be an array of 2 numbers'),
  }),
});

interface AddOtherDetailsModalProps {
  newOrganization?: any;
  onClose: () => void;
  open: boolean;
}

const AddOtherDetailsModal: React.FC<AddOtherDetailsModalProps> = ({ newOrganization, onClose, open }) => {
  const router = useRouter();
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const { data: tagData } = useGetTagsQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const { data: venueData, isLoading: venueLoading } = useGetVenuesQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const { data: categoryData } = useGetCategoriesQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const tagOptions =
    tagData?.data?.map((tag: any) => ({
      label: tag?.title,
      value: tag?.id,
    })) || [];

  const venueOptions =
    venueData?.data?.map((venue: any) => ({
      label: venue?.title,
      value: venue?._id,
    })) || [];

  const categoryOptions =
    categoryData?.data?.map((category: any) => ({
      label: category?.title,
      value: category?._id,
    })) || [];

  const initialGalleryMediaInfo = newOrganization?.otherInfo?.galleryMedia || [];

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: newOrganization?.otherInfo
      ? {
          ...defaultValues,
          description: newOrganization.otherInfo.description || '',
          minAge: String(newOrganization.otherInfo.minAge ?? ''),
          tags: newOrganization.otherInfo.tags?.map((tag: any) => tag._id) || [],
          categories: newOrganization.otherInfo.categories?.map((cat: any) => cat._id) || [],
          existingGallery: initialGalleryMediaInfo.map((m: any) => m) || [],
          venue: newOrganization.venue?._id || '',
          monday: {
            from: newOrganization.operatingHours?.monday?.from || '00:00',
            to: newOrganization.operatingHours?.monday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.monday?.isOpen ? 'true' : 'false',
          },
          tuesday: {
            from: newOrganization.operatingHours?.tuesday?.from || '00:00',
            to: newOrganization.operatingHours?.tuesday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.tuesday?.isOpen ? 'true' : 'false',
          },
          wednesday: {
            from: newOrganization.operatingHours?.wednesday?.from || '00:00',
            to: newOrganization.operatingHours?.wednesday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.wednesday?.isOpen ? 'true' : 'false',
          },
          thursday: {
            from: newOrganization.operatingHours?.thursday?.from || '00:00',
            to: newOrganization.operatingHours?.thursday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.thursday?.isOpen ? 'true' : 'false',
          },
          friday: {
            from: newOrganization.operatingHours?.friday?.from || '00:00',
            to: newOrganization.operatingHours?.friday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.friday?.isOpen ? 'true' : 'false',
          },
          saturday: {
            from: newOrganization.operatingHours?.saturday?.from || '00:00',
            to: newOrganization.operatingHours?.saturday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.saturday?.isOpen ? 'true' : 'false',
          },
          sunday: {
            from: newOrganization.operatingHours?.sunday?.from || '00:00',
            to: newOrganization.operatingHours?.sunday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.sunday?.isOpen ? 'true' : 'false',
          },
          status: newOrganization.status || 'active',
          location: {
            address: newOrganization.location?.fullAddress || '',
            city: newOrganization.location?.city || '',
            postalCode: newOrganization.location?.postalCode || '',
            country: newOrganization.location?.country || '',
            coordinates: newOrganization.location?.coordinates || [0, 0],
          },
        }
      : defaultValues,
  });

  const { handleSubmit, reset, setValue } = methods;
  const watchGalleryImages = useWatch({ control: methods.control, name: 'galleryImages' }) || [];

  // Add near the top with other useWatch hooks
  const watchVenue = useWatch({ control: methods.control, name: 'venue' });

  // Add this useEffect after your other hooks
  // useEffect(() => {
  //   if (watchVenue && venueData?.data) {
  //     const selectedVenue = venueData.data.find((v: any) => v._id === watchVenue);
  //     if (selectedVenue?.location) {
  //       setValue('location', {
  //         address: selectedVenue.location.fullAddress || '',
  //         city: selectedVenue.location.city || '',
  //         postalCode: selectedVenue.location.postalCode || '',
  //         country: selectedVenue.location.country || '',
  //         coordinates: selectedVenue.location.coordinates || [0, 0],
  //       });
  //     }
  //   }
  // }, [watchVenue, venueData, setValue]);

  useEffect(() => {
    console.log('watchVenue:', watchVenue);
    console.log('venueData:', venueData);

    if (watchVenue && venueData?.data) {
      const selectedVenue = venueData.data.find((v: any) => v._id === watchVenue);
      console.log('selectedVenue:', selectedVenue);

      if (selectedVenue?.location) {
        console.log('Setting location:', selectedVenue.location.fullAddress);

        setValue('location.address', selectedVenue.location.fullAddress || '', { shouldValidate: true, shouldDirty: true });
        setValue('location.city', selectedVenue.location.city || '', { shouldValidate: true, shouldDirty: true });
        setValue('location.postalCode', selectedVenue.location.postalCode || '', { shouldValidate: true, shouldDirty: true });
        setValue('location.country', selectedVenue.location.country || '', { shouldValidate: true, shouldDirty: true });
        setValue('location.coordinates', selectedVenue.location.coordinates || [0, 0], { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [watchVenue, venueData, setValue]);

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        throw new Error('Only JPEG, PNG, GIF, or WEBP images are allowed.');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB.');
      }
      return await uploadFileToAzure(file);
    });
    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  };

  const onSubmit = handleSubmit(async (formData) => {
    let galleryMedia: string[] = [];
    let removed: string[] = [];

    try {
      setImageUploading(true);

      const initialExistingNames = initialGalleryMediaInfo.map((m: any) => m.name) || [];
      removed = initialExistingNames.filter((n: string) => !formData.existingGallery.includes(n));

      if (formData.galleryImages && formData.galleryImages.length > 0) {
        galleryMedia = await handleImageUpload(formData.galleryImages);
      }

      const allMedia = [...formData.existingGallery, ...galleryMedia];

      const operatingHours = {
        monday: formData.monday.isOpen === 'true' ? { ...formData.monday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
        tuesday: formData.tuesday.isOpen === 'true' ? { ...formData.tuesday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
        wednesday: formData.wednesday.isOpen === 'true' ? { ...formData.wednesday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
        thursday: formData.thursday.isOpen === 'true' ? { ...formData.thursday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
        friday: formData.friday.isOpen === 'true' ? { ...formData.friday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
        saturday: formData.saturday.isOpen === 'true' ? { ...formData.saturday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
        sunday: formData.sunday.isOpen === 'true' ? { ...formData.sunday, isOpen: true } : { from: '00:00', to: '00:00', isOpen: false },
      };

      const payload = {
        otherInfo: {
          description: formData.description,
          minAge: formData.minAge ? Number(formData.minAge) : undefined,
          tags: formData.tags,
          categories: formData.categories,
          galleryMedia: allMedia,
        },
        operatingHours,
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

      if (!newOrganization?._id) {
        throw new Error('Organization ID is missing');
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

      // Delete removed files after successful update
      if (removed.length > 0) {
        await Promise.all(removed.map((file) => deleteFileFromAzure(file)));
      }

      if (response?.message) {
        showSuccess(response?.message || 'Details updated successfully');
      }

      setImageUploading(false);
      reset();
      onClose();

      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/organizer/organization/create-organization') {
          router.push('/organizer/organization/organization-list');
        } else if (window.location.pathname === '/super-admin/organization/create-organization') {
          router.push('/super-admin/organization/organization-list');
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to update details:', errorMessage);
      showError(errorMessage);
      // Delete newly uploaded files on error
      if (galleryMedia.length > 0) {
        await Promise.all(galleryMedia.map((file) => deleteFileFromAzure(file)));
      }
      setImageUploading(false);
    } finally {
      setImageUploading(false);
    }
  });

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
                {/* <p className="text-sm text-gray-500">
                  Current images:{' '}
                  {watchExistingGallery.length + watchGalleryImages.length}
                </p> */}
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
                      {[
                        { day: 'Monday', dayKey: 'monday' },
                        { day: 'Tuesday', dayKey: 'tuesday' },
                        { day: 'Wednesday', dayKey: 'wednesday' },
                        { day: 'Thursday', dayKey: 'thursday' },
                        { day: 'Friday', dayKey: 'friday' },
                        { day: 'Saturday', dayKey: 'saturday' },
                        { day: 'Sunday', dayKey: 'sunday' },
                      ].map((dayInfo) => (
                        <tr key={dayInfo.dayKey} className="border-t dark:border-gray-700">
                          <td className="p-2 text-sm text-gray-700 dark:text-gray-300">{dayInfo.day}</td>
                          <td className="p-2">
                            <RHFTextField type="time" name={`${dayInfo.dayKey}.from`} placeholder="09:00" className="w-full rounded border p-1" />
                          </td>
                          <td className="p-2">
                            <RHFTextField type="time" name={`${dayInfo.dayKey}.to`} placeholder="23:00" className="w-full rounded border p-1" />
                          </td>
                          <td className="p-2">
                            <RHFSelectField
                              name={`${dayInfo.dayKey}.isOpen`}
                              className="w-full rounded border p-1"
                              options={[
                                { label: 'Open', value: 'true' },
                                { label: 'Closed', value: 'false' },
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <GoogleLocationInput name="location" label="Location" /> */}

              <RHFTextField
                name="location.address"
                label="Location (from selected venue)"
                placeholder="Select a venue to see location"
                disabled={true}
                multiline
                rows={2}
              />

              <RHFSelectField
                name="status"
                label="Status"
                placeholder="Select Status"
                className="w-full flex-1"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
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
        initialExisting={initialGalleryMediaInfo}
        initialNewFiles={watchGalleryImages}
        onSave={(keptExisting, newFiles) => {
          setValue('existingGallery', keptExisting);
          setValue('galleryImages', newFiles);
          setGalleryOpen(false);
        }}
      />
    </Dialog>
  );
};

interface GalleryItem {
  url: string;
  key: string;
  file?: File;
  name?: string;
}

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  initialExisting: { name: string; url: string }[];
  initialNewFiles: File[];
  onSave: (keptExisting: string[], newFiles: File[]) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ open, onClose, initialExisting, initialNewFiles, onSave }) => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('initialExisting', initialExisting);

  useEffect(() => {
    if (!open) {
      // Clean up previews when modal closes
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

    // initialExisting is now an array of URLs (strings)
    const existingImages: any[] = initialExisting.map((url) => ({
      url: url,
      key: url,
      name: url,
    }));

    setImages([...existingImages, ...newImages]);
    setPreviewUrls(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // previewUrls is only set inside this effect, so we can safely ignore the warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialExisting, initialNewFiles]);

  const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const added: GalleryItem[] = [];
    const newPrevs: string[] = [];

    Array.from(files).forEach((f) => {
      if (!allowedTypes.includes(f.type)) {
        showError(`Invalid file type for ${f.name}. Only JPEG, PNG, GIF, or WEBP allowed.`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        showError(`File ${f.name} is too large. Must be less than 5MB.`);
        return;
      }
      const purl = URL.createObjectURL(f);
      newPrevs.push(purl);
      added.push({ url: purl, key: `new_${f.name}_${Math.random()}`, file: f });
    });

    if (added.length > 0) {
      setImages((prev) => [...prev, ...added]);
      setPreviewUrls((prev) => [...prev, ...newPrevs]);
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
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col md:max-w-[630px]!"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3 flex items-center justify-start gap-x-2">
              <h2>Manage Gallery</h2>

              <div className="">
                <Button className="h-7 w-8 rounded-full p-0" onClick={() => fileInputRef.current?.click()}>
                  <Plus />
                </Button>
                <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={handleAdd} />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
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

        {/* Fixed footer */}
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

export default AddOtherDetailsModal;
