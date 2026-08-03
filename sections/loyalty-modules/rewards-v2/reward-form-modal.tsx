'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFToggleField from '@/components/rhf/rhf-toggle-field';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { REWARD_CREATION_METHOD_HINTS, REWARD_CREATION_METHOD_OPTIONS, REWARD_REDEEM_DELAY_NOTICE } from './constants';
import { MOCK_EVENTS, MOCK_MENUS, MOCK_MENU_ITEMS, MOCK_TIERS } from './mock-data';
import RewardCalculatorPanel from './reward-calculator-panel';
import RewardMenuItemsField from './reward-menu-items-field';
import { Reward, RewardCreationMethod, RewardPayload } from './types';

/** Numbers are held as strings so empty inputs stay empty rather than becoming 0. */
interface RewardFormValues {
  image: unknown;
  creationMethod: RewardCreationMethod;
  menuId: string;
  menuItemIds: string[];
  eventId: string;
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
  description: string;
}

const ANY_TIER = 'any';

const optionalPositive = (message: string) =>
  yup.string().test('optional-positive', message, (value) => {
    if (!value) return true;
    return Number(value) > 0;
  });

const schema = yup.object({
  image: yup.mixed().nullable(),
  creationMethod: yup.string().required('Creation method is required'),
  menuId: yup.string().when('creationMethod', {
    is: 'buyMenuItemReward',
    then: (current) => current.required('Menu is required'),
    otherwise: (current) => current,
  }),
  menuItemIds: yup.array().of(yup.string().required()).when('creationMethod', {
    is: 'buyMenuItemReward',
    then: (current) => current.min(1, 'Add at least one menu item'),
    otherwise: (current) => current,
  }),
  eventId: yup.string().when('creationMethod', {
    is: 'ticketReward',
    then: (current) => current.required('Event is required'),
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
  tierLimit: yup.string(),
  percentOff: yup.string().test('is-valid-percent', 'Must be between 0 and 100', (value) => {
    if (!value) return true;
    const parsed = Number(value);
    return parsed >= 0 && parsed <= 100;
  }),
  endDate: yup.mixed<Date | string>().required('End date is required'),
  isActive: yup.boolean(),
  availableAsReward: yup.boolean(),
  challengeOnly: yup.boolean(),
  description: yup.string(),
});

const defaultValues: RewardFormValues = {
  image: null,
  creationMethod: 'customReward',
  menuId: '',
  menuItemIds: [],
  eventId: '',
  name: '',
  type: '',
  pointCost: '',
  totalLimit: '',
  maxClaimsPerUser: '',
  tierLimit: ANY_TIER,
  percentOff: '',
  endDate: '',
  isActive: true,
  availableAsReward: true,
  challengeOnly: false,
  description: '',
};

interface RewardFormModalProps {
  open: boolean;
  /** `null` opens the form in create mode. */
  reward: Reward | null;
  isSubmitting?: boolean;
  onSubmit: (payload: RewardPayload) => Promise<void>;
  onClose: () => void;
}

export const RewardFormModal: React.FC<RewardFormModalProps> = ({ open, reward, isSubmitting = false, onSubmit, onClose }) => {
  const isEdit = Boolean(reward);

  const methods = useForm<RewardFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues,
  });

  const { watch, reset, setValue, handleSubmit } = methods;

  const creationMethod = watch('creationMethod');
  const selectedMenuId = watch('menuId');
  const isActive = watch('isActive');

  // Reload whenever the modal opens so a stale draft never leaks into the next use.
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
      menuItemIds: reward.menuItemIds,
      eventId: reward.eventId || '',
      name: reward.name,
      type: reward.type,
      pointCost: String(reward.pointCost),
      totalLimit: reward.totalLimit === null ? '' : String(reward.totalLimit),
      maxClaimsPerUser: reward.maxClaimsPerUser === null ? '' : String(reward.maxClaimsPerUser),
      tierLimit: reward.tierLimit || ANY_TIER,
      percentOff: String(reward.percentOff),
      endDate: reward.endDate ? new Date(reward.endDate) : '',
      isActive: reward.status === 'active',
      availableAsReward: reward.availableAsReward,
      challengeOnly: reward.challengeOnly,
      description: reward.description,
    });
  }, [open, reward, reset]);

  // Switching method makes the other method's selections meaningless.
  useEffect(() => {
    if (creationMethod !== 'buyMenuItemReward') {
      setValue('menuId', '');
      setValue('menuItemIds', []);
    }
    if (creationMethod !== 'ticketReward') {
      setValue('eventId', '');
    }
  }, [creationMethod, setValue]);

  const menuOptions = useMemo(() => MOCK_MENUS.map((menu) => ({ value: menu.id, label: menu.name })), []);
  const eventOptions = useMemo(() => MOCK_EVENTS.map((event) => ({ value: event.id, label: event.name })), []);
  const tierOptions = useMemo(() => [{ value: ANY_TIER, label: 'Any tier' }, ...MOCK_TIERS.map((tier) => ({ value: tier.id, label: tier.name }))], []);

  // Narrow to the chosen menu; before one is picked every item is fair game.
  const menuItemOptions = useMemo(
    () => (selectedMenuId ? MOCK_MENU_ITEMS.filter((item) => item.menuId === selectedMenuId) : MOCK_MENU_ITEMS),
    [selectedMenuId]
  );

  const hint = REWARD_CREATION_METHOD_HINTS[creationMethod];

  const submit = async (values: RewardFormValues) => {
    try {
      const payload: RewardPayload = {
        name: values.name.trim(),
        image: typeof values.image === 'string' ? values.image : '',
        type: values.type.trim(),
        status: values.isActive ? 'active' : 'inactive',
        creationMethod: values.creationMethod,
        availableAsReward: values.availableAsReward,
        challengeOnly: values.challengeOnly,
        menuId: values.creationMethod === 'buyMenuItemReward' ? values.menuId : undefined,
        menuItemIds: values.creationMethod === 'buyMenuItemReward' ? values.menuItemIds : [],
        eventId: values.creationMethod === 'ticketReward' ? values.eventId : undefined,
        pointCost: Number(values.pointCost),
        totalLimit: values.totalLimit === '' ? null : Number(values.totalLimit),
        maxClaimsPerUser: values.maxClaimsPerUser === '' ? null : Number(values.maxClaimsPerUser),
        tierLimit: values.tierLimit === ANY_TIER ? '' : values.tierLimit,
        percentOff: values.percentOff === '' ? 0 : Number(values.percentOff),
        endDate: values.endDate instanceof Date ? values.endDate.toISOString().slice(0, 10) : String(values.endDate),
        description: values.description?.trim() || '',
      };

      await onSubmit(payload);
      reset(defaultValues);
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!"
      >
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

        <FormProvider methods={methods} onSubmit={handleSubmit(submit)}>
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
              <>
                <RHFCustomDropdown name="menuId" label="Select Menu" placeholder="Select menu" options={menuOptions} showNone={false} />
                <RewardMenuItemsField name="menuItemIds" options={menuItemOptions} />
              </>
            )}

            {creationMethod === 'ticketReward' && (
              <RHFCustomDropdown
                name="eventId"
                label="Select Event"
                placeholder="Choose event for ticket reward"
                options={eventOptions}
                showNone={false}
              />
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

              <RHFCustomDropdown name="tierLimit" label="Tier Limit" placeholder="Minimum tier required" options={tierOptions} showNone={false} />

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
            </div>

            <RHFTextField name="description" label="Description (optional)" placeholder="Enter reward details" multiline rows={3} />

            <RewardCalculatorPanel />
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
