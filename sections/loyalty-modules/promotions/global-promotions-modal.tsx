'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetLevelStatusQuery } from '@/store/Reducer/level-status-api';
import { useAddPromotionMutation, useUpdatePromotionMutation } from '@/store/Reducer/promotion-api';
import { useGetRewardsQuery } from '@/store/Reducer/rewards-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { fDate, formatStr } from '@/utils/format-time';
import { to24HourTime } from '@/utils/time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type GlobalPromotionsFormValues = {
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
  promotionType: 'globalHappyHourPromotion' | 'globalClaimPromotion';
  /* ---- Global Happy Hour ---- */
  timeStart: string;
  timeEnd: string;
  pointsMultiplier: string;
  /* ---- Global Claim Promotion ---- */
  claimReward: string;
  claimPoints: number;
};

const defaultValues: GlobalPromotionsFormValues = {
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
  promotionType: 'globalHappyHourPromotion',
  timeStart: '',
  timeEnd: '',
  pointsMultiplier: '1.5',
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
  tierLimit: Yup.string().required('Level status is required'),

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

  promotionType: Yup.string().oneOf(['globalHappyHourPromotion', 'globalClaimPromotion']).required('Promotion type is required'),

  /* ---- Global Happy Hour ---- */
  timeStart: Yup.string().when('promotionType', {
    is: 'globalHappyHourPromotion',
    then: (s) => s.required('Start time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time'),
    otherwise: (s) => s.notRequired(),
  }),
  timeEnd: Yup.string().when('promotionType', {
    is: 'globalHappyHourPromotion',
    then: (s) => s.required('End time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time'),
    otherwise: (s) => s.notRequired(),
  }),
  pointsMultiplier: Yup.string().when('promotionType', {
    is: 'globalHappyHourPromotion',
    then: (s) => s.required('Multiplier is required'),
    otherwise: (s) => s.notRequired(),
  }),

  /* ---- Global Claim Promotion ---- */
  claimReward: Yup.string().when('promotionType', {
    is: 'globalClaimPromotion',
    then: (s) => s.required('Reward is required'),
    otherwise: (s) => s.notRequired(),
  }),
  claimPoints: Yup.number()
    .transform((v, o) => (o === '' ? 0 : v))
    .when('promotionType', {
      is: 'globalClaimPromotion',
      then: (s) => s.min(0, 'Points cannot be negative').required('Claim points required'),
      otherwise: (s) => s.notRequired(),
    }),
});

type GlobalPromotionModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  selectedCompany?: any;
};

