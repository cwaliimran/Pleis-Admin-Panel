'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddChallengeMutation, useUpdateChallengeMutation } from '@/store/Reducer/challenges-api';
import { useGetMenuItemsQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetTiersQuery } from '@/store/Reducer/tiers-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import RewardCalculatorFields from '../../loyalty-modules/rewards/reward-calculation-fields';
import FieldSkeleton from '@/components/ui/field-skeleton';

const defaultValues: ChallengesFormValues = {
  title: '',
  description: '',
  rewardType: 'points',
  rewardValue: 0,
  rewardMenu: '',
  rewardMenuItem: '',
  customRewardImage: null,
  customRewardTitle: '',
  customRewardDescription: '',
  taskType: 'visit',
  taskValue: 0,
  taskMenuItem: '',
  claimLimit: 0,
  endDate: '',
  tierLimit: '',
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().default('').required('Challenge name is required'),
  description: Yup.string().default(''),
  rewardType: Yup.string()
    .oneOf(['points', 'menuItem', 'customReward', 'specialTicket'] as const)
    .default('points')
    .required('Reward type is required'),

  // Points reward validation
  rewardValue: Yup.number()
    .default(0)
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .when('rewardType', {
      is: (val: string) => val === 'points' || val === 'specialTicket',
      then: (schema) => schema.required('Reward value is required').min(1, 'Must be at least 1'),
      otherwise: (schema) => schema.default(0),
    }),

  // Menu item reward validation
  rewardMenu: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'menuItem',
      then: (schema) => schema.required('Menu is required'),
      otherwise: (schema) => schema.default(''),
    }),
  rewardMenuItem: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'menuItem',
      then: (schema) => schema.required('Menu item is required'),
      otherwise: (schema) => schema.default(''),
    }),

  // Custom reward validation
  customRewardImage: Yup.mixed().nullable().default(null),
  customRewardTitle: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'customReward',
      then: (schema) => schema.required('Custom reward title is required'),
      otherwise: (schema) => schema.default(''),
    }),
  customRewardDescription: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'customReward',
      then: (schema) => schema.required('Custom reward description is required'),
      otherwise: (schema) => schema.default(''),
    }),

  // Task validations
  taskType: Yup.string()
    .oneOf(['visit', 'earnPoints', 'buyMenuItem', 'referUsers'] as const)
    .default('visit')
    .required('Task type is required'),
  taskValue: Yup.number()
    .default(1)
    .transform((value, originalValue) => (originalValue === '' ? 1 : value))
    .required('Task value is required')
    .min(1, 'Must be at least 1'),
  taskMenuItem: Yup.string()
    .default('')
    .when('taskType', {
      is: 'buyMenuItem',
      then: (schema) => schema.required('Menu item is required for this task type'),
      otherwise: (schema) => schema.default(''),
    }),

  claimLimit: Yup.number()
    .default(0)
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be 0 or greater'),
  endDate: Yup.string().default('').required('End date is required'),
  tierLimit: Yup.string().default('').required('Tier limit is required'),
  status: Yup.string().default('active'),
});

type ChallengesFormValues = Yup.InferType<typeof schema>;

type ChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  global?: boolean;
  companyOrganizer?: string;
  onSubmit?: (data: any) => void;
};

