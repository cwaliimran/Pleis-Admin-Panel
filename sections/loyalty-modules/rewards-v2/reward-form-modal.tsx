'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFToggleField from '@/components/rhf/rhf-toggle-field';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';
import { useGetEventsByCompanyOrganizerQuery } from '@/store/Reducer/events';
import { useGetMenuItemByMenuIdQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import type { ApiBooleanString, RewardWriteBody } from '@/store/Reducer/rewards-v2-api';
import { useCreateRewardV2Mutation, useUpdateRewardV2Mutation } from '@/store/Reducer/rewards-v2-api';
import { useGetTicketingByEventQuery } from '@/store/Reducer/ticketing-api';
import { useGetTiersQuery } from '@/store/Reducer/tiers-api';
import { LoyaltyUserType } from '../types';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  OPTIONS_PAGE_LIMIT,
  REWARD_CREATION_METHOD_HINTS,
  REWARD_CREATION_METHOD_OPTIONS,
  REWARD_REDEEM_DELAY_NOTICE,
} from './constants';
import RewardCalculatorPanel from './reward-calculator-panel';
import { Reward, RewardCreationMethod } from './types';

/** Numbers are held as strings so empty inputs stay empty rather than becoming 0. */
interface RewardFormValues {
  image: unknown;
  creationMethod: RewardCreationMethod;
  menuId: string;
  menuItemId: string;
  eventId: string;
  ticketId: string;
  name: string;
  type: string;
  pointCost: string;
  totalLimit: string;
  maxClaimsPerUser: string;
  tierLimit: string;
  percentOff: string;
  endDate: Date | string;
  isActive: boolean;
  availableAsReward: boolean;
  challengeOnly: boolean;
  isPromotionOnly: boolean;
  description: string;
}

const optionalPositive = (message: string) =>
  yup.string().test('optional-positive', message, (value) => {
    if (!value) return true;
    return Number(value) > 0;
  });

const schema = yup.object({
  image: yup.mixed().required('Image is required'),
  creationMethod: yup.string().required('Creation method is required'),

  menuId: yup.string().when('creationMethod', {
    is: 'buyMenuItemReward',
    then: (current) => current.required('Menu is required'),
    otherwise: (current) => current,
  }),
  menuItemId: yup.string().when('creationMethod', {
    is: 'buyMenuItemReward',
    then: (current) => current.required('Menu item is required'),
    otherwise: (current) => current,
  }),

  eventId: yup.string().when('creationMethod', {
    is: 'ticketReward',
    then: (current) => current.required('Event is required'),
    otherwise: (current) => current,
  }),
  ticketId: yup.string().when('creationMethod', {
    is: 'ticketReward',
    then: (current) => current.required('Ticket is required'),
    otherwise: (current) => current,
  }),

  name: yup.string().required('Reward name is required'),
  type: yup.string().required('Type is required'),
  pointCost: yup
    .string()
    .required('Point value is required')
    .test('is-positive', 'Point value must be greater than 0', (value) => Number(value) > 0),
  totalLimit: optionalPositive('Claim limit must be a positive number'),
  maxClaimsPerUser: optionalPositive('Max claims per user must be a positive number'),
  tierLimit: yup.string().required('Tier limit is required'),
  percentOff: yup.string().test('is-valid-percent', 'Must be between 0 and 100', (value) => {
    if (!value) return true;
    const parsed = Number(value);
    return parsed >= 0 && parsed <= 100;
  }),
  // `mixed().required()` treats '' as present, so the emptiness needs its own test.
  endDate: yup
    .mixed<Date | string>()
    .required('End date is required')
    .test('is-set', 'End date is required', (value) => Boolean(value)),
  isActive: yup.boolean(),
  availableAsReward: yup.boolean(),
  challengeOnly: yup.boolean(),
  isPromotionOnly: yup.boolean(),
  description: yup.string(),
});

const defaultValues: RewardFormValues = {
  image: null,
  creationMethod: 'customReward',
  menuId: '',
  menuItemId: '',
  eventId: '',
  ticketId: '',
  name: '',
  type: '',
  pointCost: '',
  totalLimit: '',
  maxClaimsPerUser: '',
  tierLimit: '',
  percentOff: '',
  endDate: '',
  isActive: true,
  availableAsReward: true,
  challengeOnly: false,
  isPromotionOnly: false,
  description: '',
};

/** The API stores an Azure blob key; a saved record hands back the full URL. */
const toBlobKey = (url: string): string => (url.includes('/') ? (url.split('/').pop() ?? '') : url);

