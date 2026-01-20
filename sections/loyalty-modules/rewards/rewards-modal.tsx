'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import FieldSkeleton from '@/components/ui/field-skeleton';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useGetLevelStatusQuery } from '@/store/Reducer/level-status-api';
import { useGetMenuItemByMenuIdQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useAddRewardMutation, useUpdateRewardMutation } from '@/store/Reducer/rewards-api';
import { useGetTiersQuery } from '@/store/Reducer/tiers-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import RewardCalculatorFields from './reward-calculation-fields';

type RewardFormValues = {
  image: null;
  title: string;
  sortingType: string;
  minPointsRequiredToClaim: string;
  claimLimit: string;
  tierLimit: string;
  description: string;
  rewardType: string;
  percentOff: string;
  menu: string;
  menuItem: string;
  event: string;
  endDate: string | Date;
  status: string;
  companyOrganizer: string;
};

type RewardFormModalProps = {
  open: boolean;
  onClose: () => void;
  global?: boolean;
  isEdit: boolean;
  selectedData?: any;
  selectedCompany?: any;
};

const schema = yup.object({
  image: yup.mixed().nullable(),
  title: yup.string().required('Reward name is required'),
  sortingType: yup.string().required('Type is required'),
  minPointsRequiredToClaim: yup
    .string()
    .required('Point value is required')
    .test('is-positive', 'Point value must be greater than 0', (value) => {
      return value ? Number(value) > 0 : false;
    }),
  claimLimit: yup.string().test('is-valid', 'Claim limit must be a positive number', (value) => {
    if (!value || value === '') return true;
    return Number(value) > 0;
  }),
  description: yup.string(),
  rewardType: yup.string().required('Creation method is required'),
  percentOff: yup.string().test('is-valid-percent', 'Must be between 0 and 100', (value) => {
    if (!value || value === '') return true;
    const num = Number(value);
    return num >= 0 && num <= 100;
  }),
  menu: yup.string(),
  tierLimit: yup.string().required('Tier limit is required'),
  menuItem: yup.string().when('rewardType', {
    is: 'buyMenuItemReward',
    then: (schema) => schema.required('Menu item is required'),
    otherwise: (schema) => schema,
  }),
  event: yup.string().when('rewardType', {
    is: 'ticketReward',
    then: (schema) => schema.required('Event is required'),
    otherwise: (schema) => schema,
  }),
  endDate: yup.mixed<string | Date>().required('End date is required'),
  status: yup.string(),
  companyOrganizer: yup.string(),
});