const ChallengeModal = ({ open, onClose, isEdit = false, selectedData, global = false, companyOrganizer }: ChallengeModalProps) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [deleting, setDeleting] = useState(false);

  const [addChallenge, { isLoading: addChallengeLoading }] = useAddChallengeMutation();

  const [updateChallenge, { isLoading: updateChallengeLoading }] = useUpdateChallengeMutation();

  const methods = useForm<ChallengesFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
    mode: 'onChange',
  });

  const { data: menuData, isLoading: menuLoading } = useGetMenuListQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const { data: tiersData, isLoading: tiersLoading } = useGetTiersQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const { data: menuItemsData, isLoading: menuItemsLoading } = useGetMenuItemsQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

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

  const tiersOptions =
    tiersData?.data?.map((tier: any) => ({
      label: tier?.title,
      value: tier?._id,
    })) || [];

  const {
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const rewardType = watch('rewardType');
  const taskType = watch('taskType');

  useEffect(() => {
    if (isEdit && selectedData) {
      const { reward = {}, ...rest } = selectedData;

      const mappedValues: any = {
        title: rest?.title || '',
        description: rest?.description || '',
        taskType: rest?.taskType || 'visit',
        taskValue: rest?.taskValue || 0,
        claimLimit: rest?.claimLimit || 0,
        endDate: rest?.endDate ? new Date(rest.endDate) : '',
        tierLimit: rest?.tierLimit || '',
        status: rest?.status || 'active',
        rewardType: reward?.rewardType || 'points',

        // Reward fields mapping
        rewardValue: reward?.rewardType === 'points' || reward?.rewardType === 'specialTicket' ? reward?.rewardValue || 0 : 0,

        rewardMenu: reward?.rewardType === 'menuItem' ? reward?.rewardMenu || '' : '',
        rewardMenuItem: reward?.rewardType === 'menuItem' ? reward?.rewardMenuItem || '' : '',

        customRewardImage: reward?.rewardType === 'customReward' ? reward?.customReward?.mediaInfo?.url || null : null,
        customRewardTitle: reward?.rewardType === 'customReward' ? reward?.customReward?.title || '' : '',
        customRewardDescription: reward?.rewardType === 'customReward' ? reward?.customReward?.description || '' : '',
      };

      reset(mappedValues);
    }
  }, [isEdit, selectedData, reset]);

  // Transform form data to API payload format
  const transformToPayload = (data: ChallengesFormValues) => {
    const basePayload: any = {
      companyOrganizer: companyOrganizer || '68da7aa1e6f099d42e32da71',
      title: data.title,
      taskType: data.taskType,
      taskValue: data.taskValue,
      endDate: fDate(data.endDate, formatStr.paramCase.db),
      tierLimit: data.tierLimit,
      status: data.status || 'active',
    };

    // Add description only if provided
    if (data.description && data.description.trim() !== '') {
      basePayload.description = data.description;
    }

    // Add claimLimit only if provided and greater than 0
    if (data.claimLimit && data.claimLimit > 0) {
      basePayload.claimLimit = data.claimLimit;
    }

    // Add taskMenuItem only for buyMenuItem task type
    if (data.taskType === 'buyMenuItem' && data.taskMenuItem) {
      basePayload.taskMenuItem = data.taskMenuItem;
    }

    // Build reward object based on reward type
    switch (data.rewardType) {
      case 'points':
        basePayload.reward = {
          rewardType: 'points',
          rewardValue: data.rewardValue,
        };
        break;

      case 'menuItem':
        basePayload.reward = {
          rewardType: 'menuItem',
          rewardMenu: data.rewardMenu,
          rewardMenuItem: data.rewardMenuItem,
        };
        break;

      case 'customReward':
        basePayload.reward = {
          rewardType: 'customReward',
          customReward: {
            title: data.customRewardTitle,
            description: data.customRewardDescription,
          },
        };
        break;

      case 'specialTicket':
        basePayload.reward = {
          rewardType: 'specialTicket',
          rewardValue: data.rewardValue,
        };
        break;
    }

    return basePayload;
  };

  const handleSubmit = async (formData: ChallengesFormValues) => {
    let uploadedFileKey: string | null = null;

    try {
      if (formData?.customRewardImage instanceof FileList && formData?.customRewardImage.length > 0) {
        const file = formData.customRewardImage[0];
        uploadedFileKey = await uploadImage(file);
      }

      const payload = transformToPayload(formData);

      if (uploadedFileKey) {
        payload.reward.customReward.image = uploadedFileKey;
      }

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response = isEdit && selectedData ? await updateChallenge(payload).unwrap() : await addChallenge(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Challenge updated successfully' : 'Challenge created successfully'));

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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Challenge' : 'Create Challenge'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-7 flex w-full flex-col gap-4">
                {/* Challenge Title */}
                <RHFTextField name="title" label="Challenge Name" placeholder="Enter Challenge Name" />

                {/* Challenge Description */}
                <RHFTextField name="description" label="Description (Optional)" placeholder="Enter Challenge Description" />

                {/* Task Type and Parameters */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="taskType"
                    label="Task Type"
                    placeholder="Select Task Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Visit X Times', value: 'visit' },
                      { label: 'Earn X Points', value: 'earnPoints' },
                      ...(!global
                        ? [
                            {
                              label: 'Buy Specific Menu Item X Times',
                              value: 'buyMenuItem',
                            },
                          ]
                        : []),
                      { label: 'Refer X Users', value: 'referUsers' },
                    ]}
                  />

                  {/* Task Value (X) */}
                  <RHFTextField name="taskValue" label="Task Value (X)" placeholder="Enter value (e.g. 5)" type="number" />
                </div>

                {/* Menu Item selection if taskType is buyMenuItem */}
                {taskType === 'buyMenuItem' && (
                  <>
                    {menuItemsLoading ? (
                      <FieldSkeleton />
                    ) : (
                      <RHFCustomDropdown
                        name="taskMenuItem"
                        label="Menu Item"
                        placeholder="Select Menu Item"
                        options={menuItemOptions}
                        isLoading={menuItemsLoading}
                        showNone={false}
                      />
                    )}
                  </>
                )}

                {/* Claim Limit */}
                <RHFTextField name="claimLimit" label="Claim Limit (Optional)" placeholder="Enter Claim Limit" type="number" />

                {/* End Time */}
                <RHFDate name="endDate" label="End Date" placeholder="Select End Date" />

                {/* Tier Limit */}
                {/* <RHFSelectField
                  name="tierLimit"
                  label="Tier Limit"
                  placeholder="Select Tier Limit"
                  className="w-full flex-1"
                  options={tiers}
                /> */}

                {tiersLoading ? (
                  <FieldSkeleton />
                ) : (
                  <RHFCustomDropdown
                    name="tierLimit"
                    label="Tier Limit"
                    placeholder="Select Tier Limit"
                    options={tiersOptions}
                    isLoading={tiersLoading}
                    showNone={false}
                  />
                )}

                {/* Reward Type Selection */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="rewardType"
                    label="Reward Type"
                    placeholder="Select Reward Type"
                    options={[
                      { label: 'Point Reward', value: 'points' },
                      { label: 'Menu Item Reward', value: 'menuItem' },
                      { label: 'Custom Reward', value: 'customReward' },
                      { label: 'Special Ticket', value: 'specialTicket' },
                    ]}
                  />

                  {/* Point Reward */}
                  {rewardType === 'points' && (
                    <RHFTextField name="rewardValue" label="Point Reward" placeholder="Enter points to reward" type="number" />
                  )}

                  {/* Menu Item Reward */}
                  {rewardType === 'menuItem' && (
                    <>
                      {/* <RHFSelectField
                        name="rewardMenu"
                        label="Menu"
                        placeholder="Select Menu"
                        options={menus}
                      /> */}

                      {menuLoading ? (
                        <FieldSkeleton />
                      ) : (
                        <RHFCustomDropdown
                          name="rewardMenu"
                          label="Menu"
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
                          name="rewardMenuItem"
                          label="Menu Item"
                          placeholder="Select Menu Item"
                          options={menuItemOptions}
                          isLoading={menuItemsLoading}
                          showNone={false}
                        />
                      )}
                    </>
                  )}

                  {/* Special Ticket Reward */}
                  {rewardType === 'specialTicket' && (
                    <RHFTextField name="rewardValue" label="Special Ticket Reward" placeholder="Enter number of tickets" type="number" />
                  )}
                </div>

                {/* Custom Reward */}
                {rewardType === 'customReward' && (
                  <div className="flex flex-col gap-4">
                    <div className="mb-2 flex max-w-40 items-center justify-start">
                      <RHFUploadButton name="customRewardImage" label="Upload Photo" initialImage={null} />
                    </div>

                    <RHFTextField name="customRewardTitle" label="Custom Reward Title" placeholder="Enter custom reward title" />
                    <RHFTextField name="customRewardDescription" label="Custom Reward Description" placeholder="Enter description" />
                  </div>
                )}
              </div>

              <RewardCalculatorFields />

              <div className="mt-5 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center gap-3">
                  <Button type="button" variant="outline" onClick={handleClose} className="cursor-pointer px-7">
                    Cancel
                  </Button>

                  {addChallengeLoading || updateChallengeLoading || imageUploading || deleting ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Challenge' : 'Create Challenge'}
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

export default ChallengeModal;
