'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomCreatableDropdown from '@/components/rhf/rhf-custom-create-dropdown';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import FieldSkeleton from '@/components/ui/field-skeleton';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetAllCompanyPresetsQuery, useGetAllOrganizerMenuQuery } from '@/store/Reducer/helpers-api';
import { useGetItemsCategoryQuery } from '@/store/Reducer/items-category-api';
import { useAddMenuItemMutation, useUpdateMenuItemMutation } from '@/store/Reducer/menu-items-api';
import { useGetMenuByCompanyQuery } from '@/store/Reducer/menu-list-api';
import { useGetPresetMenuQuery } from '@/store/Reducer/preset-menu-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { formatTimeTo12Hour } from '@/utils/short-utils';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// Utility function to convert hh:mm A to HH:mm
const parse12HourTo24Hour = (time: string | null | undefined): string => {
  if (!time) return '';
  const [timePart, period] = time.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  const formattedHour = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
  return `${formattedHour.toString().padStart(2, '0')}:${minutes?.toString().padStart(2, '0')}`;
};

type MenuItemFormValues = {
  image?: any;
  title: string;
  type: string;
  category: string;
  menu: string;
  taxPercent: string;
  basePrice: string;
  discountPrice?: string;
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
  menuManagementView?: boolean;
  userType?: any;
  showDiscountPrice?: boolean;
  onSuccess?: () => void;
};

const defaultValues: MenuItemFormValues = {
  image: '',
  title: '',
  type: '',
  category: '',
  menu: '',
  taxPercent: '',
  basePrice: '',
  discountPrice: '',
  description: '',
  preset: '',
  startTime: '',
  endTime: '',
  status: '',
};

