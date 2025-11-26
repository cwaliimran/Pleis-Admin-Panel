'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddChallengeMutation, useUpdateChallengeMutation } from '@/store/Reducer/challenges-api';
import { useGetMenuItemByMenuIdQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetTiersQuery } from '@/store/Reducer/tiers-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import RewardCalculatorFields from '../rewards/reward-calculation-fields';

// ============================================
// SCHEMA & TYPES
// ============================================
const defaultValues: any = {
  photo: null,
  title: '',
  description: '',
  rewardType: 'points',
  rewardValue: '' as any,
  rewardMenu: '',
  rewardMenuItem: '',
  customRewardImage: null,
  customRewardTitle: '',
  customRewardDescription: '',
  taskType: 'visit',
  taskValue: '' as any,
  taskMenuItem: '',
  claimLimit: '' as any,
  endDate: '',
  tierLimit: '',
  status: 'active',
};

const schema = Yup.object().shape({
  photo: Yup.mixed().nullable().required('Challenge image is required'),
  title: Yup.string().default('').required('Challenge name is required'),
  description: Yup.string().default(''),
  rewardType: Yup.string()
    .oneOf(['points', 'menuItem', 'customReward', 'specialTicket'] as const)
    .default('points')
    .required('Reward type is required'),

  rewardValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('rewardType', {
      is: (val: string) => val === 'points' || val === 'specialTicket',
      then: (schema) => schema.required('Reward value is required').min(1, 'Must be at least 1'),
      otherwise: (schema) => schema.nullable(),
    }),

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

  taskType: Yup.string()
    .oneOf(['visit', 'earnPoints', 'buyMenuItem', 'referUsers'] as const)
    .default('visit')
    .required('Task type is required'),
  taskValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
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
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .min(0, 'Must be 0 or greater')
    .nullable(),
  endDate: Yup.string().default('').required('End date is required'),
  tierLimit: Yup.string().default('').required('Tier limit is required'),
  status: Yup.string().default('active'),
}) as any;

type ChallengesFormValues = Yup.InferType<typeof schema>;

type ChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  global?: boolean;
  companyOrganizer?: string;
  onSubmit?: (data: any) => void;
  selectedCompany?: any;
};