const GlobalPromotionModal = ({ open, onClose, isEdit = false, selectedData }: GlobalPromotionModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const [updateScope, setUpdateScope] = useState<string | null>(null);

  // Check if this is a child of a recurring promotion
  const isRecurringChild = isEdit && selectedData?.recurringMeta?.parentPromotion !== null;
  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [addPromotion, { isLoading: addLoading }] = useAddPromotionMutation();
  const [updatePromotion, { isLoading: updateLoading }] = useUpdatePromotionMutation();

  const methods = useForm<GlobalPromotionsFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const { data: levelStatus, isLoading: levelStatusLoading } = useGetLevelStatusQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
    date: undefined,
  });

  const { data: rewardData, isLoading: rewardsLoading } = useGetRewardsQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
    date: undefined,
    isGlobal: true,
  });

  const levelStatusOptions =
    levelStatus?.data?.map((status: any) => ({
      label: status?.title,
      value: status?._id,
    })) || [];

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
      claimLimit,
      tierLimit,
      recurringDetails,
      promotionType,
      pointsMultiplier,
      reward,
      claimPoints,
    } = selectedData;

    const mapped: Partial<GlobalPromotionsFormValues> = {
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

    const extractTime24 = (dateValue: string): string => {
      if (!dateValue) return '';

      const timeMatch = dateValue.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (timeMatch?.[1]) {
        const normalized12h = timeMatch[1].replace(/\s+/g, ' ').trim().toUpperCase();
        return to24HourTime(normalized12h) || '';
      }

      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return '';

      return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`;
    };

    // type-specific
    if (promotionType === 'globalHappyHourPromotion') {
      mapped.timeStart = extractTime24(startDate) || '';
      mapped.timeEnd = extractTime24(endDate) || '';
      mapped.pointsMultiplier = String(pointsMultiplier || 1.5);
    }
    if (promotionType === 'globalClaimPromotion') {
      mapped.claimReward = reward?._id || reward || '';
      mapped.claimPoints = claimPoints || 0;
    }

    reset(mapped as GlobalPromotionsFormValues);
  }, [isEdit, selectedData, reset]);

  function formatDateWithTime(dateInput: Date | string, time: string): string {
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
    hours = hours ? hours : 12;
    const timeStr = pad(hours) + ':' + minutes + ' ' + ampm;
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + timeStr;
  }

  const transformToPayload = (data: GlobalPromotionsFormValues) => {
    const base: any = {
      title: data.title,
      description: data.description,
      startDate: fDate(data.startDate, formatStr.paramCase.db),
      endDate: fDate(data.endDate, formatStr.paramCase.db),
      claimLimit: data.claimLimit,
      tierLimit: data.tierLimit,
      promotionType: data.promotionType,
      isGlobal: true,
    };

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
      case 'globalHappyHourPromotion': {
        base.startDate = formatDateWithTime(data.startDate, data.timeStart);
        base.endDate = formatDateWithTime(data.endDate, data.timeEnd);
        base.pointsMultiplier = parseFloat(data.pointsMultiplier);
        break;
      }
      case 'globalClaimPromotion':
        base.reward = data.claimReward;
        base.claimPoints = data.claimPoints;
        break;
    }

    return base;
  };

  const handleSubmit = async (formData: any, scope?: string) => {
    let uploadedFileKey: string | null = null;
    const shouldForceFutureScope = isEdit && !scope && selectedData?.recurringDetails == null && formData?.recurringEnabled === 'true';
    const effectiveScope = shouldForceFutureScope ? 'future' : scope;

    // Set the scope for loading state tracking
    if (effectiveScope) {
      setUpdateScope(effectiveScope);
    }

    try {
      // Check if start date is in the past (only for new promotions)
      if (!isEdit) {
        const startDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
          showError('Start date cannot be in the past');
          return;
        }
      }

      // Check globalHappyHourPromotion time logic
      if (formData.promotionType === 'globalHappyHourPromotion') {
        const start = formData.timeStart;
        const end = formData.timeEnd;
        if (start && end) {
          const [startH, startM] = start.split(':').map(Number);
          const [endH, endM] = end.split(':').map(Number);
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;
          if (endMinutes <= startMinutes) {
            showError('End time must be after start time');
            return;
          }
        }
      }

      if (formData.photo instanceof FileList && formData.photo.length > 0) {
        uploadedFileKey = await uploadImage(formData.photo[0]);
      }

      const payload = transformToPayload(formData);
      if (!payload) return;

      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      } else if (!isEdit && selectedData?.image) {
        payload.image = selectedData.image;
      }

      if (isEdit && selectedData?._id) {
        payload.id = selectedData._id;
        payload.status = selectedData.status;
      }

      const response = isEdit
        ? await updatePromotion({ ...payload, ...(effectiveScope && { scope: effectiveScope }) }).unwrap()
        : await addPromotion(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Global promotion updated' : 'Global promotion created'));
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
            <DialogTitle>{isEdit ? 'Edit Global Promotion' : 'Create Global Promotion'}</DialogTitle>
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
                      { label: 'Global Happy Hour', value: 'globalHappyHourPromotion' },
                      { label: 'Global Claim Promotion', value: 'globalClaimPromotion' },
                    ]}
                  />
                </div>

                {/* TITLE & LEVEL STATUS */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="title" label="Title" placeholder="Enter Title" />
                  {levelStatusLoading ? (
                    <div className="mt-2 w-full space-y-2">
                      <Skeleton className="ml-1 h-3 w-20 rounded-4xl border-gray-200 px-5" />
                      <Skeleton className="h-8 rounded-4xl border-gray-200 px-5" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="tierLimit"
                      label="Level Status"
                      placeholder="Minimum level required"
                      options={levelStatusOptions}
                      isLoading={levelStatusLoading}
                      showNone={false}
                    />
                  )}
                </div>

                {/* DATES */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFDate name="startDate" label="Start Date" placeholder="Select Start Date" minDate={isEdit ? undefined : new Date()} />
                  <RHFDate name="endDate" label="End Date" placeholder="Select End Date" />
                </div>

                {/* CLAIM LIMIT */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="claimLimit" label="Claim Limit" placeholder="Enter claim limit" type="number" />
                </div>

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

                {/* GLOBAL CLAIM PROMOTION FIELDS */}
                {promotionType === 'globalClaimPromotion' && (
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

                {/* GLOBAL HAPPY HOUR */}
                {promotionType === 'globalHappyHourPromotion' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={methods.control}
                      name="timeStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotion Time Start</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="17:00" title="Promotion Time Start" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={methods.control}
                      name="timeEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotion Time End</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="20:00" title="Promotion Time End" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                          {isEdit ? 'Update Global Promotion' : 'Create Global Promotion'}
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

export default GlobalPromotionModal;