const RewardFormModal = ({ open, onClose, isEdit, global = false, selectedData, selectedCompany }: RewardFormModalProps) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [deleting, setDeleting] = useState(false);

  console.log('selectedData', selectedData);

  const [addReward, { isLoading: addRewardLoading }] = useAddRewardMutation();
  const [updateReward, { isLoading: updateRewardLoading }] = useUpdateRewardMutation();

  const defaultValues: RewardFormValues = {
    image: null,
    rewardType: `${global ? 'customReward' : 'buyMenuItemReward'}`,
    menu: '',
    menuItem: '',
    title: '',
    sortingType: '',
    minPointsRequiredToClaim: '',
    claimLimit: '',
    tierLimit: '',
    percentOff: '',
    description: '',
    event: '',
    endDate: '',
    status: '',
    companyOrganizer: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset } = methods;

  const rewardType = watch('rewardType');
  const percentOff = watch('percentOff');
  const selectedMenuId = watch('menu');

  const { data: tiersData, isLoading: tiersLoading } = useGetTiersQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
    },
    {
      skip: global,
    }
  );

  const { data: levelStatus, isLoading: levelStatusLoading } = useGetLevelStatusQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
    },
    {
      skip: !global,
    }
  );

  const { data: eventData, isLoading: isLoadingEvents } = useGeteventsQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const { data: menuData, isLoading: menuLoading } = useGetMenuListQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
    companyOrganizer: selectedCompany || undefined,
  });

  const { data: menuItemsData, isLoading: menuItemsLoading } = useGetMenuItemByMenuIdQuery(
    { menuId: selectedMenuId },
    { skip: !selectedMenuId || rewardType !== 'buyMenuItemReward' }
  );

  const tiersOptions =
    tiersData?.data?.map((preset: any) => ({
      label: preset?.title,
      value: preset?._id,
    })) || [];

  const levelStatusOptions =
    levelStatus?.data?.map((status: any) => ({
      label: status?.title,
      value: status?._id,
    })) || [];

  const eventOptions =
    eventData?.data?.map((preset: any) => ({
      label: preset?.basicInfo?.title,
      value: preset?._id,
    })) || [];

  const menuOptions =
    menuData?.data?.map((menu: any) => ({
      label: menu?.title,
      value: menu?._id,
    })) || [];

  const menuItemOptions =
    menuItemsData?.data?.map((menuItem: any) => ({
      label: menuItem?.title,
      value: menuItem?._id,
    })) || [];

  // Populate form when editing
  useEffect(() => {
    if (isEdit && selectedData && open) {
      const initialRewardType = global ? 'customReward' : 'buyMenuItemReward';
      reset({
        image: selectedData?.image || '',
        title: selectedData.title || '',
        sortingType: selectedData.sortingType || '',
        minPointsRequiredToClaim: selectedData.minPointsRequiredToClaim?.toString() || '',
        claimLimit: selectedData.claimLimit?.toString() || '',
        tierLimit: selectedData.tierLimit?._id || 'none',
        percentOff: selectedData.percentOff?.toString() || '',
        description: selectedData.description || '',
        rewardType: selectedData.rewardType || initialRewardType,
        menu: selectedData.menuItem?.menu?._id || '',
        menuItem: selectedData.menuItem?._id || '',
        event: selectedData.event?._id || selectedData.event || '',
        endDate: selectedData.endDate ? new Date(selectedData.endDate) : ('' as string | Date),
        status: selectedData.status || '',
        companyOrganizer: selectedData.companyOrganizer || '',
      });
    }
  }, [isEdit, selectedData, open, reset, global]);

  const handleSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;

    if (!selectedCompany && !global) {
      showError('Please select a company first before submitting the form');
      return;
    }

    if (!formData?.endDate) {
      showError('End date is required');
      return;
    }

    try {
      if (!formData?.image) {
        showError('Please upload an image');
        return;
      }

      if (formData?.image instanceof FileList && formData?.image.length > 0) {
        const file = formData.image[0];
        uploadedFileKey = await uploadImage(file);
      }

      // Build base payload
      const payload: any = {
        rewardType: formData.rewardType,
        title: formData.title,
        description: formData.description || '',
        sortingType: formData.sortingType,
        minPointsRequiredToClaim: Number(formData.minPointsRequiredToClaim),
        claimLimit: formData.claimLimit ? Number(formData.claimLimit) : undefined,
        percentOff: formData.percentOff ? Number(formData.percentOff) : 0,
        tierLimit: formData.tierLimit,
        endDate: fDate(formData.endDate, formatStr.paramCase.db),
      };

      // Only add companyOrganizer if not global
      if (!global) {
        payload.companyOrganizer = selectedCompany || '';
      }

      if (global) {
        payload.isGlobal = true;
      }

      // Add main image if uploaded
      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      } else if (!isEdit && selectedData?.image) {
        // Only send image in non-edit mode if it exists
        payload.image = selectedData.image;
      }

      // Add conditional fields based on rewardType
      if (formData.rewardType === 'buyMenuItemReward') {
        payload.menu = formData.menu;
        payload.menuItem = formData.menuItem;
      }

      if (formData.rewardType === 'ticketReward') {
        payload.event = formData.event;
      }

      // Add edit-specific fields
      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response = isEdit && selectedData ? await updateReward(payload).unwrap() : await addReward(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Reward updated successfully' : 'Reward created successfully'));

      // methods.reset(defaultValues);
      reset(defaultValues, {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      });

      onClose();
    } catch (error) {
      if (uploadedFileKey) {
        setDeleting(true);
        try {
          await deleteFileFromAzure(uploadedFileKey);
        } catch (deleteError) {
          console.error('Failed to delete uploaded file:', deleteError);
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-175!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? `Edit Reward` : `Create Reward`}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFUploadAvatar
                  name="image"
                  label="Image"
                  initialImage={(() => {
                    const img = selectedData?.media;
                    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
                      return null;
                    }
                    return img;
                  })()}
                />

                <RHFSelectField
                  name="rewardType"
                  label="Creation Method"
                  placeholder="Select creation method"
                  disabled={isEdit}
                  className="w-full"
                  options={[
                    ...(!global
                      ? [
                          {
                            label: 'From Menu Items',
                            value: 'buyMenuItemReward',
                          },
                        ]
                      : []),
                    { label: 'Create Custom Reward', value: 'customReward' },
                    { label: 'Add Ticket Reward', value: 'ticketReward' },
                  ]}
                />

                {rewardType === 'buyMenuItemReward' && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 Select menu items to link directly for easier scanning and fulfillment. Use the calculator below to determine point values.
                    </p>
                  </div>
                )}

                {rewardType === 'customReward' && (
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <p className="text-xs text-green-800 dark:text-green-200">
                      💡 Create custom rewards for items not in your menu (merchandise, entry perks, etc.). Set your own point value and description.
                    </p>
                  </div>
                )}

                {rewardType === 'ticketReward' && (
                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <p className="text-xs text-purple-800 dark:text-purple-200">
                      💡 Create exclusive tickets available only through loyalty rewards. These are not for sale and provide special access to events.
                    </p>
                  </div>
                )}

                {rewardType === 'buyMenuItemReward' && (
                  <>
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                      {menuLoading ? (
                        <FieldSkeleton />
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

                      {menuItemsLoading ? (
                        <FieldSkeleton />
                      ) : (
                        <RHFCustomDropdown
                          label="Select Menu Item"
                          name="menuItem"
                          placeholder="Select Menu Item"
                          options={menuItemOptions}
                          isLoading={menuItemsLoading}
                          showNone={false}
                          disabled={!selectedMenuId}
                        />
                      )}
                    </div>
                  </>
                )}

                {rewardType === 'ticketReward' && (
                  <div className="grid w-full grid-cols-1 gap-4">
                    {isLoadingEvents ? (
                      <FieldSkeleton />
                    ) : (
                      <RHFCustomDropdown
                        name="event"
                        label="Select Event"
                        placeholder="Choose event for ticket reward"
                        options={eventOptions}
                        isLoading={isLoadingEvents}
                        showNone={false}
                      />
                    )}
                  </div>
                )}

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="title" label="Name" placeholder="Enter reward name" />

                  <RHFTextField name="sortingType" label="Type" placeholder="Enter type for sorting" />

                  <div className="relative">
                    <RHFTextField name="minPointsRequiredToClaim" label="Point Value" placeholder="Points required to claim" type="number" />
                  </div>

                  <RHFTextField name="claimLimit" label="Limit (Optional)" placeholder="Max times claimable" type="number" />

                  {tiersLoading ? (
                    <FieldSkeleton />
                  ) : (
                    <RHFCustomDropdown
                      name="tierLimit"
                      label="Tier Limit"
                      placeholder="Minimum tier required"
                      options={global ? levelStatusOptions : tiersOptions}
                      isLoading={global ? levelStatusLoading : tiersLoading}
                      showNone={false}
                    />
                  )}

                  <RHFTextField
                    name="percentOff"
                    label="Percent Off (Optional)"
                    placeholder="For coupon rewards (0-100)"
                    type="number"
                    min="0"
                    max="100"
                  />

                  <RHFDate name="endDate" label="End Date" placeholder="Select End Date" />
                </div>

                {percentOff && Number(percentOff) > 0 && (
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      💡 This reward will provide {percentOff}% off instead of a free item. Customers will pay the remaining amount.
                    </p>
                  </div>
                )}

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFTextField name="description" label="Description (Optional)" placeholder="Enter reward details" multiline rows={2} />
                </div>

                {!global && <RewardCalculatorFields companyOrganizer={selectedCompany} />}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {addRewardLoading || updateRewardLoading || imageUploading || deleting ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white">
                      {isEdit ? 'Update' : 'Create'} Reward
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

export default RewardFormModal;
