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
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import ChallengeCalculatorPanel from '../components/challenge-calculator-panel';
import ChallengeItemsField from '../components/challenge-items-field';
import {
  CHALLENGE_REWARD_TYPE_HINTS,
  CHALLENGE_REWARD_TYPE_OPTIONS,
  CHALLENGE_TASK_TYPE_HINT,
  CHALLENGE_TASK_TYPE_OPTIONS,
} from '../constants';
import { MOCK_LINKED_REWARDS, MOCK_MENUS, MOCK_MENU_ITEMS, MOCK_TIERS } from '../mock-data';
import { Challenge, ChallengePayload, ChallengeRewardType, ChallengeTaskType } from '../types';

/** Numbers are held as strings so empty inputs stay empty rather than becoming 0. */
interface ChallengeFormValues {
  image: unknown;
  name: string;
  description: string;
  taskType: ChallengeTaskType;
  taskValue: string;
  qualifyingMenuId: string;
  qualifyingItemIds: string[];
  claimLimit: string;
  endDate: Date | string;
  tierLimit: string;
  rewardType: ChallengeRewardType;
  pointReward: string;
  rewardMenuId: string;
  rewardItemIds: string[];
  linkedRewardId: string;
  repeatable: boolean;
  isActive: boolean;
}

const ANY_TIER = 'any';

const schema = yup.object({
  image: yup.mixed().nullable(),
  name: yup.string().required('Challenge name is required'),
  description: yup.string(),
  taskType: yup.string().required('Task type is required'),
  taskValue: yup
    .string()
    .required('Task value is required')
    .test('is-positive', 'Task value must be greater than 0', (value) => Number(value) > 0),
  qualifyingMenuId: yup.string().when('taskType', {
    is: 'buyMenuItem',
    then: (current) => current.required('Menu is required'),
    otherwise: (current) => current,
  }),
  qualifyingItemIds: yup
    .array()
    .of(yup.string().required())
    .when('taskType', {
      is: 'buyMenuItem',
      then: (current) => current.min(1, 'Add at least one qualifying item'),
      otherwise: (current) => current,
    }),
  claimLimit: yup.string().test('optional-positive', 'Claim limit must be a positive number', (value) => {
    if (!value) return true;
    return Number(value) > 0;
  }),
  endDate: yup.mixed<Date | string>().required('End date is required'),
  tierLimit: yup.string(),
  rewardType: yup.string().required('Reward type is required'),
  pointReward: yup.string().when('rewardType', {
    is: 'points',
    then: (current) =>
      current.required('Point reward is required').test('is-positive', 'Point reward must be greater than 0', (value) => Number(value) > 0),
    otherwise: (current) => current,
  }),
  rewardMenuId: yup.string().when('rewardType', {
    is: 'menuItem',
    then: (current) => current.required('Menu is required'),
    otherwise: (current) => current,
  }),
  rewardItemIds: yup
    .array()
    .of(yup.string().required())
    .when('rewardType', {
      is: 'menuItem',
      then: (current) => current.min(1, 'Add at least one reward item'),
      otherwise: (current) => current,
    }),
  linkedRewardId: yup.string().when('rewardType', {
    is: 'linkedReward',
    then: (current) => current.required('Reward is required'),
    otherwise: (current) => current,
  }),
  repeatable: yup.boolean(),
  isActive: yup.boolean(),
});

const defaultValues: ChallengeFormValues = {
  image: null,
  name: '',
  description: '',
  taskType: 'visit',
  taskValue: '',
  qualifyingMenuId: '',
  qualifyingItemIds: [],
  claimLimit: '',
  endDate: '',
  tierLimit: ANY_TIER,
  rewardType: 'points',
  pointReward: '',
  rewardMenuId: '',
  rewardItemIds: [],
  linkedRewardId: '',
  repeatable: false,
  isActive: true,
};

interface ChallengeFormModalProps {
  open: boolean;
  /** `null` opens the form in create mode. */
  challenge: Challenge | null;
  isSubmitting?: boolean;
  onSubmit: (payload: ChallengePayload) => Promise<void>;
  onClose: () => void;
}

