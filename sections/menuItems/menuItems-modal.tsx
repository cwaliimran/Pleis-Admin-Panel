'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomCreatableDropdown from '@/components/rhf/rhf-custom-create-dropdown';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetItemsCategoryQuery } from '@/store/Reducer/items-category-api';
import {
  useAddMenuItemMutation,
  useUpdateMenuItemMutation,
} from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetPresetMenuQuery } from '@/store/Reducer/preset-menu-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { formatTimeTo12Hour } from '@/utils/short-utils';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// Utility function to convert hh:mm A to HH:mm
const parse12HourTo24Hour = (
  time: string | null | undefined
): string | null => {
  if (!time) return null;
  const [timePart, period] = time.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  const formattedHour =
    period === 'PM' && hours !== 12
      ? hours + 12
      : period === 'AM' && hours === 12
        ? 0
        : hours;
  return `${formattedHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

type MenuItemFormValues = {
  image?: any;
  title: string;
  type: string;
  category: string;
  menu: string;
  taxPercent: string;
  basePrice: string;
  discountPrice: string | null;
  description: string;
  preset?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
};

type MenuItemModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};

const defaultValues: MenuItemFormValues = {
  image: null,
  title: '',
  type: '',
  category: '',
  menu: '',
  taxPercent: '',
  basePrice: '',
  discountPrice: '',
  description: '',
  preset: '',
  startTime: '12:00',
  endTime: '12:00',
  status: '',
};

const schema: Yup.ObjectSchema<MenuItemFormValues> = Yup.object({
  image: Yup.mixed().nullable(),
  preset: Yup.string(),
  title: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  category: Yup.string().required('Item category is required'),
  basePrice: Yup.string().required('Base price is required'),
  discountPrice: Yup.string().nullable().default(''),
  taxPercent: Yup.string().required('Tax is required'),
  menu: Yup.string().required('Menu is required'),
  description: Yup.string().required('Description is required'),
  startTime: Yup.string().optional(),
  endTime: Yup.string().optional(),
  status: Yup.string(),
});

const MenuItemModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: MenuItemModalProps) => {
  console.log('selectedData', selectedData);
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [deleting, setDeleting] = useState(false);

  const [addMenuItem, { isLoading: addMenuItemLoading }] =
    useAddMenuItemMutation();

  const [updateMenuItem, { isLoading: updateMenuItemLoading }] =
    useUpdateMenuItemMutation();

  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { data: presetData, isLoading: presetLoading } = useGetPresetMenuQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const { data: itemCategoryData, isLoading: itemCategoryLoading } =
    useGetItemsCategoryQuery({
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
    });

  const { data: menuData, isLoading: menuLoading } = useGetMenuListQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const presetOptions =
    presetData?.data?.map((preset: any) => ({
      label: preset?.title,
      value: preset?._id,
    })) || [];

  const itemCategoryOptions =
    itemCategoryData?.data?.map((category: any) => ({
      label: category?.title,
      value: category?._id,
    })) || [];

  const menuOptions =
    menuData?.data?.map((menu: any) => ({
      label: menu?.title,
      value: menu?._id,
    })) || [];

  const { reset, formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;
  const errors = formState?.errors;
  console.log('errors', errors);
  const selectedPreset = watch('preset');

  useEffect(() => {
    if (isEdit && selectedData) {
      reset({
        image: (() => {
          const img = selectedData?.imageInfo?.url;
          if (
            !img ||
            img === noImageUrl ||
            img === noImageUrlDev ||
            img.toLowerCase().includes('noimage.png')
          ) {
            return null;
          }
          return img;
        })(),
        title: selectedData.title || '',
        type: selectedData.type || '',
        category: selectedData.category?._id || '',
        menu: selectedData.menu?._id || '',
        taxPercent: selectedData.taxPercent?.toString() || '',
        basePrice: selectedData.basePrice?.toString() || '',
        discountPrice: selectedData.discountPrice?.toString() || null,
        description: selectedData.description || '',
        preset: selectedData.preset?._id || '',
        startTime: parse12HourTo24Hour(selectedData.startTime) || '',
        endTime: parse12HourTo24Hour(selectedData.endTime) || '',
        status: selectedData.status || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [isEdit, selectedData, reset]);

  useEffect(() => {
    if (selectedPreset && presetData?.data) {
      const selectedPresetData = presetData.data.find(
        (preset: any) => preset._id === selectedPreset
      );
      if (selectedPresetData) {
        setValue('title', selectedPresetData.title || '');
        setValue('basePrice', selectedPresetData.basePrice || '');
        setValue('description', selectedPresetData.description || '');
      }
    }
  }, [selectedPreset, presetData, setValue]);

  const handleSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;

    if (Number(formData.discountPrice) > Number(formData.basePrice)) {
      showError('Discount price must be less than base price.');
      return;
    }

    if (formData.startTime && formData.endTime) {
      const start = parse12HourTo24Hour(formData.startTime);
      const end = parse12HourTo24Hour(formData.endTime);

      if (start && end && start >= end) {
        showError('End time must be after start time.');
        return;
      }
    }

    try {
      if (formData?.image instanceof FileList && formData?.image.length > 0) {
        const file = formData.image[0];
        uploadedFileKey = await uploadImage(file);
      }

      const payload: any = {
        title: formData.title,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : null,
        taxPercent: Number(formData.taxPercent),
        type: formData.type,
        category: formData.category,
        menu: formData.menu,
        startTime: formatTimeTo12Hour(formData.startTime),
        endTime: formatTimeTo12Hour(formData.endTime),
      };

      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      }

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response =
        isEdit && selectedData
          ? await updateMenuItem(payload).unwrap()
          : await addMenuItem(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(
        response?.message ||
          (isEdit
            ? 'Menu item updated successfully'
            : 'Menu item created successfully')
      );

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      if (uploadedFileKey) {
        setDeleting(true);
        try {
          await deleteFileFromAzure(uploadedFileKey);
        } finally {
          setDeleting(false);
        }
      }

      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[600px]"
        >
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Menu Item' : 'Create Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                {/* <RHFUploadAvatar name="image" label="Item Image" /> */}
                <RHFUploadAvatar
                  name="image"
                  label="Profile Image"
                  initialImage={(() => {
                    const img = selectedData?.imageInfo?.url;
                    if (
                      !img ||
                      img === noImageUrl ||
                      img === noImageUrlDev ||
                      img.toLowerCase().includes('noimage.png')
                    ) {
                      return null;
                    }
                    return img;
                  })()}
                />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    {presetLoading ? (
                      <div className="mt-2 w-full space-y-2 md:w-[100%]">
                        <Skeleton className="ml-1 h-[12px] w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                        <Skeleton className="h-[32px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                      </div>
                    ) : (
                      <>
                        <h4 className="mb-2 text-sm font-semibold">Presets</h4>
                        <RHFCustomDropdown
                          name="preset"
                          placeholder="Select Preset"
                          options={presetOptions}
                          isLoading={presetLoading}
                          showNone={false}
                        />
                      </>
                    )}
                  </div>

                  <RHFTextField
                    name="title"
                    label="Name"
                    placeholder="Enter Name"
                  />
                  <RHFTextField
                    name="type"
                    label="Type"
                    placeholder="Enter Type"
                  />

                  {itemCategoryLoading ? (
                    <div className="mt-2 w-full space-y-2 md:w-[100%]">
                      <Skeleton className="ml-1 h-[12px] w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                      <Skeleton className="h-[32px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                    </div>
                  ) : (
                    // <RHFCustomDropdown
                    //   name="category"
                    //   label="Item Category"
                    //   placeholder="Select Item Category"
                    //   options={itemCategoryOptions}
                    //   isLoading={itemCategoryLoading}
                    //   showNone={false}
                    // />
                    <RHFCustomCreatableDropdown
                      name="category"
                      label="Item Category"
                      placeholder="Select Item Category"
                      options={itemCategoryOptions}
                      isLoading={itemCategoryLoading}
                      showNone={false}
                    />
                  )}

                  <RHFTextField
                    name="basePrice"
                    label="Base Price"
                    type="number"
                    placeholder="Enter Base Price"
                  />

                  <RHFTextField
                    name="discountPrice"
                    label="Discount Price"
                    type="number"
                    placeholder="Enter Discount Price"
                  />

                  <RHFSelectField
                    name="taxPercent"
                    label="Tax %"
                    placeholder="Select Tax %"
                    className="w-full flex-1"
                    options={[
                      { value: '0', label: '0%' },
                      { value: '5', label: '5%' },
                      { value: '13', label: '13%' },
                      { value: '25', label: '25%' },
                    ]}
                  />

                  <div className="col-span-2">
                    {menuLoading ? (
                      <div className="mt-2 w-full space-y-2 md:w-[100%]">
                        <Skeleton className="ml-1 h-[12px] w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                        <Skeleton className="h-[32px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                      </div>
                    ) : (
                      <RHFCustomDropdown
                        name="menu"
                        label="Select Menu"
                        placeholder="Select Menu"
                        options={menuOptions}
                        isLoading={menuLoading}
                        showNone={false}
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    multiline
                    rows={2}
                  />
                </div>

                {isEdit && (
                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                )}

                {/* Time Fields */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="startTime"
                    label="Start Time (Optional)"
                    placeholder="Enter Start Time"
                    type="time"
                  />
                  <RHFTextField
                    name="endTime"
                    label="End Time (Optional)"
                    placeholder="Enter End Time"
                    type="time"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {addMenuItemLoading ||
                  updateMenuItemLoading ||
                  imageUploading ||
                  deleting ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                    >
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Menu Item' : 'Create Menu Item'}
                    </Button>
                  )}
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default MenuItemModal;
