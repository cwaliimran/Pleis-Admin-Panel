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
import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
import { useGetLevelStatusQuery } from '@/store/Reducer/level-status-api';
import { useGetMenuItemByMenuIdQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetOrganizationByCompanyQuery } from '@/store/Reducer/organization';
import { useGetTicketingByEventQuery } from '@/store/Reducer/ticketing-api';
import { useGetTiersQuery } from '@/store/Reducer/tiers-api';
import { useGetCompanyListQuery } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import type { CompanyOption, EventOption, OrganizationOption, TicketOption } from './special-ticket-types';

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
  // Special Ticket Fields
  companyId: '',
  organizationId: '',
  eventId: '',
  ticketId: '',
  taskType: 'globalVisit',
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
      is: (val: string) => val === 'points',
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

  // Special Ticket Validation
  companyId: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'specialTicket',
      then: (schema) => schema.required('Company is required for special tickets'),
      otherwise: (schema) => schema.default(''),
    }),
  organizationId: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'specialTicket',
      then: (schema) => schema.required('Organization is required for special tickets'),
      otherwise: (schema) => schema.default(''),
    }),
  eventId: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'specialTicket',
      then: (schema) => schema.required('Event is required for special tickets'),
      otherwise: (schema) => schema.default(''),
    }),
  ticketId: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'specialTicket',
      then: (schema) => schema.required('Ticket is required for special tickets'),
      otherwise: (schema) => schema.default(''),
    }),

  taskType: Yup.string()
    .oneOf(['globalVisit', 'globalEarnPoints', 'globalReferUsers'] as const)
    .default('globalVisit')
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