export const ChallengeFormModal: React.FC<ChallengeFormModalProps> = ({ open, challenge, isSubmitting = false, onSubmit, onClose }) => {
  const isEdit = Boolean(challenge);

  const methods = useForm<ChallengeFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues,
  });

  const { watch, reset, setValue, handleSubmit } = methods;

  const taskType = watch('taskType');
  const rewardType = watch('rewardType');
  const qualifyingMenuId = watch('qualifyingMenuId');
  const rewardMenuId = watch('rewardMenuId');
  const isActive = watch('isActive');

  // Reload whenever the modal opens so a stale draft never leaks into the next use.
  useEffect(() => {
    if (!open) return;

    if (!challenge) {
      reset(defaultValues);
      return;
    }

    reset({
      image: challenge.image || null,
      name: challenge.name,
      description: challenge.description,
      taskType: challenge.taskType,
      taskValue: String(challenge.taskValue),
      qualifyingMenuId: challenge.qualifyingMenuId || '',
      qualifyingItemIds: challenge.qualifyingItemIds,
      claimLimit: challenge.claimLimit === null ? '' : String(challenge.claimLimit),
      endDate: challenge.endDate ? new Date(challenge.endDate) : '',
      tierLimit: challenge.tierLimit || ANY_TIER,
      rewardType: challenge.rewardType,
      pointReward: challenge.pointReward ? String(challenge.pointReward) : '',
      rewardMenuId: challenge.rewardMenuId || '',
      rewardItemIds: challenge.rewardItemIds,
      linkedRewardId: challenge.linkedRewardId || '',
      repeatable: challenge.repeatable,
      isActive: challenge.status === 'active',
    });
  }, [open, challenge, reset]);

  // Leaving a branch makes its selections meaningless — drop them so they
  // cannot be submitted or trip validation from behind a hidden field.
  useEffect(() => {
    if (taskType !== 'buyMenuItem') {
      setValue('qualifyingMenuId', '');
      setValue('qualifyingItemIds', []);
    }
  }, [taskType, setValue]);

  useEffect(() => {
    if (rewardType !== 'points') setValue('pointReward', '');
    if (rewardType !== 'menuItem') {
      setValue('rewardMenuId', '');
      setValue('rewardItemIds', []);
    }
    if (rewardType !== 'linkedReward') setValue('linkedRewardId', '');
  }, [rewardType, setValue]);

  const menuOptions = useMemo(() => MOCK_MENUS.map((menu) => ({ value: menu.id, label: menu.name })), []);
  const tierOptions = useMemo(() => [{ value: ANY_TIER, label: 'Any tier' }, ...MOCK_TIERS.map((tier) => ({ value: tier.id, label: tier.name }))], []);
  const linkedRewardOptions = useMemo(() => MOCK_LINKED_REWARDS.map((reward) => ({ value: reward.id, label: reward.name })), []);

  // Narrow to the chosen menu; before one is picked every item is fair game.
  const qualifyingItemOptions = useMemo(
    () => (qualifyingMenuId ? MOCK_MENU_ITEMS.filter((item) => item.menuId === qualifyingMenuId) : MOCK_MENU_ITEMS),
    [qualifyingMenuId]
  );

  const rewardItemOptions = useMemo(
    () => (rewardMenuId ? MOCK_MENU_ITEMS.filter((item) => item.menuId === rewardMenuId) : MOCK_MENU_ITEMS),
    [rewardMenuId]
  );

  const rewardHint = CHALLENGE_REWARD_TYPE_HINTS[rewardType];

  const submit = async (values: ChallengeFormValues) => {
    try {
      const payload: ChallengePayload = {
        name: values.name.trim(),
        image: typeof values.image === 'string' ? values.image : '',
        description: values.description?.trim() || '',
        taskType: values.taskType,
        rewardType: values.rewardType,
        status: values.isActive ? 'active' : 'inactive',
        taskValue: Number(values.taskValue),
        qualifyingMenuId: values.taskType === 'buyMenuItem' ? values.qualifyingMenuId : undefined,
        qualifyingItemIds: values.taskType === 'buyMenuItem' ? values.qualifyingItemIds : [],
        pointReward: values.rewardType === 'points' ? Number(values.pointReward) : 0,
        rewardMenuId: values.rewardType === 'menuItem' ? values.rewardMenuId : undefined,
        rewardItemIds: values.rewardType === 'menuItem' ? values.rewardItemIds : [],
        linkedRewardId: values.rewardType === 'linkedReward' ? values.linkedRewardId : undefined,
        repeatable: values.repeatable,
        claimLimit: values.claimLimit === '' ? null : Number(values.claimLimit),
        endDate: values.endDate instanceof Date ? values.endDate.toISOString().slice(0, 10) : String(values.endDate),
        tierLimit: values.tierLimit === ANY_TIER ? '' : values.tierLimit,
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
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">{isEdit ? 'Edit Challenge' : 'Create Challenge'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-4">
            <RHFUploadAvatar name="image" label="Challenge Image" initialImage={challenge?.image || null} />

            <RHFTextField name="name" label="Challenge Name" placeholder="Enter Challenge Name" />

            <RHFTextField name="description" label="Description (optional)" placeholder="Enter Challenge Description" multiline rows={3} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelectField
                name="taskType"
                label="Task Type"
                placeholder="Select task type"
                className="w-full"
                options={CHALLENGE_TASK_TYPE_OPTIONS}
              />

              <RHFTextField name="taskValue" label="Task Value (X)" placeholder="Enter value (e.g. 5)" type="number" min="1" />
            </div>

            {taskType === 'buyMenuItem' && (
              <>
                <div className={cn('rounded-lg border px-3 py-2.5', CHALLENGE_TASK_TYPE_HINT.className)}>
                  <p className="text-xs leading-relaxed">
                    💡 {CHALLENGE_TASK_TYPE_HINT.lead} <span className="font-semibold">{CHALLENGE_TASK_TYPE_HINT.emphasis}</span>{' '}
                    {CHALLENGE_TASK_TYPE_HINT.trail}
                  </p>
                </div>

                {/* Full width and stacked — the selected chips wrap freely instead
                    of stretching a half-width column out of line. */}
                <RHFCustomDropdown name="qualifyingMenuId" label="Select Menu" placeholder="Select menu" options={menuOptions} showNone={false} />

                <ChallengeItemsField
                  name="qualifyingItemIds"
                  label="Add Qualifying Items"
                  placeholder="Choose item to add..."
                  options={qualifyingItemOptions}
                />
              </>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFTextField name="claimLimit" label="Claim Limit (optional)" placeholder="Max claims across all users" type="number" min="1" />

              {/* Editing an already-ended challenge must not be blocked by the "future dates only" rule. */}
              <RHFDate name="endDate" label="End Date" placeholder="Select end date" minDate={isEdit ? new Date(0) : new Date()} />
            </div>

            <RHFCustomDropdown name="tierLimit" label="Tier Limit" placeholder="Select Tier Limit" options={tierOptions} showNone={false} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelectField
                name="rewardType"
                label="Reward Type"
                placeholder="Select reward type"
                className="w-full"
                options={CHALLENGE_REWARD_TYPE_OPTIONS}
              />

              {rewardType === 'points' && <RHFTextField name="pointReward" label="Point Reward" placeholder="Enter points" type="number" min="1" />}
            </div>

            {rewardHint && (
              <div className={cn('rounded-lg border px-3 py-2.5', rewardHint.className)}>
                <p className="text-xs leading-relaxed">
                  💡 {rewardHint.lead}
                  {rewardHint.emphasis && (
                    <>
                      {' '}
                      <span className="font-semibold">{rewardHint.emphasis}</span> {rewardHint.trail}
                    </>
                  )}
                </p>
              </div>
            )}

            {rewardType === 'menuItem' && (
              <>
                <RHFCustomDropdown name="rewardMenuId" label="Select Menu" placeholder="Select menu" options={menuOptions} showNone={false} />

                <ChallengeItemsField
                  name="rewardItemIds"
                  label="Add Reward Items"
                  placeholder="Choose item to add..."
                  options={rewardItemOptions}
                />
              </>
            )}

            {rewardType === 'linkedReward' && (
              <RHFCustomDropdown
                name="linkedRewardId"
                label="Select Reward"
                placeholder="Choose existing reward..."
                options={linkedRewardOptions}
                showNone={false}
              />
            )}

            <div className="flex flex-col gap-3">
              <RHFToggleField
                name="repeatable"
                title="Allow Repeat Completions"
                description="After completing the challenge and claiming the reward, progress resets to 0 so the user can complete it again."
              />

              <RHFToggleField
                name="isActive"
                title="Status"
                badge={<CustomBadge variant={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</CustomBadge>}
                description="When inactive, this challenge is paused — it won't appear anywhere and can't be progressed. Historical data is preserved."
              />
            </div>

            <ChallengeCalculatorPanel />
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
                {isEdit ? 'Update Challenge' : 'Create Challenge'}
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeFormModal;
