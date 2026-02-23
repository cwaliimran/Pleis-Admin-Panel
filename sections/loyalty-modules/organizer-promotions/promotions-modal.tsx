'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetAllCompanyRewardsQuery, useGetAllOrganizerTiersQuery } from '@/store/Reducer/helpers-api';
import { useGetMenuItemsQuery } from '@/store/Reducer/menu-items-api';
import { useAddPromotionMutation, useUpdatePromotionMutation } from '@/store/Reducer/promotion-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type PromotionsFormValues = {
  photo: any;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  claimLimit: number;
  tierLimit: string;
  /* ---- recurring ---- */
  recurringEnabled: 'true' | 'false';
  frequency: 'daily' | 'weekly' | 'monthly' | '';
  interval: number;
  daysOfWeek: string[];
  /* ---- type ---- */
  promotionType: 'happyHour' | 'claimPromotion' | 'buyMenuItemPromotion' | 'productSale';
  /* ---- Happy Hour ---- */
  timeStart: string;
  timeEnd: string;
  pointsMultiplier: string; // string for RHFSelectField
  /* ---- Buy Menu Item ---- */
  menuItem: string;
  extraPoints: number;
  /* ---- Product Sale ---- */
  saleMenuItem: string;
  discountedPrice: number;
  /* ---- Claim Promotion ---- */
  claimReward: string;
  claimPoints: number;
};

const defaultValues: PromotionsFormValues = {
  photo: null,
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  claimLimit: 1,
  tierLimit: '',
  recurringEnabled: 'false',
  frequency: '',
  interval: 1,
  daysOfWeek: [],
  promotionType: 'happyHour',
  timeStart: '',
  timeEnd: '',
  pointsMultiplier: '1.5',
  menuItem: '',
  extraPoints: 0,
  saleMenuItem: '',
  discountedPrice: 0,
  claimReward: '',
  claimPoints: 0,
};

const schema = Yup.object().shape({
  photo: Yup.mixed().nullable().required('Promotion image is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
  endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date').typeError('Invalid date'),
  claimLimit: Yup.number()
    .transform((v, o) => (o === '' ? 1 : v))
    .min(1, 'Claim limit must be at least 1')
    .required('Claim limit is required'),
  tierLimit: Yup.string().required('Tier limit is required'),

  /* ---- Recurring ---- */
  recurringEnabled: Yup.string().oneOf(['true', 'false']).required(),
  frequency: Yup.string().when('recurringEnabled', {
    is: 'true',
    then: (s) => s.oneOf(['daily', 'weekly', 'monthly']).required('Frequency is required'),
    otherwise: (s) => s.notRequired(),
  }),
  interval: Yup.number()
    .transform((v, o) => (o === '' ? 1 : v))
    .when('recurringEnabled', {
      is: 'true',
      then: (s) => s.min(1, 'Interval must be ≥ 1').required(),
      otherwise: (s) => s.notRequired(),
    }),
  daysOfWeek: Yup.array()
    .of(Yup.string())
    .when(['recurringEnabled', 'frequency'], {
      is: (enabled: string, freq: string) => enabled === 'true' && (freq === 'weekly' || freq === 'monthly'),
      then: (s) => s.min(1, 'Select at least one day').required(),
      otherwise: (s) => s.notRequired(),
    }),

  promotionType: Yup.string().oneOf(['happyHour', 'claimPromotion', 'buyMenuItemPromotion', 'productSale']).required('Promotion type is required'),

  /* ---- Happy Hour ---- */
  timeStart: Yup.string().when('promotionType', {
    is: 'happyHour',
    then: (s) => s.required('Start time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time'),
    otherwise: (s) => s.notRequired(),
  }),
  timeEnd: Yup.string().when('promotionType', {
    is: 'happyHour',
    then: (s) => s.required('End time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time'),
    otherwise: (s) => s.notRequired(),
  }),
  pointsMultiplier: Yup.string().when('promotionType', {
    is: 'happyHour',
    then: (s) => s.required('Multiplier is required'),
    otherwise: (s) => s.notRequired(),
  }),

  /* ---- Buy Menu Item ---- */
  menuItem: Yup.string().when('promotionType', {
    is: 'buyMenuItemPromotion',
    then: (s) => s.required('Menu item is required'),
    otherwise: (s) => s.notRequired(),
  }),
  extraPoints: Yup.number()
    .transform((v, o) => (o === '' ? 0 : v))
    .when('promotionType', {
      is: 'buyMenuItemPromotion',
      then: (s) => s.min(1, 'Extra points ≥ 1').required('Extra points required'),
      otherwise: (s) => s.notRequired(),
    }),

  /* ---- Product Sale ---- */
  saleMenuItem: Yup.string().when('promotionType', {
    is: 'productSale',
    then: (s) => s.required('Menu item is required'),
    otherwise: (s) => s.notRequired(),
  }),
  discountedPrice: Yup.number()
    .transform((v, o) => (o === '' ? 0 : v))
    .when('promotionType', {
      is: 'productSale',
      then: (s) => s.min(0.01, 'Price > 0').required('Discounted price required'),
      otherwise: (s) => s.notRequired(),
    }),

  /* ---- Claim Promotion ---- */
  claimReward: Yup.string().when('promotionType', {
    is: 'claimPromotion',
    then: (s) => s.required('Reward is required'),
    otherwise: (s) => s.notRequired(),
  }),
  // claimPoints: Yup.number()
  //   .transform((v, o) => (o === '' ? 0 : v))
  //   .when('promotionType', {
  //     is: 'claimPromotion',
  //     then: (s) => s.min(1, 'Points ≥ 1').required('Claim points required'),
  //     otherwise: (s) => s.notRequired(),
  //   }),
  claimPoints: Yup.number()
    .transform((v, o) => (o === '' ? 0 : v))
    .when('promotionType', {
      is: 'claimPromotion',
      then: (s) => s.min(0, 'Points cannot be negative').required('Claim points required'),
      otherwise: (s) => s.notRequired(),
    }),
});

type PromotionModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  global?: boolean;
  selectedCompany?: any;
};