const asBooleanString = (value: boolean): ApiBooleanString => (value ? 'true' : 'false');

const toDateOnly = (value: Date | string): string => {
  if (value instanceof Date) {
    // Local parts, so a late-evening pick does not roll back a day in UTC.
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
};

interface RewardFormModalProps {
  open: boolean;
  /** `null` opens the form in create mode. */
  reward: Reward | null;
  onClose: () => void;
  userType?: LoyaltyUserType;
}

export const RewardFormModal: React.FC<RewardFormModalProps> = ({ open, reward, onClose, userType = 'super-admin' }) => {
  const isEdit = Boolean(reward);

  // Organizers send no company — their token scopes the request.
  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? (companyId ?? undefined) : undefined;
  const companySkip = userType === 'super-admin' && !companyId;
  const { uploadImage, uploading } = useImageUpload();
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const [createReward, { isLoading: isCreating }] = useCreateRewardV2Mutation();
  const [updateReward, { isLoading: isUpdating }] = useUpdateRewardV2Mutation();

  const isSubmitting = isCreating || isUpdating || uploading || isCleaningUp;

  const methods = useForm<RewardFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues,
  });

  const { watch, reset, setValue, handleSubmit } = methods;

  const creationMethod = watch('creationMethod');
  const selectedMenuId = watch('menuId');
  const selectedEventId = watch('eventId');
  const isActive = watch('isActive');

  // ---------- Reference data ----------

  const { data: tiersData, isLoading: tiersLoading } = useGetTiersQuery(
    { page: 0, search: '', limit: OPTIONS_PAGE_LIMIT, status: '', date: undefined },
    { skip: !open }
  );

  const { data: menuData, isLoading: menuLoading } = useGetMenuListQuery(
    { page: 0, search: '', limit: OPTIONS_PAGE_LIMIT, status: '', date: undefined, companyOrganizer: scopedCompanyId },
    { skip: !open || creationMethod !== 'buyMenuItemReward' }
  );

  const { data: menuItemsData, isLoading: menuItemsLoading } = useGetMenuItemByMenuIdQuery(
    { menuId: selectedMenuId },
    { skip: !selectedMenuId || creationMethod !== 'buyMenuItemReward' }
  );

  const { data: eventData, isLoading: eventsLoading } = useGetEventsByCompanyOrganizerQuery(
    { page: 0, search: '', limit: OPTIONS_PAGE_LIMIT, companyOrganizer: scopedCompanyId },
    { skip: !open || creationMethod !== 'ticketReward' }
  );

  const { data: ticketData, isFetching: ticketsFetching } = useGetTicketingByEventQuery(
    { eventId: selectedEventId || undefined },
    { skip: !selectedEventId || creationMethod !== 'ticketReward' }
  );

  const tierOptions = useMemo(
    () => (tiersData?.data ?? []).map((tier: { _id: string; title: string }) => ({ value: tier._id, label: tier.title })),
    [tiersData]
  );

  const menuOptions = useMemo(
    () => (menuData?.data ?? []).map((menu: { _id: string; title: string }) => ({ value: menu._id, label: menu.title })),
    [menuData]
  );

  const menuItemOptions = useMemo(
    () => (menuItemsData?.data ?? []).map((item: { _id: string; title: string }) => ({ value: item._id, label: item.title })),
    [menuItemsData]
  );

  const eventOptions = useMemo(
    () => (eventData ?? []).map((event: { _id: string; basicInfo?: { title?: string } }) => ({ value: event._id, label: event.basicInfo?.title ?? '' })),
    [eventData]
  );

  const ticketOptions = useMemo(
    () => (ticketData?.data ?? []).map((ticket: { _id: string; title: string }) => ({ value: ticket._id, label: ticket.title })),
    [ticketData]
  );

  // ---------- Seeding ----------

  useEffect(() => {
    if (!open) return;

    if (!reward) {
      reset(defaultValues);
      return;
    }

    reset({
      image: reward.image || null,
      creationMethod: reward.creationMethod,
      menuId: reward.menuId || '',
      menuItemId: reward.menuItemId || '',
      eventId: reward.eventId || '',
      ticketId: reward.ticketId || '',
      name: reward.name,
      type: reward.type,
      pointCost: String(reward.pointCost),
      totalLimit: reward.totalLimit === null ? '' : String(reward.totalLimit),
      maxClaimsPerUser: reward.maxClaimsPerUser === null ? '' : String(reward.maxClaimsPerUser),
      tierLimit: reward.tierId || '',
      percentOff: String(reward.percentOff),
      endDate: reward.endDate ? new Date(reward.endDate) : '',
      isActive: reward.status === 'active',
      availableAsReward: reward.availableAsReward,
      challengeOnly: reward.challengeOnly,
      isPromotionOnly: reward.isPromotionOnly,
      description: reward.description,
    });
  }, [open, reward, reset]);

  // Switching method makes the other methods' selections meaningless.
  useEffect(() => {
    if (creationMethod !== 'buyMenuItemReward') {
      setValue('menuId', '');
      setValue('menuItemId', '');
    }
    if (creationMethod !== 'ticketReward') {
      setValue('eventId', '');
      setValue('ticketId', '');
    }
  }, [creationMethod, setValue]);

  // A ticket belongs to one event, so changing the event invalidates the pick.
  useEffect(() => {
    if (creationMethod !== 'ticketReward') return;
    if (reward?.eventId && reward.eventId === selectedEventId) return;
    setValue('ticketId', '');
  }, [selectedEventId, creationMethod, reward, setValue]);

  // ---------- Submit ----------

  /** Resolves an upload field to the blob key the API stores. */
  const resolveImageKey = async (value: unknown, uploaded: string[]): Promise<string> => {
    if (typeof value === 'string' && value) return toBlobKey(value);

    const file = value instanceof FileList ? value[0] : value instanceof File ? value : null;
    if (!file) return '';

    const key = await uploadImage(file);
    if (!key) throw new Error('Image upload failed');

    uploaded.push(key);
    return key;
  };

  /**
   * The dialog scrolls, so an inline error on a field above the fold is
   * invisible from the buttons — a submit would appear to do nothing. Surface
   * the first failure as a toast as well.
   */
  const reportInvalid = (errors: FieldErrors<RewardFormValues>) => {
    const firstMessage = Object.values(errors).find((entry) => entry?.message)?.message;
    showError(firstMessage ? String(firstMessage) : 'Please complete the highlighted fields.');
  };

  const submit = handleSubmit(async (values) => {
    if (companySkip) {
      showError('Please select a company first.');
      return;
    }

    // Tracked so a failed save does not leave orphaned blobs behind.
    const uploaded: string[] = [];

    try {
      const image = await resolveImageKey(values.image, uploaded);

      const body: RewardWriteBody = {
        rewardType: values.creationMethod,
        image,
        title: values.name.trim(),
        description: values.description?.trim() || '',
        sortingType: values.type.trim(),
        endDate: toDateOnly(values.endDate),
        minPointsRequiredToClaim: Number(values.pointCost),
        percentOff: values.percentOff === '' ? 0 : Number(values.percentOff),
        tierLimit: values.tierLimit,
        status: values.isActive ? 'active' : 'inactive',
        isPromotionOnly: values.isPromotionOnly,
        availableAsReward: asBooleanString(values.availableAsReward),
        challengeOnly: asBooleanString(values.challengeOnly),
      };

      if (values.totalLimit !== '') body.claimLimit = Number(values.totalLimit);
      if (values.maxClaimsPerUser !== '') body.maxLimitPerUser = Number(values.maxClaimsPerUser);

      if (values.creationMethod === 'buyMenuItemReward') {
        body.menuItem = values.menuItemId;
      }

      if (values.creationMethod === 'ticketReward') {
        body.event = values.eventId;
        body.ticket = values.ticketId;
      }

      const response =
        reward && isEdit
          ? await updateReward({ id: reward.id, ...(scopedCompanyId ? { companyOrganizer: scopedCompanyId } : {}), ...body }).unwrap()
          : await createReward({ ...(scopedCompanyId ? { companyOrganizer: scopedCompanyId } : {}), ...body }).unwrap();

      showSuccess(response?.message || (isEdit ? 'Reward updated' : 'Reward created'));
      reset(defaultValues);
      onClose();
    } catch (error) {
      if (uploaded.length > 0) {
        setIsCleaningUp(true);
        try {
          await Promise.all(uploaded.map((key) => deleteFileFromAzure(key)));
        } catch {
          // The save already failed; a stranded blob is not worth a second error.
        } finally {
          setIsCleaningUp(false);
        }
      }

      showError(getErrorMessage(error));
    }
  }, reportInvalid);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const hint = REWARD_CREATION_METHOD_HINTS[creationMethod];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">{isEdit ? 'Edit Reward' : 'Create Reward'}</DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/60 dark:bg-amber-900/20">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            {REWARD_REDEEM_DELAY_NOTICE.lead} <span className="font-semibold">{REWARD_REDEEM_DELAY_NOTICE.emphasis}</span>{' '}
            <span className="text-amber-700/70 italic dark:text-amber-300/70">{REWARD_REDEEM_DELAY_NOTICE.caveat}</span>
          </p>
        </div>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex flex-col gap-4">
            <RHFUploadAvatar name="image" label="" initialImage={reward?.image || null} />

            <RHFSelectField
              name="creationMethod"
              label="Creation Method"
              placeholder="Select creation method"
              className="w-full"
              disabled={isEdit}
              options={REWARD_CREATION_METHOD_OPTIONS}
            />

            <div className={cn('rounded-lg border px-3 py-2.5', hint.className)}>
              <p className="text-xs leading-relaxed">💡 {hint.text}</p>
            </div>

            {creationMethod === 'buyMenuItemReward' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RHFCustomDropdown
                  name="menuId"
                  label="Select Menu"
                  placeholder="Select menu"
                  options={menuOptions}
                  isLoading={menuLoading}
                  showNone={false}
                />
                <RHFCustomDropdown
                  name="menuItemId"
                  label="Select Menu Item"
                  placeholder="Select menu item"
                  options={menuItemOptions}
                  isLoading={menuItemsLoading}
                  showNone={false}
                  disabled={!selectedMenuId}
                />
              </div>
            )}

            {creationMethod === 'ticketReward' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RHFCustomDropdown
                  name="eventId"
                  label="Select Event"
                  placeholder="Choose event for ticket reward"
                  options={eventOptions}
                  isLoading={eventsLoading}
                  showNone={false}
                />
                <RHFCustomDropdown
                  name="ticketId"
                  label="Select Ticket"
                  placeholder="Choose ticket"
                  options={ticketOptions}
                  isLoading={ticketsFetching}
                  showNone={false}
                  disabled={!selectedEventId}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFTextField name="name" label="Name" placeholder="Enter reward name" />

              <RHFTextField name="type" label="Type" placeholder="Enter type for sorting" />

              <RHFTextField name="pointCost" label="Point Value" placeholder="Points required to claim" type="number" min="0" />

              <RHFTextField name="totalLimit" label="Claim Limit (Total)" placeholder="Max claims across all users" type="number" min="0" />

              <RHFTextField
                name="maxClaimsPerUser"
                label="Max Claim Per User"
                placeholder="How many times one user can claim"
                type="number"
                min="0"
              />

              <RHFCustomDropdown
                name="tierLimit"
                label="Tier Limit"
                placeholder="Minimum tier required"
                options={tierOptions}
                isLoading={tiersLoading}
                showNone={false}
              />

              <RHFTextField
                name="percentOff"
                label="Percent Off (optional)"
                placeholder="For coupon rewards (0–100)"
                type="number"
                min="0"
                max="100"
              />

              {/* Editing an already-ended reward must not be blocked by the "future dates only" rule. */}
              <RHFDate name="endDate" label="End Date" placeholder="Select end date" minDate={isEdit ? new Date(0) : new Date()} />
            </div>

            <div className="flex flex-col gap-3">
              <RHFToggleField
                name="isActive"
                title="Status"
                badge={<CustomBadge variant={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</CustomBadge>}
                description="When inactive, this reward is paused — it won't appear anywhere and can't be claimed. Historical data is preserved."
              />

              <RHFToggleField
                name="availableAsReward"
                title="Available as Reward"
                description="When off, this reward won't appear in the app's rewards list. It can still be linked from challenges and promotions."
              />

              <RHFToggleField
                name="challengeOnly"
                title="Challenge Only"
                description="Reward can only be obtained by completing a challenge, not by spending points directly."
              />

              <RHFToggleField
                name="isPromotionOnly"
                title="Promotion Only"
                description="Reward is surfaced through promotions rather than the general rewards list."
              />
            </div>

            <RHFTextField name="description" label="Description (optional)" placeholder="Enter reward details" multiline rows={3} />

            <RewardCalculatorPanel companyOrganizer={scopedCompanyId} userType={userType} />
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Button type="button" variant="outline" className="cursor-pointer px-6" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>

            {isSubmitting ? (
              <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
              </Button>
            ) : (
              <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white">
                {isEdit ? 'Update Reward' : 'Create Reward'}
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RewardFormModal;