const ChallengeModal = ({ open, onClose, isEdit = false, selectedData, global = false, selectedCompany }: ChallengeModalProps) => {
  const [deleting, setDeleting] = useState(false);
  // 🔥 Add ref to track if we're initializing edit data
  const isInitializingEdit = useRef(false);

  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [addChallenge, { isLoading: addChallengeLoading }] = useAddChallengeMutation();
  const [updateChallenge, { isLoading: updateChallengeLoading }] = useUpdateChallengeMutation();

  const methods = useForm<ChallengesFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;

  // ============================================
  // WATCH FIELDS FOR CONDITIONAL RENDERING
  // ============================================
  const rewardType = watch('rewardType');
  const taskType = watch('taskType');
  const selectedMenuId = watch('rewardMenu');
  const selectedTaskMenuId = watch('taskMenuItem');

  // ============================================
  // API QUERIES
  // ============================================
  const { data: tiersData, isLoading: tiersLoading } = useGetTiersQuery({
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
    companyOrganizer: selectedCompany?.value || undefined,
  });

  // 🔥 Dynamic menu items query based on selected menu
  const { data: rewardMenuItemsData, isLoading: rewardMenuItemsLoading } = useGetMenuItemByMenuIdQuery(
    { menuId: selectedMenuId },
    { skip: !selectedMenuId || rewardType !== 'menuItem' }
  );

  // 🔥 Dynamic menu items for task (buyMenuItem)
  const { data: taskMenuItemsData, isLoading: taskMenuItemsLoading } = useGetMenuItemByMenuIdQuery(
    { menuId: selectedTaskMenuId },
    { skip: !selectedTaskMenuId || taskType !== 'buyMenuItem' }
  );

  // ============================================
  // OPTIONS MAPPING
  // ============================================
  const menuOptions =
    menuData?.data?.map((menu: any) => ({
      label: menu?.title,
      value: menu?._id,
    })) || [];

  const rewardMenuItemOptions =
    rewardMenuItemsData?.data?.map((menuItem: any) => ({
      label: menuItem?.title,
      value: menuItem?._id,
    })) || [];

  const taskMenuItemOptions =
    taskMenuItemsData?.data?.map((menuItem: any) => ({
      label: menuItem?.title,
      value: menuItem?._id,
    })) || [];

  const tiersOptions =
    tiersData?.data?.map((tier: any) => ({
      label: tier?.title,
      value: tier?._id,
    })) || [];

  // ============================================
  // EDIT MODE DATA POPULATION
  // ============================================
  useEffect(() => {
    if (isEdit && selectedData) {
      // 🔥 Set flag to indicate we're initializing
      isInitializingEdit.current = true;

      const { reward = {}, ...rest } = selectedData;

      const mappedValues: any = {
        photo: rest?.image || null,
        title: rest?.title || '',
        description: rest?.description || '',
        taskType: rest?.taskType || 'visit',
        taskValue: rest?.taskValue || ('' as any),
        taskMenuItem: rest?.taskMenuItem?._id || '',
        claimLimit: rest?.claimLimit || ('' as any),
        endDate: rest?.endDate ? new Date(rest.endDate) : '',
        tierLimit: rest?.tierLimit?._id || '',
        status: rest?.status || 'active',
        rewardType: reward?.rewardType || 'points',

        // Reward fields mapping
        rewardValue: reward?.rewardType === 'points' || reward?.rewardType === 'specialTicket' ? reward?.rewardValue || ('' as any) : ('' as any),

        rewardMenu:
          reward?.rewardType === 'menuItem' && reward?.rewardMenuItem?.menu
            ? typeof reward.rewardMenuItem.menu === 'string'
              ? reward.rewardMenuItem.menu
              : reward.rewardMenuItem.menu._id || reward.rewardMenuItem.menu
            : '',

        rewardMenuItem: reward?.rewardType === 'menuItem' ? reward?.rewardMenuItem?._id || '' : '',

        customRewardImage: reward?.rewardType === 'customReward' ? reward?.customReward?.mediaInfo?.url || null : null,
        customRewardTitle: reward?.rewardType === 'customReward' ? reward?.customReward?.title || '' : '',
        customRewardDescription: reward?.rewardType === 'customReward' ? reward?.customReward?.description || '' : '',
      };

      reset(mappedValues);

      setTimeout(() => {
        isInitializingEdit.current = false;
      }, 100);
    }
  }, [isEdit, selectedData, reset]);

  // ============================================
  // CLEAR MENU ITEM WHEN MENU CHANGES
  // ============================================
  useEffect(() => {
    // 🔥 Only clear if not initializing edit data
    if (rewardType === 'menuItem' && !isInitializingEdit.current) {
      setValue('rewardMenuItem', '');
    }
  }, [selectedMenuId, setValue, rewardType]);

  useEffect(() => {
    // 🔥 Only clear if not initializing edit data
    if (taskType === 'buyMenuItem' && !isInitializingEdit.current) {
      setValue('taskMenuItem', '');
    }
  }, [selectedTaskMenuId, setValue, taskType]);

  // ============================================
  // TRANSFORM TO API PAYLOAD
  // ============================================
  const transformToPayload = (data: ChallengesFormValues) => {
    const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || 'null');

    if (!selectedCompany) {
      showError('Please select a company first before submitting the form');
      return null;
    }

    const basePayload: any = {
      companyOrganizer: selectedCompany.value || '',
      title: data.title,
      taskType: data.taskType,
      taskValue: Number(data.taskValue),
      endDate: fDate(data.endDate, formatStr.paramCase.db),
      tierLimit: data.tierLimit,
      status: data.status || 'active',
    };

    if (data.description && data.description.trim() !== '') {
      basePayload.description = data.description;
    }

    if (data.claimLimit && Number(data.claimLimit) > 0) {
      basePayload.claimLimit = Number(data.claimLimit);
    }

    if (data.taskType === 'buyMenuItem' && data.taskMenuItem) {
      basePayload.taskMenuItem = data.taskMenuItem;
    }

    // Build reward object
    switch (data.rewardType) {
      case 'points':
        basePayload.reward = {
          rewardType: 'points',
          rewardValue: Number(data.rewardValue),
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
          rewardValue: Number(data.rewardValue),
        };
        break;
    }

    return basePayload;
  };

  // ============================================
  // SUBMIT HANDLER
  // ============================================
  const handleSubmit = async (formData: ChallengesFormValues) => {
    let uploadedFileKey: string | null = null;
    let challengeImageFile: string | null = null;

    try {
      if (formData?.customRewardImage instanceof FileList && formData?.customRewardImage.length > 0) {
        const file = formData.customRewardImage[0];
        uploadedFileKey = await uploadImage(file);
      }

      if (formData?.photo instanceof FileList && formData?.photo.length > 0) {
        const file = formData.photo[0];
        challengeImageFile = await uploadImage(file);
      }

      const payload = transformToPayload(formData);

      if (!payload) return;

      if (uploadedFileKey) {
        payload.reward.customReward.image = uploadedFileKey;
      }

      if (challengeImageFile) {
        payload.image = challengeImageFile;
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
      if (uploadedFileKey || challengeImageFile) {
        setDeleting(true);
        try {
          if (uploadedFileKey) await deleteFileFromAzure(uploadedFileKey);
          if (challengeImageFile) await deleteFileFromAzure(challengeImageFile);
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
    isInitializingEdit.current = false;
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
                <RHFUploadAvatar name="photo" label="Challenge Image" />

                <RHFTextField name="title" label="Challenge Name" placeholder="Enter Challenge Name" />
                <RHFTextField name="description" label="Description (Optional)" placeholder="Enter Challenge Description" />

                {/* Task Type */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="taskType"
                    label="Task Type"
                    placeholder="Select Task Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Visit X Times', value: 'visit' },
                      { label: 'Spend X Points', value: 'earnPoints' },
                      ...(!global ? [{ label: 'Buy Specific Menu Item X Times', value: 'buyMenuItem' }] : []),
                      { label: 'Refer X Users', value: 'referUsers' },
                    ]}
                  />

                  <RHFTextField name="taskValue" label="Task Value (X)" placeholder="Enter value (e.g. 5)" type="number" min="1" />
                </div>

                {/* Task Menu Item */}
                {taskType === 'buyMenuItem' && (
                  <>
                    {taskMenuItemsLoading ? (
                      <div className="mt-2 w-full space-y-2 md:w-full">
                        <Skeleton className="ml-1 h-3 w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                        <Skeleton className="h-8 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                      </div>
                    ) : (
                      <RHFCustomDropdown
                        name="taskMenuItem"
                        label="Menu Item"
                        placeholder="Select Menu Item"
                        options={taskMenuItemOptions}
                        isLoading={taskMenuItemsLoading}
                        showNone={false}
                      />
                    )}
                  </>
                )}

                <RHFTextField name="claimLimit" label="Claim Limit (Optional)" placeholder="Enter Claim Limit" type="number" min="0" />
                <RHFDate name="endDate" label="End Date" placeholder="Select End Date" />

                {/* Tier Limit */}
                {tiersLoading ? (
                  <div className="mt-2 w-full space-y-2 md:w-full">
                    <Skeleton className="ml-1 h-3 w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                    <Skeleton className="h-8 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                  </div>
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

                {/* Reward Type */}
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
                    <RHFTextField name="rewardValue" label="Point Reward" placeholder="Enter points" type="number" min="1" />
                  )}

                  {/* Special Ticket */}
                  {rewardType === 'specialTicket' && (
                    <RHFTextField name="rewardValue" label="Special Ticket Reward" placeholder="Enter tickets" type="number" min="1" />
                  )}
                </div>

                {/* Menu Item Reward */}
                {rewardType === 'menuItem' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    {menuLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="ml-1 h-3 w-20" />
                        <Skeleton className="h-8" />
                      </div>
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

                    {/* 🔥 Show menu items ONLY when menu is selected */}
                    {selectedMenuId && (
                      <>
                        {rewardMenuItemsLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="ml-1 h-3 w-20" />
                            <Skeleton className="h-8" />
                          </div>
                        ) : (
                          <RHFCustomDropdown
                            name="rewardMenuItem"
                            label="Menu Item"
                            placeholder="Select Menu Item"
                            options={rewardMenuItemOptions}
                            isLoading={rewardMenuItemsLoading}
                            showNone={false}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Custom Reward */}
                {rewardType === 'customReward' && (
                  <div className="flex flex-col gap-4">
                    <div className="mb-2 flex max-w-40 items-center justify-start">
                      <RHFUploadButton name="customRewardImage" label="Upload Photo" initialImage={null} />
                    </div>
                    <RHFTextField name="customRewardTitle" label="Custom Reward Title" placeholder="Enter title" />
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
