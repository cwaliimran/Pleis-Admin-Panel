import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import FormProvider, {
  RHFCombobox,
  RHFMultiFileUpload,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FieldValues } from 'react-hook-form';
import * as Yup from 'yup';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showSuccess, showError } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import { useUpdateOrganizationMutation } from '@/store/Reducer/organization';

// Define TypeScript interfaces
interface OperatingHours {
  from: string;
  to: string;
  break: { from: string; to: string };
  isOpen: string; // String to match RHFSelectField values
}

interface Location {
  address: string;
  coordinates: [number, number];
}

interface FormValues extends FieldValues {
  description: string;
  minAge: number | null;
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
  minAge: null,
  tags: [],
  categories: [],
  galleryImages: [],
  venue: '',
  monday: {
    from: '00:00',
    to: '00:00',
    break: { from: '00:00', to: '00:00' },
    isOpen: 'false',
  },
  tuesday: {
    from: '00:00',
    to: '00:00',
    break: { from: '00:00', to: '00:00' },
    isOpen: 'false',
  },
  wednesday: {
    from: '00:00',
    to: '00:00',
    break: { from: '00:00', to: '00:00' },
    isOpen: 'false',
  },
  thursday: {
    from: '00:00',
    to: '00:00',
    break: { from: '00:00', to: '00:00' },
    isOpen: 'false',
  },
  friday: {
    from: '00:00',
    to: '00:00',
    break: { from: '00:00', to: '00:00' },
    isOpen: 'false',
  },
  saturday: {
    from: '00:00',
    to: '00:00',
    break: { from: '00:00', to: '00:00' },
    isOpen: 'false',
  },
  sunday: { from: '', to: '', break: { from: '', to: '' }, isOpen: 'true' },
  status: 'active',
  location: { address: '', coordinates: [0, 0] },
};

const schema = Yup.object().shape({
  description: Yup.string()
    .required('Description is required')
    .max(500, 'Description must be at most 500 characters'),
  minAge: Yup.number()
    .nullable()
    .min(0, 'Age cannot be negative')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
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
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  tuesday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  wednesday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  thursday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  friday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  saturday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  sunday: Yup.object().shape({
    from: Yup.string().required('Required'),
    to: Yup.string().required('Required'),
    break: Yup.object().shape({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
    }),
    isOpen: Yup.string().oneOf(['true', 'false'], 'Invalid option').required(),
  }),
  status: Yup.string().required('Status is required'),
  location: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    coordinates: Yup.array()
      .of(Yup.number())
      .length(2, 'Coordinates must be an array of 2 numbers'),
  }),
});

interface AddOtherDetailsModalProps {
  newOrganization?: any;
  onClose: () => void;
  open: boolean;
  onSubmitSuccess: (data: any) => void;
}