const GlobalChallengeModal = ({ open, onClose, isEdit = false, selectedData, global = false, selectedCompany }: ChallengeModalProps) => {
  const [deleting, setDeleting] = useState(false);
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

  const rewardType = watch('rewardType');
  const taskType = watch('taskType');
  const selectedMenuId = watch('rewardMenu');
  const selectedTaskMenuId = watch('taskMenuItem');

  // Special Ticket Fields
  const companyId = watch('companyId');
  const organizationId = watch('organizationId');
  const eventId = watch('eventId');

  // Determine when to show special ticket dropdowns
  const shouldShowCompanyDropdown = rewardType === 'specialTicket';
  const shouldShowOrganizationDropdown = rewardType === 'specialTicket' && !!companyId;
  const shouldShowEventDropdown = rewardType === 'specialTicket' && !!organizationId;
  const shouldShowTicketDropdown = rewardType === 'specialTicket' && !!eventId;

  // API QUERIES - Existing
  const { data: menuData, isLoading: menuLoading } = useGetMenuListQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
      companyOrganizer: selectedCompany || undefined,
    },
    {
      skip: global,
    }
  );

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

  const levelStatusOptions =
    levelStatus?.data?.map((status: any) => ({
      label: status?.title,
      value: status?._id,
    })) || [];

  const {
    data: rewardMenuItemsData,
    isLoading: rewardMenuItemsLoading,
    isFetching: rewardMenuItemsFetching,
  } = useGetMenuItemByMenuIdQuery({ menuId: selectedMenuId }, { skip: !selectedMenuId || rewardType !== 'menuItem' });

  const { data: taskMenuItemsData, isLoading: taskMenuItemsLoading } = useGetMenuItemByMenuIdQuery(
    { menuId: selectedTaskMenuId },
    { skip: !selectedTaskMenuId || taskType !== 'buyMenuItem' }
  );

  // API QUERIES - Special Ticket Feature
  const {
    data: companyList,
    isLoading: isLoadingCompanies,
    isFetching: isCompanyFetching,
  } = useGetCompanyListQuery(
    {},
    {
      skip: !shouldShowCompanyDropdown,
    }
  );

  const {
    data: organizationResponse,
    isLoading: isLoadingOrganizations,
    isFetching: isOrganizationFetching,
  } = useGetOrganizationByCompanyQuery(
    {
      companyOrganizer: companyId || undefined,
    },
    {
      skip: !shouldShowOrganizationDropdown || !companyId,
    }
  );

  const {
    data: eventData,
    isLoading: isLoadingEvents,
    isFetching: isEventFetching,
  } = useGetEventsByOrganizationQuery(
    {
      organization: organizationId || undefined,
    },
    {
      skip: !shouldShowEventDropdown || !organizationId,
    }
  );

  const {
    data: ticketData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
  } = useGetTicketingByEventQuery(
    {
      eventId: eventId || undefined,
    },
    {
      skip: !shouldShowTicketDropdown || !eventId,
    }
  );

  // OPTIONS MAPPING - Existing
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

  // OPTIONS MAPPING - Special Ticket Feature
  const companyOptions = useMemo<CompanyOption[]>(
    () =>
      companyList?.map((company: any) => ({
        label: company?.companyDetails?.name || 'Unknown Company',
        value: company?._id,
      })) || [],
    [companyList]
  );

  const organizationOptions = useMemo<OrganizationOption[]>(
    () =>
      organizationResponse?.data?.map((organization: any) => ({
        label: organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
        companyId: companyId || '',
      })) || [],
    [organizationResponse, companyId]
  );

  const eventOptions = useMemo<EventOption[]>(
    () =>
      (eventData || []).map((event: any) => ({
        value: event?._id?.toString(),
        label: event?.basicInfo?.title || 'No Title',
      })),
    [eventData]
  );

  const ticketOptions = useMemo<TicketOption[]>(
    () =>
      (ticketData?.data || []).map((ticket: any) => ({
        label: `${ticket?.title}`,
        value: ticket?._id,
        price: ticket?.amount,
      })),
    [ticketData]
  );

  // CASCADING DROPDOWN LOGIC - Clear dependent fields when parent changes
  useEffect(() => {
    if (!isInitializingEdit.current && rewardType === 'specialTicket') {
      // Clear all dependent fields when company changes
      setValue('organizationId', '');
      setValue('eventId', '');
      setValue('ticketId', '');
    }
  }, [companyId, setValue, rewardType]);

  useEffect(() => {
    if (!isInitializingEdit.current && rewardType === 'specialTicket') {
      // Clear event and ticket when organization changes
      setValue('eventId', '');
      setValue('ticketId', '');
    }
  }, [organizationId, setValue, rewardType]);

  useEffect(() => {
    if (!isInitializingEdit.current && rewardType === 'specialTicket') {
      // Clear ticket when event changes
      setValue('ticketId', '');
    }
  }, [eventId, setValue, rewardType]);

  // Clear special ticket fields when reward type changes
  useEffect(() => {
    if (!isInitializingEdit.current && rewardType !== 'specialTicket') {
      setValue('companyId', '');
      setValue('organizationId', '');
      setValue('eventId', '');
      setValue('ticketId', '');
    }
  }, [rewardType, setValue]);

  // EDIT MODE DATA POPULATION
  useEffect(() => {
    if (isEdit && selectedData) {
      isInitializingEdit.current = true;

      const { reward = {}, ...rest } = selectedData;

      const mappedValues: any = {
        photo: rest?.image || null,
        title: rest?.title || '',
        description: rest?.description || '',
        taskType: rest?.taskType || 'globalVisit',
        taskValue: rest?.taskValue || ('' as any),
        taskMenuItem: rest?.taskMenuItem?._id || '',
        claimLimit: rest?.claimLimit || ('' as any),
        endDate: rest?.endDate ? new Date(rest.endDate) : '',
        tierLimit: rest?.tierLimit?._id || '',
        status: rest?.status || 'active',
        rewardType: reward?.rewardType || 'points',

        // Reward fields mapping
        rewardValue: reward?.rewardType === 'points' ? reward?.rewardValue || ('' as any) : ('' as any),

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

        // Special Ticket fields mapping - CORRECTED PATH
        companyId:
          reward?.rewardType === 'specialTicket'
            ? typeof reward?.specialTicket?.companyOrganizer === 'string'
              ? reward.specialTicket.companyOrganizer
              : reward?.specialTicket?.companyOrganizer?._id || ''
            : '',
        organizationId:
          reward?.rewardType === 'specialTicket'
            ? typeof reward?.specialTicket?.organization === 'string'
              ? reward.specialTicket.organization
              : reward?.specialTicket?.organization?._id || ''
            : '',
        eventId:
          reward?.rewardType === 'specialTicket'
            ? typeof reward?.specialTicket?.event === 'string'
              ? reward.specialTicket.event
              : reward?.specialTicket?.event?._id || ''
            : '',
        ticketId:
          reward?.rewardType === 'specialTicket'
            ? typeof reward?.specialTicket?.ticket === 'string'
              ? reward.specialTicket.ticket
              : reward?.specialTicket?.ticket?._id || ''
            : '',
      };

      reset(mappedValues);

      setTimeout(() => {
        isInitializingEdit.current = false;
      }, 100);
    }
  }, [isEdit, selectedData, reset]);

  // EDIT MODE DATA POPULATION
  // useEffect(() => {
  //   if (isEdit && selectedData) {
  //     isInitializingEdit.current = true;

  //     const { reward = {}, ...rest } = selectedData;

  //     const mappedValues: any = {
  //       photo: rest?.image || null,
  //       title: rest?.title || '',
  //       description: rest?.description || '',
  //       taskType: rest?.taskType || 'globalVisit',
  //       taskValue: rest?.taskValue || ('' as any),
  //       taskMenuItem: rest?.taskMenuItem?._id || '',
  //       claimLimit: rest?.claimLimit || ('' as any),
  //       endDate: rest?.endDate ? new Date(rest.endDate) : '',
  //       tierLimit: rest?.tierLimit?._id || '',
  //       status: rest?.status || 'active',
  //       rewardType: reward?.rewardType || 'points',

  //       // Reward fields mapping
  //       rewardValue: reward?.rewardType === 'points' ? reward?.rewardValue || ('' as any) : ('' as any),

  //       rewardMenu:
  //         reward?.rewardType === 'menuItem' && reward?.rewardMenuItem?.menu
  //           ? typeof reward.rewardMenuItem.menu === 'string'
  //             ? reward.rewardMenuItem.menu
  //             : reward.rewardMenuItem.menu._id || reward.rewardMenuItem.menu
  //           : '',

  //       rewardMenuItem: reward?.rewardType === 'menuItem' ? reward?.rewardMenuItem?._id || '' : '',

  //       customRewardImage: reward?.rewardType === 'customReward' ? reward?.customReward?.mediaInfo?.url || null : null,
  //       customRewardTitle: reward?.rewardType === 'customReward' ? reward?.customReward?.title || '' : '',
  //       customRewardDescription: reward?.rewardType === 'customReward' ? reward?.customReward?.description || '' : '',

  //       // Special Ticket fields mapping
  //       companyId: reward?.rewardType === 'specialTicket' ? reward?.companyOrganizer || '' : '',
  //       organizationId: reward?.rewardType === 'specialTicket' ? reward?.organization || '' : '',
  //       eventId: reward?.rewardType === 'specialTicket' ? reward?.event || '' : '',
  //       ticketId: reward?.rewardType === 'specialTicket' ? reward?.ticket || '' : '',
  //     };

  //     reset(mappedValues);

  //     setTimeout(() => {
  //       isInitializingEdit.current = false;
  //     }, 100);
  //   }
  // }, [isEdit, selectedData, reset]);

  // CLEAR MENU ITEM WHEN MENU CHANGES
  useEffect(() => {
    if (rewardType === 'menuItem' && !isInitializingEdit.current) {
      setValue('rewardMenuItem', '');
    }
  }, [selectedMenuId, setValue, rewardType]);

  useEffect(() => {
    if (taskType === 'buyMenuItem' && !isInitializingEdit.current) {
      setValue('taskMenuItem', '');
    }
  }, [selectedTaskMenuId, setValue, taskType]);

  // TRANSFORM TO API PAYLOAD
  const transformToPayload = (data: ChallengesFormValues) => {
    if (!selectedCompany && !global) {
      showError('Please select a company first before submitting the form');
      return null;
    }

    const basePayload: any = {
      title: data.title,
      taskType: data.taskType,
      taskValue: Number(data.taskValue),
      endDate: fDate(data.endDate, formatStr.paramCase.db),
      tierLimit: data.tierLimit,
      status: data.status || 'active',
    };

    if (!global) {
      basePayload.companyOrganizer = selectedCompany || '';
    }

    if (global) {
      basePayload.isGlobal = true;
    }

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
          specialTicket: {
            companyOrganizer: data.companyId,
            organization: data.organizationId,
            event: data.eventId,
            ticket: data.ticketId,
          },
        };
        break;
    }

    return basePayload;
  };

  // SUBMIT HANDLER
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
            <DialogTitle>{isEdit ? 'Edit Global Challenge' : 'Create Global Challenge'}</DialogTitle>
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
                      { label: 'Visit X Times', value: 'globalVisit' },
                      { label: 'Earn X Points', value: 'globalEarnPoints' },
                      { label: 'Refer X Users', value: 'globalReferUsers' },
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
                    options={global ? levelStatusOptions : tiersOptions}
                    isLoading={global ? levelStatusLoading : tiersLoading}
                    showNone={false}
                  />
                )}

                {/* Reward Type */}
                <RHFSelectField
                  name="rewardType"
                  label="Reward Type"
                  placeholder="Select Reward Type"
                  options={[
                    { label: 'Point Reward', value: 'points' },
                    { label: 'Custom Reward', value: 'customReward' },
                    { label: 'Special Ticket', value: 'specialTicket' },
                  ]}
                />

                {/* Point Reward */}
                {rewardType === 'points' && <RHFTextField name="rewardValue" label="Point Reward" placeholder="Enter points" type="number" min="1" />}

                {/* Special Ticket - Cascading Dropdowns */}
                {rewardType === 'specialTicket' && (
                  <div className="space-y-4">
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Company Dropdown */}
                      {isLoadingCompanies || isCompanyFetching ? (
                        <div className="space-y-2">
                          <Skeleton className="ml-1 h-3 w-20" />
                          <Skeleton className="h-8" />
                        </div>
                      ) : (
                        <RHFCustomDropdown
                          name="companyId"
                          label="Company"
                          placeholder="Select Company"
                          options={companyOptions}
                          isLoading={isLoadingCompanies}
                          showNone={false}
                        />
                      )}

                      {/* Organization Dropdown - Only show when company is selected */}
                      {companyId && (
                        <>
                          {isLoadingOrganizations || isOrganizationFetching ? (
                            <div className="space-y-2">
                              <Skeleton className="ml-1 h-3 w-20" />
                              <Skeleton className="h-8" />
                            </div>
                          ) : (
                            <RHFCustomDropdown
                              name="organizationId"
                              label="Organization"
                              placeholder="Select Organization"
                              options={organizationOptions}
                              isLoading={isLoadingOrganizations}
                              showNone={false}
                            />
                          )}
                        </>
                      )}

                      {/* Event Dropdown - Only show when organization is selected */}
                      {organizationId && (
                        <>
                          {isLoadingEvents || isEventFetching ? (
                            <div className="space-y-2">
                              <Skeleton className="ml-1 h-3 w-20" />
                              <Skeleton className="h-8" />
                            </div>
                          ) : (
                            <RHFCustomDropdown
                              name="eventId"
                              label="Event"
                              placeholder="Select Event"
                              options={eventOptions}
                              isLoading={isLoadingEvents}
                              showNone={false}
                            />
                          )}
                        </>
                      )}

                      {/* Ticket Dropdown - Only show when event is selected */}
                      {eventId && (
                        <>
                          {isTicketsLoading || isTicketsFetching ? (
                            <div className="space-y-2">
                              <Skeleton className="ml-1 h-3 w-20" />
                              <Skeleton className="h-8" />
                            </div>
                          ) : (
                            <RHFCustomDropdown
                              name="ticketId"
                              label="Ticket"
                              placeholder="Select Ticket"
                              options={ticketOptions}
                              isLoading={isTicketsLoading}
                              showNone={false}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

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

                    {/* Show menu items ONLY when menu is selected */}
                    {selectedMenuId && (
                      <>
                        {rewardMenuItemsLoading || rewardMenuItemsFetching ? (
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

                {/* Status Field - Only show in edit mode */}
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
              </div>

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

export default GlobalChallengeModal;
