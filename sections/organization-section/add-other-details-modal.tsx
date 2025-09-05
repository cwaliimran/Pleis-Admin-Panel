import GoogleLocationInput from '@/components/common/location-input';
import FormProvider, {
  RHFMultiFileUpload,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useUpdateOrganizationMutation } from '@/store/Reducer/organization';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
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
  galleryImages: FileList | File[];
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
  description: Yup.string()
    .required('Description is required')
    .max(500, 'Description must be at most 500 characters'),
  minAge: Yup.string(),
  tags: Yup.array().of(Yup.string()).min(0).max(10, 'Maximum 10 tags allowed'),
  categories: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one category is required')
    .max(5, 'Maximum 5 categories allowed'),
  galleryImages: Yup.mixed().nullable(),
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
    coordinates: Yup.array()
      .of(Yup.number())
      .length(2, 'Coordinates must be an array of 2 numbers'),
  }),
});

interface AddOtherDetailsModalProps {
  newOrganization?: any;
  onClose: () => void;
  open: boolean;
}

const AddOtherDetailsModal: React.FC<AddOtherDetailsModalProps> = ({
  newOrganization,
  onClose,
  open,
}) => {
  const router = useRouter();
  const [imageUploading, setImageUploading] = useState(false);
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  // console.log('Other Details Page', newOrganization);

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
      value: tag?._id,
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

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: newOrganization?.otherInfo
      ? {
          ...defaultValues,
          description: newOrganization.otherInfo.description || '',
          minAge: String(newOrganization.otherInfo.minAge ?? ''),
          tags:
            newOrganization.otherInfo.tags?.map((tag: any) => tag._id) || [],
          categories:
            newOrganization.otherInfo.categories?.map((cat: any) => cat._id) ||
            [],
          venue: newOrganization.venue?._id || '',
          monday: {
            from: newOrganization.operatingHours?.monday?.from || '00:00',
            to: newOrganization.operatingHours?.monday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.monday?.isOpen
              ? 'true'
              : 'false',
          },
          tuesday: {
            from: newOrganization.operatingHours?.tuesday?.from || '00:00',
            to: newOrganization.operatingHours?.tuesday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.tuesday?.isOpen
              ? 'true'
              : 'false',
          },
          wednesday: {
            from: newOrganization.operatingHours?.wednesday?.from || '00:00',
            to: newOrganization.operatingHours?.wednesday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.wednesday?.isOpen
              ? 'true'
              : 'false',
          },
          thursday: {
            from: newOrganization.operatingHours?.thursday?.from || '00:00',
            to: newOrganization.operatingHours?.thursday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.thursday?.isOpen
              ? 'true'
              : 'false',
          },
          friday: {
            from: newOrganization.operatingHours?.friday?.from || '00:00',
            to: newOrganization.operatingHours?.friday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.friday?.isOpen
              ? 'true'
              : 'false',
          },
          saturday: {
            from: newOrganization.operatingHours?.saturday?.from || '00:00',
            to: newOrganization.operatingHours?.saturday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.saturday?.isOpen
              ? 'true'
              : 'false',
          },
          sunday: {
            from: newOrganization.operatingHours?.sunday?.from || '00:00',
            to: newOrganization.operatingHours?.sunday?.to || '00:00',
            isOpen: newOrganization.operatingHours?.sunday?.isOpen
              ? 'true'
              : 'false',
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

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  console.log('errors', errors);

  const handleImageUpload = async (
    files: FileList | File[]
  ): Promise<string[]> => {
    const uploadPromises = Array.from(files).map(async (file) => {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        throw new Error('Only JPEG, PNG, or GIF images are allowed.');
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
    setImageUploading(true);
    let galleryMedia: string[] = [];

    try {
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        galleryMedia = await handleImageUpload(formData.galleryImages);
        setValue('galleryImages', []);
      }

      const operatingHours = {
        monday:
          formData.monday.isOpen === 'true'
            ? { ...formData.monday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
        tuesday:
          formData.tuesday.isOpen === 'true'
            ? { ...formData.tuesday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
        wednesday:
          formData.wednesday.isOpen === 'true'
            ? { ...formData.wednesday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
        thursday:
          formData.thursday.isOpen === 'true'
            ? { ...formData.thursday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
        friday:
          formData.friday.isOpen === 'true'
            ? { ...formData.friday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
        saturday:
          formData.saturday.isOpen === 'true'
            ? { ...formData.saturday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
        sunday:
          formData.sunday.isOpen === 'true'
            ? { ...formData.sunday, isOpen: true }
            : { from: '00:00', to: '00:00', isOpen: false },
      };

      const payload = {
        otherInfo: {
          description: formData.description,
          minAge: formData.minAge ? Number(formData.minAge) : undefined,
          tags: formData.tags,
          categories: formData.categories,
          galleryMedia,
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

      // console.log('payload', payload);

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

      if (response?.message) {
        showSuccess(response?.message || 'Details updated successfully');
      }

      setImageUploading(false);
      reset();
      onClose();

      router.push('/super-admin/organization/organization-list');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to update details:', errorMessage);

      showError(errorMessage);
      if (galleryMedia.length > 0) {
        await Promise.all(
          galleryMedia.map((file) => deleteFileFromAzure(file))
        );
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[630px]"
      >
        <DialogHeader>
          <DialogTitle>Add Other Details</DialogTitle>
        </DialogHeader>
        <div className="w-full px-4">
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex w-full flex-col gap-4">
              <RHFTextField
                name="description"
                label="Description"
                placeholder="Enter Description"
                rows={2}
                multiline
              />

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <RHFTextField
                  name="minAge"
                  label="Age (optional)"
                  placeholder="Min Age 5"
                />
              </div>

              <div className="grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-1">
                {/* <RHFCombobox
                  name="tags"
                  label="Tags"
                  placeholder="Select or add tags"
                  className="w-full flex-1"
                  multiple={true}
                  allowCustom={true}
                  options={tagOptions}
                /> */}

                {/* <RHFMultiSelect
                  name="tags"
                  label="Select Tags"
                  placeholder="Select Tag"
                  options={tagOptions}
                /> */}

                <RHFCustomDropdown
                  name="venue"
                  label="Venue"
                  placeholder="Select Venue"
                  options={venueOptions}
                  isLoading={venueLoading}
                />

                {/* <RHFMultiSelect
                  name="categories"
                  label="Select Categories"
                  placeholder="Select Category"
                  options={categoryOptions}
                /> */}

                {/* <RHFCustomMultiSelect
                  name="categories"
                  label="Select Categories"
                  options={categoryOptions}
                  placeholder="Choose categories..."
                /> */}

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
                <RHFMultiFileUpload
                  name="galleryImages"
                  label="Upload Gallery Images"
                />
              </div>

              <div className="w-full">
                <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Operating Hours
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-[#272727]">
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Day
                        </th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Opening
                        </th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Closing
                        </th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </th>
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
                        <tr
                          key={dayInfo.dayKey}
                          className="border-t dark:border-gray-700"
                        >
                          <td className="p-2 text-sm text-gray-700 dark:text-gray-300">
                            {dayInfo.day}
                          </td>
                          <td className="p-2">
                            <RHFTextField
                              type="time"
                              name={`${dayInfo.dayKey}.from`}
                              placeholder="09:00"
                              className="w-full rounded border p-1"
                            />
                          </td>
                          <td className="p-2">
                            <RHFTextField
                              type="time"
                              name={`${dayInfo.dayKey}.to`}
                              placeholder="23:00"
                              className="w-full rounded border p-1"
                            />
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

              <GoogleLocationInput name="location" label="Location" />

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
                disabled={
                  isLoading || imageUploading || !methods.formState.isValid
                }
              >
                {isLoading || imageUploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOtherDetailsModal;