const AddOtherDetailsModal: React.FC<AddOtherDetailsModalProps> = ({
  newOrganization,
  onClose,
  open,
  onSubmitSuccess,
}) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any, // Type assertion due to complex schema
    defaultValues: newOrganization?.otherInfo
      ? {
          ...defaultValues,
          description: newOrganization.otherInfo.description || '',
          minAge: newOrganization.otherInfo.minAge || null,
          tags: newOrganization.otherInfo.tags || [],
          categories: newOrganization.otherInfo.categories || [],
          venue: newOrganization.venue || '',
          monday: {
            ...defaultValues.monday,
            ...newOrganization.operatingHours?.monday,
          },
          tuesday: {
            ...defaultValues.tuesday,
            ...newOrganization.operatingHours?.tuesday,
          },
          wednesday: {
            ...defaultValues.wednesday,
            ...newOrganization.operatingHours?.wednesday,
          },
          thursday: {
            ...defaultValues.thursday,
            ...newOrganization.operatingHours?.thursday,
          },
          friday: {
            ...defaultValues.friday,
            ...newOrganization.operatingHours?.friday,
          },
          saturday: {
            ...defaultValues.saturday,
            ...newOrganization.operatingHours?.saturday,
          },
          sunday: {
            ...defaultValues.sunday,
            ...newOrganization.operatingHours?.sunday,
          },
          status: newOrganization.status || 'active',
          location: newOrganization.location || defaultValues.location,
        }
      : defaultValues,
  });

  const { handleSubmit, reset, setValue } = methods;

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
        // Clear galleryImages after upload to prevent resubmission
        setValue('galleryImages', []);
      }

      const operatingHours = {
        monday:
          formData.monday.isOpen === 'true'
            ? formData.monday
            : { ...defaultValues.monday, isOpen: 'false' },
        tuesday:
          formData.tuesday.isOpen === 'true'
            ? formData.tuesday
            : { ...defaultValues.tuesday, isOpen: 'false' },
        wednesday:
          formData.wednesday.isOpen === 'true'
            ? formData.wednesday
            : { ...defaultValues.wednesday, isOpen: 'false' },
        thursday:
          formData.thursday.isOpen === 'true'
            ? formData.thursday
            : { ...defaultValues.thursday, isOpen: 'false' },
        friday:
          formData.friday.isOpen === 'true'
            ? formData.friday
            : { ...defaultValues.friday, isOpen: 'false' },
        saturday:
          formData.saturday.isOpen === 'true'
            ? formData.saturday
            : { ...defaultValues.saturday, isOpen: 'false' },
        sunday:
          formData.sunday.isOpen === 'true'
            ? formData.sunday
            : { ...defaultValues.sunday, isOpen: 'true' },
      };

      const payload = {
        otherInfo: {
          description: formData.description,
          minAge: formData.minAge,
          tags: formData.tags,
          categories: formData.categories,
          galleryMedia,
        },
        operatingHours,
        status: formData.status,
        venue: formData.venue,
        location: {
          address: formData.location.address,
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

      if (response?.data) {
        onSubmitSuccess(response.data);
        showSuccess('Details updated successfully');
      }

      if (response?.error) {
        throw new Error(getErrorMessage(response.error));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to update details:', errorMessage);
      showError(errorMessage);
      if (galleryMedia.length > 0) {
        await Promise.all(
          galleryMedia.map((file) => deleteFileFromAzure(file))
        );
      }
    } finally {
      setImageUploading(false);
      onClose();
      reset();
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
                  type="number"
                  name="minAge"
                  label="Age (optional)"
                  placeholder="Min Age 5"
                  min={5}
                />
              </div>

              <div className="grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-1">
                <RHFCombobox
                  name="tags"
                  label="Tags"
                  placeholder="Select or add tags"
                  className="w-full flex-1"
                  multiple={true}
                  allowCustom={true}
                  options={[
                    { label: 'Tag 1', value: '68822a624ebf07788604301b' },
                    { label: 'Tag 2', value: '68b294c4a09f4da7cdf23d47' },
                  ]}
                />

                <RHFSelectField
                  name="venue"
                  label="Venue"
                  placeholder="Select Venue"
                  className="w-full flex-1"
                  options={[
                    { label: 'Venue 1', value: '68b2a8c62e76b4cdac8be34d' },
                  ]}
                />

                <RHFMultiSelect
                  name="categories"
                  label="Select Categories"
                  placeholder="Select Category"
                  options={[
                    { label: 'Clubbing', value: '64f7206e442c7dfc4aa00002' },
                  ]}
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
                <div className="space-y-4">
                  {[
                    { day: 'Monday', dayKey: 'monday' },
                    { day: 'Tuesday', dayKey: 'tuesday' },
                    { day: 'Wednesday', dayKey: 'wednesday' },
                    { day: 'Thursday', dayKey: 'thursday' },
                    { day: 'Friday', dayKey: 'friday' },
                    { day: 'Saturday', dayKey: 'saturday' },
                    { day: 'Sunday', dayKey: 'sunday' },
                  ].map((dayInfo) => (
                    <div
                      key={dayInfo.dayKey}
                      className="flex items-center gap-4"
                    >
                      <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dayInfo.day}
                      </span>
                      <div className="flex flex-1 items-center gap-2">
                        <RHFTextField
                          type="time"
                          name={`${dayInfo.dayKey}.from`}
                          placeholder="09:00"
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <RHFTextField
                          type="time"
                          name={`${dayInfo.dayKey}.to`}
                          placeholder="23:00"
                          className="flex-1"
                        />
                        <RHFTextField
                          type="time"
                          name={`${dayInfo.dayKey}.break.from`}
                          placeholder="13:00"
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <RHFTextField
                          type="time"
                          name={`${dayInfo.dayKey}.break.to`}
                          placeholder="14:00"
                          className="flex-1"
                        />
                        <RHFSelectField
                          name={`${dayInfo.dayKey}.isOpen`}
                          className="flex-1"
                          options={[
                            { label: 'Open', value: 'true' },
                            { label: 'Closed', value: 'false' },
                          ]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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

              <RHFTextField
                name="location.address"
                label="Location Address"
                placeholder="Enter Location Address"
              />
            </div>

            <div className="mt-2 flex w-full items-center justify-center">
              <Button
                type="submit"
                className="mt-3 cursor-pointer bg-blue-700 px-7 text-white hover:bg-blue-800"
                disabled={isLoading || imageUploading}
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