const schema: Yup.ObjectSchema<MenuItemFormValues> = Yup.object({
  image: Yup.mixed().nullable(),
  preset: Yup.string(),
  title: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  category: Yup.string().required('Item category is required'),
  basePrice: Yup.string()
    .required('Base price is required')
    .test('is-integer', 'Base price must be a whole number', (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num) && num >= 1;
    }),
  discountPrice: Yup.string()
    .optional()
    .test('is-integer', 'Discount price must be a whole number', (value) => {
      if (!value || value === '') return true;
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num);
    })
    .test('min-value', 'Discount price must be at least 0', (value) => {
      if (!value || value === '') return true;
      return Number(value) >= 0;
    })
    .test('less-than-base', 'Discount price must be less than base price', function (value) {
      if (!value || value === '' || Number(value) === 0) return true;
      const { basePrice } = this.parent;
      if (!basePrice) return true;
      return Number(value) < Number(basePrice);
    }),
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
  userType,
  selectedData,
  menuManagementView,
  showDiscountPrice = false,
  onSuccess,
}: MenuItemModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [addMenuItem, { isLoading: addMenuItemLoading }] = useAddMenuItemMutation();
  const [updateMenuItem, { isLoading: updateMenuItemLoading }] = useUpdateMenuItemMutation();

  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || 'null');

  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // PRESET DATA --------------------------------
  const { data: presetData, isLoading: presetLoading } = useGetPresetMenuQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
    },
    {
      skip: userType === 'organizer',
    }
  );

  const { data: orgPresetData, isLoading: orgPresetLoading } = useGetAllCompanyPresetsQuery(
    {
      page: 0,
      search: '',
      limit: '100',
    },
    {
      skip: userType === 'super-admin',
    }
  );

  const presetOptions =
    (userType === 'organizer' ? orgPresetData?.data : presetData?.data)?.map((preset: any) => ({
      label: preset?.title,
      value: preset?._id,
    })) || [];

  // ITEM CATEGORY DATA --------------------------------
  const { data: itemCategoryData, isLoading: itemCategoryLoading } = useGetItemsCategoryQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
    companyOrganizer: selectedCompany?.value || undefined,
  });

  const itemCategoryOptions =
    itemCategoryData?.data?.map((category: any) => ({
      label: category?.title,
      value: category?._id,
    })) || [];

  // MENU DATA --------------------------------
  const { data: menuData, isLoading: menuLoading } = useGetMenuByCompanyQuery(
    {
      companyOrganizer: selectedCompany?.value || undefined,
    },
    {
      skip: userType === 'organizer',
    }
  );

  const { data: orgMenuData, isLoading: orgMenuLoading } = useGetAllOrganizerMenuQuery(
    {
      page: 0,
      search: '',
      limit: '100',
    },
    {
      skip: userType === 'super-admin',
    }
  );

  const menuOptions =
    (userType === 'organizer' ? orgMenuData?.data : menuData?.data)?.map((menu: any) => ({
      label: menu?.title,
      value: menu?._id,
    })) || [];

  const { reset, formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;
  const selectedPreset = watch('preset');

  useEffect(() => {
    if (isEdit && selectedData) {
      reset({
        image: (() => {
          const img = selectedData?.imageInfo?.url;
          if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
            return '';
          }
          return img;
        })(),
        title: selectedData.title || '',
        type: selectedData.type || '',
        category: selectedData.category?._id || '',
        menu: selectedData.menu?._id || '',
        taxPercent: selectedData.taxPercent?.toString() || '',
        basePrice: selectedData.basePrice?.toString() || '',
        discountPrice: selectedData.discountPrice !== undefined && selectedData.discountPrice !== null ? selectedData.discountPrice.toString() : '',
        description: selectedData.description || '',
        preset: selectedData.preset?._id || '',
        startTime: selectedData.startTime ? parse12HourTo24Hour(selectedData.startTime) : '',
        endTime: selectedData.endTime ? parse12HourTo24Hour(selectedData.endTime) : '',
        status: selectedData.status || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [isEdit, selectedData, reset]);

  useEffect(() => {
    // Use correct preset data based on userType
    const presetSource = userType === 'organizer' ? orgPresetData?.data : presetData?.data;
    if (selectedPreset && presetSource) {
      const selectedPresetData = presetSource.find((preset: any) => preset._id === selectedPreset);
      if (selectedPresetData) {
        setValue('title', selectedPresetData.title || '');
        setValue('basePrice', selectedPresetData.basePrice || '');
        setValue('description', selectedPresetData.description || '');
        setValue('category', selectedPresetData.category?._id || '');
        setValue('image', selectedPresetData.imageInfo?.url || selectedPresetData.image || '');
      }
    }
  }, [selectedPreset, presetData, setValue]);

  const isValidTime = (time?: string) => {
    if (!time) return false;
    const [h, m] = time.split(':');
    return !isNaN(Number(h)) && !isNaN(Number(m));
  };

  const handleSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;

    const hasValidStart = isValidTime(formData.startTime);
    const hasValidEnd = isValidTime(formData.endTime);

    if (hasValidStart && hasValidEnd && formData.startTime === formData.endTime) {
      showError('End time must be different from start time.');
      return;
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
        taxPercent: Number(formData.taxPercent),
        type: formData.type,
        category: formData.category,
        menu: formData.menu,
      };

      // Add discountPrice only when showDiscountPrice prop is true
      if (showDiscountPrice && formData.discountPrice !== undefined && formData.discountPrice !== '') {
        payload.discountPrice = Number(formData.discountPrice);
      }

      // only add times if valid
      if (hasValidStart) {
        payload.startTime = formatTimeTo12Hour(formData.startTime);
      }

      if (hasValidEnd) {
        payload.endTime = formatTimeTo12Hour(formData.endTime);
      }

      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      } else if (formData?.image && typeof formData.image === 'string') {
        // Extract filename from preset image URL
        payload.image = formData.image.split('/').pop();
      }

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response = isEdit && selectedData ? await updateMenuItem(payload).unwrap() : await addMenuItem(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Menu item updated successfully' : 'Menu item created successfully'));

      methods.reset(defaultValues);
      onSuccess?.();
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Menu Item' : menuManagementView ? 'Add Menu Item' : 'Create Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFUploadAvatar
                  name="image"
                  label="Image"
                  initialImage={(() => {
                    const img = selectedData?.image;
                    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
                      return null;
                    }
                    return img;
                  })()}
                />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {!menuManagementView && (
                    <div className="col-span-2">
                      {presetLoading || orgPresetLoading ? (
                        <FieldSkeleton />
                      ) : (
                        <>
                          <h4 className="mb-2 text-sm font-semibold">Presets</h4>
                          <RHFCustomDropdown
                            name="preset"
                            placeholder="Select Preset"
                            options={presetOptions}
                            isLoading={presetLoading || orgPresetLoading}
                            showNone={false}
                          />
                        </>
                      )}
                    </div>
                  )}

                  <RHFTextField name="title" label="Name" placeholder="Enter Name" />

                  {itemCategoryLoading ? (
                    <FieldSkeleton />
                  ) : (
                    <RHFCustomCreatableDropdown
                      name="category"
                      label="Item Category"
                      placeholder="Select Item Category"
                      options={itemCategoryOptions}
                      isLoading={itemCategoryLoading}
                      showNone={false}
                    />
                  )}

                  <RHFTextField name="type" label="Type" placeholder="Enter Type" />

                  <RHFTextField name="basePrice" label="Base Price" type="number" placeholder="Enter Base Price" step="1" min="1" />

                  {showDiscountPrice && (
                    <RHFTextField
                      name="discountPrice"
                      label="Discount Price (Optional)"
                      type="number"
                      placeholder="Enter Discount Price"
                      step="1"
                      min="0"
                    />
                  )}

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

                  {/* <div className="col-span-2"> */}
                  {menuLoading || orgMenuLoading ? (
                    <FieldSkeleton />
                  ) : (
                    <RHFCustomDropdown
                      name="menu"
                      label="Select Menu"
                      placeholder="Select Menu"
                      options={menuOptions}
                      isLoading={menuLoading || orgMenuLoading}
                      showNone={false}
                    />
                  )}
                  {/* </div> */}
                </div>

                {/* Description */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="description" label="Description" placeholder="Enter Description" multiline rows={2} />
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
                  <RHFTextField name="startTime" label="Start Time (Optional)" placeholder="Enter Start Time" type="time" />
                  <RHFTextField name="endTime" label="End Time (Optional)" placeholder="Enter End Time" type="time" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {addMenuItemLoading || updateMenuItemLoading || imageUploading || deleting ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Menu Item' : menuManagementView ? 'Add Menu Item' : 'Create Menu Item'}
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