const PromotionModal = ({ open, onClose, isEdit = false, selectedData, global = false, selectedCompany }: PromotionModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const [updateScope, setUpdateScope] = useState<string | null>(null);

  // Check if this is a child of a recurring promotion
  const isRecurringChild = isEdit && selectedData?.recurringMeta?.parentPromotion !== null;
  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [addPromotion, { isLoading: addLoading }] = useAddPromotionMutation();
  const [updatePromotion, { isLoading: updateLoading }] = useUpdatePromotionMutation();

  const methods = useForm<PromotionsFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  // Tiers ----------------------------------
  const { data: tiersData, isLoading: tiersLoading } = useGetAllOrganizerTiersQuery({
    page: 0,
    search: '',
    limit: '100',
  });

  const tiersOptions =
    tiersData?.data?.map((tier: any) => ({
      label: tier?.title,
      value: tier?._id,
    })) || [];

  // Menu Items ----------------------------------
  const { data: menuItemsData, isLoading: menuItemsLoading } = useGetMenuItemsQuery(
    {
      page: 0,
      search: '',
      limit: '100',
      status: '',
      date: undefined,
      companyOrganizer: selectedCompany || undefined,
    },
    {
      skip: global,
    }
  );

  const menuItemOptions =
    menuItemsData?.data?.map((menuItem: any) => ({
      label: menuItem?.title,
      value: menuItem?._id,
    })) || [];

  // Rewards ----------------------------------
  const { data: rewardData, isLoading: rewardsLoading } = useGetAllCompanyRewardsQuery({
    page: 0,
    search: '',
    limit: '100',
  });

  const rewardOptions =
    rewardData?.data?.map((reward: any) => ({
      label: reward?.title,
      value: reward?._id,
    })) || [];

  const promotionType = watch('promotionType');
  const recurringEnabled = watch('recurringEnabled') === 'true';
  const frequency = watch('frequency');

  useEffect(() => {
    if (!isEdit || !selectedData) return;

    const {
      image,
      title,
      description,
      startDate,
      endDate,
      tierLimit,
      claimLimit,
      recurringDetails,
      promotionType,
      pointsMultiplier,
      menuItem,
      discountedPrice,
      reward,
      claimPoints,
    } = selectedData;

    const mapped: Partial<PromotionsFormValues> = {
      photo: image || null,
      title: title || '',
      description: description || '',
      startDate: startDate ? new Date(startDate) : '',
      endDate: endDate ? new Date(endDate) : '',
      claimLimit: claimLimit || 1,
      tierLimit: tierLimit?._id || '',
      promotionType: promotionType as any,

      // recurring
      recurringEnabled: !recurringDetails || !recurringDetails.isEnabled ? 'false' : 'true',
      frequency: recurringDetails?.frequency || '',
      interval: recurringDetails?.interval || 1,
      daysOfWeek: recurringDetails?.daysOfWeek || [],
    };

    // Helper to convert 12-hour time (e.g., "03:21 PM") to 24-hour format (e.g., "15:21")
    const convertTo24Hour = (dateStr: string): string => {
      const timeMatch = dateStr?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!timeMatch) return '';
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const period = timeMatch[3].toUpperCase();
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    // type-specific
    if (promotionType === 'happyHour') {
      mapped.timeStart = convertTo24Hour(startDate) || '';
      mapped.timeEnd = convertTo24Hour(endDate) || '';
      mapped.pointsMultiplier = String(pointsMultiplier || 1.5);
    }
    if (promotionType === 'buyMenuItemPromotion') {
      mapped.menuItem = menuItem?._id || '';
      mapped.extraPoints = selectedData.extraPoints || 0;
    }
    if (promotionType === 'productSale') {
      mapped.saleMenuItem = menuItem?._id || '';
      mapped.discountedPrice = discountedPrice || 0;
    }
    if (promotionType === 'claimPromotion') {
      mapped.claimReward = reward?._id || reward || '';
      mapped.claimPoints = claimPoints || 0;
    }

    reset(mapped as PromotionsFormValues);
  }, [isEdit, selectedData, reset]);

  function formatDateWithTime(dateInput: Date | string, time: string): string {
    // Returns 'YYYY-MM-DD hh:mm A' format
    const pad = (n: number) => n.toString().padStart(2, '0');
    const date = new Date(dateInput);
    if (time) {
      const [h, m] = time.split(':').map(Number);
      date.setHours(h, m, 0, 0);
    }
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeStr = pad(hours) + ':' + minutes + ' ' + ampm;
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + timeStr;
  }

  const transformToPayload = (data: PromotionsFormValues) => {
    const base: any = {
      title: data.title,
      description: data.description,
      startDate: fDate(data.startDate, formatStr.paramCase.db),
      endDate: fDate(data.endDate, formatStr.paramCase.db),
      tierLimit: data.tierLimit,
      promotionType: data.promotionType,
    };

    // Only include claimLimit for non-productSale promotion types
    if (data.promotionType !== 'productSale') {
      base.claimLimit = data.claimLimit;
    }

    // Recurring: only if enabled
    if (data.recurringEnabled === 'true') {
      base.recurringDetails = {
        isEnabled: true,
        frequency: data.frequency,
        interval: data.interval,
        daysOfWeek: data.daysOfWeek,
        endType: 'onDate',
        endDate: fDate(data.endDate, formatStr.paramCase.db),
      };
    }

    // Type-specific
    switch (data.promotionType) {
      case 'happyHour': {
        base.startDate = formatDateWithTime(data.startDate, data.timeStart);
        base.endDate = formatDateWithTime(data.endDate, data.timeEnd);
        base.pointsMultiplier = parseFloat(data.pointsMultiplier);
        break;
      }
      case 'buyMenuItemPromotion':
        base.menuItem = data.menuItem;
        base.extraPoints = data.extraPoints;
        break;
      case 'productSale':
        base.menuItem = data.saleMenuItem;
        base.discountedPrice = data.discountedPrice;
        break;
      case 'claimPromotion':
        base.reward = data.claimReward;
        base.claimPoints = data.claimPoints;
        break;
    }

    return base;
  };

  const handleSubmit = async (formData: any, scope?: string) => {
    let uploadedFileKey: string | null = null;

    if (scope) {
      setUpdateScope(scope);
    }

    try {
      // Check if start date is in the past (only for new promotions)
      if (!isEdit) {
        const startDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

        if (startDate < today) {
          showError('Start date cannot be in the past');
          return;
        }
      }

      // Check happyHour time logic
      // if (formData.promotionType === 'happyHour') {
      //   const start = formData.timeStart;
      //   const end = formData.timeEnd;
      //   if (start && end) {
      //     // Compare as HH:mm
      //     const [startH, startM] = start.split(':').map(Number);
      //     const [endH, endM] = end.split(':').map(Number);
      //     const startMinutes = startH * 60 + startM;
      //     const endMinutes = endH * 60 + endM;
      //     if (endMinutes <= startMinutes) {
      //       showError('End time must be after start time');
      //       return;
      //     }
      //   }
      // }

      if (formData.photo instanceof FileList && formData.photo.length > 0) {
        uploadedFileKey = await uploadImage(formData.photo[0]);
      }

      const payload = transformToPayload(formData);
      if (!payload) return;

      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      } else if (!isEdit && selectedData?.image) {
        // Only send image in non-edit mode if it exists
        payload.image = selectedData.image;
      }

      if (isEdit && selectedData?._id) {
        payload.id = selectedData._id;
        payload.status = selectedData.status;
      }

      const response = isEdit ? await updatePromotion({ ...payload, ...(scope && { scope }) }).unwrap() : await addPromotion(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Promotion updated' : 'Promotion created'));
      methods.reset(defaultValues);
      setUpdateScope(null);
      onClose();
    } catch (err: any) {
      if (uploadedFileKey) {
        setDeleting(true);
        await deleteFileFromAzure(uploadedFileKey).finally(() => setDeleting(false));
      }
      showError(getErrorMessage(err));
      setUpdateScope(null);
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[640px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit((data) => handleSubmit(data))}>
              <div className="mt-7 flex w-full flex-col gap-4">
                {/* IMAGE */}
                <RHFUploadAvatar name="photo" label="Promotion Image" />

                {/* TYPE */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFSelectField
                    name="promotionType"
                    label="Promotion Type"
                    placeholder="Select Type"
                    disabled={isEdit}
                    options={[
                      { label: 'Happy Hour', value: 'happyHour' },
                      { label: 'Claim Promotion', value: 'claimPromotion' },
                      ...(!global ? [{ label: 'Buy Menu Item (Extra Points)', value: 'buyMenuItemPromotion' }] : []),
                      ...(!global ? [{ label: 'Product Sale', value: 'productSale' }] : []),
                    ]}
                  />
                </div>

                {/* TIER */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="title" label="Title" placeholder="Enter Title" />
                  {tiersLoading ? (
                    <div className="mt-2 w-full space-y-2">
                      <Skeleton className="ml-1 h-3 w-20 rounded-4xl border-gray-200 px-5" />
                      <Skeleton className="h-8 rounded-4xl border-gray-200 px-5" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="tierLimit"
                      label="Tier Limit"
                      placeholder="Minimum tier required"
                      options={tiersOptions}
                      isLoading={tiersLoading}
                      showNone={false}
                    />
                  )}
                </div>

                {/* DATES */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFDate name="startDate" label="Start Date" placeholder="Select Start Date" minDate={isEdit ? undefined : new Date()} />
                  <RHFDate name="endDate" label="End Date" placeholder="Select End Date" />
                </div>

                {/* CLAIM LIMIT (excluded for Product Sale) */}
                {promotionType !== 'productSale' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField name="claimLimit" label="Claim Limit" placeholder="Enter claim limit" type="number" />
                  </div>
                )}

                {/* RECURRING TOGGLE */}
                <RHFSelectField
                  name="recurringEnabled"
                  label="Recurring"
                  placeholder="Enable recurring"
                  options={[
                    { label: 'No', value: 'false' },
                    { label: 'Yes', value: 'true' },
                  ]}
                />

                {/* RECURRING FIELDS */}
                {recurringEnabled && (
                  <>
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      <RHFSelectField
                        name="frequency"
                        label="Frequency"
                        placeholder="Select Frequency"
                        options={[
                          { label: 'Daily', value: 'daily' },
                          { label: 'Weekly', value: 'weekly' },
                          { label: 'Monthly', value: 'monthly' },
                        ]}
                      />
                      <RHFTextField name="interval" label="Interval" placeholder="e.g. 1" type="number" />
                    </div>

                    {(frequency === 'weekly' || frequency === 'monthly') && (
                      <RHFMultiSelectField
                        name="daysOfWeek"
                        label="Days"
                        placeholder="Select days"
                        options={[
                          { label: 'Mon', value: 'mon' },
                          { label: 'Tue', value: 'tue' },
                          { label: 'Wed', value: 'wed' },
                          { label: 'Thu', value: 'thu' },
                          { label: 'Fri', value: 'fri' },
                          { label: 'Sat', value: 'sat' },
                          { label: 'Sun', value: 'sun' },
                        ]}
                      />
                    )}
                  </>
                )}

                {/* CLAIM PROMOTION FIELDS */}
                {promotionType === 'claimPromotion' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFCustomDropdown
                      name="claimReward"
                      label="Claim Reward"
                      placeholder="Select Reward"
                      options={rewardOptions}
                      isLoading={rewardsLoading}
                      showNone={false}
                    />
                    <RHFTextField name="claimPoints" label="Points Required" placeholder="0" type="number" />
                  </div>
                )}

                {/* DESCRIPTION */}
                <RHFTextField name="description" label="Description" placeholder="Enter Description" multiline rows={2} />

                {/* HAPPY HOUR */}
                {promotionType === 'happyHour' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField name="timeStart" label="Promotion Time Start" placeholder="17:00" type="time" />
                    <RHFTextField name="timeEnd" label="Promotion Time End" placeholder="20:00" type="time" />
                    <RHFSelectField
                      name="pointsMultiplier"
                      label="Points Multiplier"
                      placeholder="Select"
                      options={[
                        { label: '1.1x', value: '1.1' },
                        { label: '1.5x', value: '1.5' },
                        { label: '2x', value: '2' },
                        { label: '3x', value: '3' },
                      ]}
                    />
                  </div>
                )}

                {/* BUY MENU ITEM */}
                {promotionType === 'buyMenuItemPromotion' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFCustomDropdown
                      name="menuItem"
                      label="Menu Item"
                      placeholder="Select Menu Item"
                      options={menuItemOptions}
                      isLoading={menuItemsLoading}
                      showNone={false}
                    />
                    <RHFTextField name="extraPoints" label="Extra Points" placeholder="0" type="number" />
                  </div>
                )}

                {/* PRODUCT SALE */}
                {promotionType === 'productSale' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFCustomDropdown
                      name="saleMenuItem"
                      label="Menu Item"
                      placeholder="Select Item"
                      options={menuItemOptions}
                      isLoading={menuItemsLoading}
                      showNone={false}
                    />
                    <RHFTextField name="discountedPrice" label="Discounted Price" placeholder="0.00" type="number" step="0.01" />
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <div className="mt-5 flex items-center justify-end gap-2">
                <div className="flex w-full flex-col items-center justify-center gap-3 md:flex-row">
                  <Button type="button" variant="outline" onClick={handleClose} className="w-full px-7 md:w-auto">
                    Cancel
                  </Button>

                  {isEdit && isRecurringChild ? (
                    // Two buttons for recurring child promotions
                    <>
                      {updateLoading && updateScope === 'single' ? (
                        <Button disabled className="bg-primary hover:bg-primary w-full cursor-not-allowed px-4 py-2 text-white md:w-auto">
                          <ButtonLoading title="Updating" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="bg-primary hover:bg-primary-dark w-full cursor-pointer px-4 py-2 text-white md:w-auto"
                          disabled={!isDirty || (updateLoading && updateScope === 'future') || imageUploading || deleting}
                          onClick={() => {
                            setUpdateScope('single');
                            methods.handleSubmit((data) => handleSubmit(data, 'single'))();
                          }}
                        >
                          Update This Promotion
                        </Button>
                      )}

                      {updateLoading && updateScope === 'future' ? (
                        <Button disabled className="bg-primary hover:bg-primary w-full cursor-not-allowed px-4 py-2 text-white md:w-auto">
                          <ButtonLoading title="Updating" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="bg-primary hover:bg-primary-dark w-full cursor-pointer px-4 py-2 text-white md:w-auto"
                          disabled={!isDirty || (updateLoading && updateScope === 'single') || imageUploading || deleting}
                          onClick={() => {
                            setUpdateScope('future');
                            methods.handleSubmit((data) => handleSubmit(data, 'future'))();
                          }}
                        >
                          Update All Further
                        </Button>
                      )}
                    </>
                  ) : (
                    // Single button for non-recurring or parent promotions
                    <>
                      {addLoading || updateLoading || imageUploading || deleting ? (
                        <Button disabled className="bg-primary hover:bg-primary w-full cursor-not-allowed px-4 py-2 text-white md:w-auto">
                          <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark w-full cursor-pointer px-4 py-2 text-white md:w-auto"
                          disabled={isEdit ? !isDirty : false}
                        >
                          {isEdit ? 'Update Promotion' : 'Create Promotion'}
                        </Button>
                      )}
                    </>
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

export default PromotionModal;
