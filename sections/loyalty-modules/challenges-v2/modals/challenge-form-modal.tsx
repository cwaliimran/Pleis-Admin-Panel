'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFToggleField from '@/components/rhf/rhf-toggle-field';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';
import type { ChallengeRewardWriteBody, ChallengeWriteBody } from '@/store/Reducer/challenges-v2-api';
import { useCreateChallengeV2Mutation, useUpdateChallengeV2Mutation } from '@/store/Reducer/challenges-v2-api';
import { useGetMenuItemsQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetRewardsV2Query } from '@/store/Reducer/rewards-v2-api';
import { useGetTiersQuery } from '@/store/Reducer/tiers-api';
import { LoyaltyUserType } from '../../types';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import ChallengeCalculatorPanel from '../components/challenge-calculator-panel';

import {
  CHALLENGE_REWARD_TYPE_HINTS,
  CHALLENGE_REWARD_TYPE_LABELS,
  CHALLENGE_REWARD_TYPE_OPTIONS,
  CHALLENGE_TASK_TYPE_HINT,
  CHALLENGE_TASK_TYPE_OPTIONS,
} from '../constants';
import { Challenge, ChallengeItemRef, ChallengeRewardType, ChallengeTaskType } from '../types';
import { getSharedMenu } from '../utils';

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

const WRITABLE_REWARD_TYPES: ChallengeRewardType[] = ['points', 'menuItem', 'linkedReward'];

const useLinkedRewardOptionsQuery = (
  args: { page: number; limit: number; search: string } & Record<string, string | undefined>,
  options?: { skip?: boolean }
) => {
  const { data, isLoading, isFetching } = useGetRewardsV2Query(
    {
      companyOrganizer: args.companyOrganizer as string,
      page: args.page + 1,
      limit: args.limit,
      keyword: args.search || undefined,
      status: 'active',
    },
    options
  );

  const shaped = useMemo(() => (data ? { data: data.data, meta: data.meta ?? undefined } : undefined), [data]);

  return { data: shaped, isLoading, isFetching };
};

const schema = yup.object({
  image: yup.mixed().required('Challenge image is required'),
  name: yup.string().required('Challenge name is required'),
  description: yup.string(),
  taskType: yup.string().required('Task type is required'),
  taskValue: yup
    .string()
    .required('Task value is required')
    .test('is-positive', 'Task value must be greater than 0', (value) => Number(value) > 0),
  qualifyingMenuId: yup.string(),
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
  // `mixed().required()` treats '' as present, so the emptiness needs its own test.
  endDate: yup
    .mixed<Date | string>()
    .required('End date is required')
    .test('is-set', 'End date is required', (value) => Boolean(value)),
  tierLimit: yup.string().required('Tier limit is required'),
  rewardType: yup.string().required('Reward type is required'),
  pointReward: yup.string().when('rewardType', {
    is: 'points',
    then: (current) =>
      current.required('Point reward is required').test('is-positive', 'Point reward must be greater than 0', (value) => Number(value) > 0),
    otherwise: (current) => current,
  }),
  rewardMenuId: yup.string(),
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
  tierLimit: '',
  rewardType: 'points',
  pointReward: '',
  rewardMenuId: '',
  rewardItemIds: [],
  linkedRewardId: '',
  repeatable: false,
  isActive: true,
};

/** The API stores an Azure blob key; a saved record hands back the full URL. */
const toBlobKey = (url: string): string => (url.includes('/') ? (url.split('/').pop() ?? '') : url);

const toDateOnly = (value: Date | string): string => {
  if (value instanceof Date) {
    // Local parts, so a late-evening pick does not roll back a day in UTC.
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
};

const toInitialSelected = (refs: ChallengeItemRef[]) => (refs.length > 0 ? refs.map((ref) => ({ value: ref.id, label: ref.name })) : undefined);

interface ChallengeFormModalProps {
  open: boolean;
  /** `null` opens the form in create mode. */
  challenge: Challenge | null;
  onClose: () => void;
  userType?: LoyaltyUserType;
}

export const ChallengeFormModal: React.FC<ChallengeFormModalProps> = ({ open, challenge, onClose, userType = 'super-admin' }) => {
  const isEdit = Boolean(challenge);

  // Organizers send no company — their token scopes the request.
  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? (companyId ?? undefined) : undefined;
  const companySkip = userType === 'super-admin' && !companyId;
  const { uploadImage, uploading } = useImageUpload();
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const [createChallenge, { isLoading: isCreating }] = useCreateChallengeV2Mutation();
  const [updateChallenge, { isLoading: isUpdating }] = useUpdateChallengeV2Mutation();

  const isSubmitting = isCreating || isUpdating || uploading || isCleaningUp;

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

  // Only seeded when every chosen item sits in one menu — see `getSharedMenu`.
  const qualifyingMenu = useMemo(() => getSharedMenu(challenge?.taskMenuItems ?? []), [challenge]);
  const rewardMenu = useMemo(() => getSharedMenu(challenge?.rewardMenuItems ?? []), [challenge]);

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
      qualifyingMenuId: qualifyingMenu?.id ?? '',
      qualifyingItemIds: challenge.taskMenuItems.map((item) => item.id),
      claimLimit: challenge.claimLimit === null ? '' : String(challenge.claimLimit),
      endDate: challenge.endDate ? new Date(challenge.endDate) : '',
      tierLimit: challenge.tierId,
      rewardType: challenge.rewardType,
      pointReward: challenge.pointReward ? String(challenge.pointReward) : '',
      rewardMenuId: rewardMenu?.id ?? '',
      rewardItemIds: challenge.rewardMenuItems.map((item) => item.id),
      linkedRewardId: challenge.linkedRewardId,
      repeatable: challenge.repeatable,
      isActive: challenge.status === 'active',
    });
  }, [open, challenge, reset, qualifyingMenu, rewardMenu]);

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

  // Editing a legacy record must still show its own type rather than a blank select.
  const rewardTypeOptions = useMemo(() => {
    if (!challenge || WRITABLE_REWARD_TYPES.includes(challenge.rewardType)) return CHALLENGE_REWARD_TYPE_OPTIONS;

    return [...CHALLENGE_REWARD_TYPE_OPTIONS, { value: challenge.rewardType, label: CHALLENGE_REWARD_TYPE_LABELS[challenge.rewardType] }];
  }, [challenge]);

  const rewardHint = CHALLENGE_REWARD_TYPE_HINTS[rewardType];

  const companyArgs = useMemo(() => ({ companyOrganizer: scopedCompanyId }), [scopedCompanyId]);

  const qualifyingItemArgs = useMemo(
    () => ({ companyOrganizer: scopedCompanyId, menu: qualifyingMenuId || undefined }),
    [scopedCompanyId, qualifyingMenuId]
  );

  const rewardItemArgs = useMemo(
    () => ({ companyOrganizer: scopedCompanyId, menu: rewardMenuId || undefined }),
    [scopedCompanyId, rewardMenuId]
  );

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

  const buildReward = (values: ChallengeFormValues): ChallengeRewardWriteBody => {
    if (values.rewardType === 'points') return { rewardType: 'points', rewardValue: Number(values.pointReward) };
    if (values.rewardType === 'menuItem') return { rewardType: 'menuItem', rewardMenuItem: values.rewardItemIds };
    return { rewardType: 'linkedReward', linkedReward: values.linkedRewardId };
  };

  /**
   * The dialog scrolls, so an inline error on a field above the fold is
   * invisible from the buttons — a submit would appear to do nothing. Surface
   * the first failure as a toast as well.
   */
  const reportInvalid = (errors: FieldErrors<ChallengeFormValues>) => {
    const firstMessage = Object.values(errors).find((entry) => entry?.message)?.message;
    showError(firstMessage ? String(firstMessage) : 'Please complete the highlighted fields.');
  };

  const submit = handleSubmit(async (values) => {
    if (companySkip) {
      showError('Please select a company first.');
      return;
    }

    if (!WRITABLE_REWARD_TYPES.includes(values.rewardType)) {
      showError(`${CHALLENGE_REWARD_TYPE_LABELS[values.rewardType]} challenges cannot be saved here — choose another reward type.`);
      return;
    }

    // Tracked so a failed save does not leave orphaned blobs behind.
    const uploaded: string[] = [];

    try {
      const image = await resolveImageKey(values.image, uploaded);

      const body: ChallengeWriteBody = {
        companyOrganizer: scopedCompanyId,
        image,
        title: values.name.trim(),
        description: values.description?.trim() || '',
        taskType: values.taskType,
        taskValue: Number(values.taskValue),
        endDate: toDateOnly(values.endDate),
        tierLimit: values.tierLimit,
        repeatComplition: values.repeatable ? 'true' : 'false',
        status: values.isActive ? 'active' : 'inactive',
        reward: buildReward(values),
      };

      if (values.claimLimit !== '') body.claimLimit = Number(values.claimLimit);

      if (values.taskType === 'buyMenuItem') body.taskMenuItem = values.qualifyingItemIds;

      const response =
        challenge && isEdit ? await updateChallenge({ id: challenge.id, ...body }).unwrap() : await createChallenge(body).unwrap();

      showSuccess(response?.message || (isEdit ? 'Challenge updated' : 'Challenge created'));
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-180!">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">{isEdit ? 'Edit Challenge' : 'Create Challenge'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex flex-col gap-4">
            <RHFUploadAvatar name="image" label="Challenge Image" initialImage={challenge?.image || null} />

            <RHFTextField name="name" label="Challenge Name" placeholder="Enter Challenge Name" />

            <RHFTextField name="description" label="Description (optional)" placeholder="Enter Challenge Description" multiline rows={3} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* The task defines what progress has already been recorded against
                  the challenge, so it is fixed once the challenge exists. */}
              <RHFSelectField
                name="taskType"
                label="Task Type"
                placeholder="Select task type"
                className="w-full"
                disabled={isEdit}
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

                {/* Stacked, not side by side — the selected chips wrap freely
                    instead of stretching a half-width column out of line. */}
                <RHFAsyncCombobox
                  name="qualifyingMenuId"
                  label="Select Menu (optional)"
                  placeholder="Select menu"
                  searchPlaceholder="Search menus..."
                  selectedLabel={qualifyingMenu?.name || undefined}
                  useOptionsQuery={useGetMenuListQuery}
                  queryArgs={companyArgs}
                  skip={companySkip}
                  getOptionValue={(menu) => menu._id}
                  getOptionLabel={(menu) => menu.title}
                  onValueChange={(value) => {
                    if (value !== qualifyingMenuId) setValue('qualifyingItemIds', []);
                  }}
                />

                <RHFAsyncCombobox
                  name="qualifyingItemIds"
                  label="Add Qualifying Items"
                  placeholder="Choose items to add..."
                  searchPlaceholder="Search menu items..."
                  multiple
                  initialSelected={toInitialSelected(challenge?.taskMenuItems ?? [])}
                  useOptionsQuery={useGetMenuItemsQuery}
                  queryArgs={qualifyingItemArgs}
                  skip={companySkip}
                  getOptionValue={(item) => item._id}
                  getOptionLabel={(item) => item.title}
                />
              </>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFTextField name="claimLimit" label="Claim Limit (optional)" placeholder="Max claims across all users" type="number" min="1" />

              {/* Editing an already-ended challenge must not be blocked by the "future dates only" rule. */}
              <RHFDate
                name="endDate"
                label="End Date"
                placeholder="Select end date"
                displayFormat="dd/MM/yyyy"
                minDate={isEdit ? new Date(0) : new Date()}
              />
            </div>

            <RHFAsyncCombobox
              name="tierLimit"
              label="Tier Limit"
              placeholder="Minimum tier required"
              searchPlaceholder="Search tiers..."
              selectedLabel={challenge?.tierName || undefined}
              useOptionsQuery={useGetTiersQuery}
              getOptionValue={(tier) => tier._id}
              getOptionLabel={(tier) => tier.title}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelectField
                name="rewardType"
                label="Reward Type"
                placeholder="Select reward type"
                className="w-full"
                options={rewardTypeOptions}
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
                <RHFAsyncCombobox
                  name="rewardMenuId"
                  label="Select Menu (optional)"
                  placeholder="Select menu"
                  searchPlaceholder="Search menus..."
                  selectedLabel={rewardMenu?.name || undefined}
                  useOptionsQuery={useGetMenuListQuery}
                  queryArgs={companyArgs}
                  skip={companySkip}
                  getOptionValue={(menu) => menu._id}
                  getOptionLabel={(menu) => menu.title}
                  onValueChange={(value) => {
                    if (value !== rewardMenuId) setValue('rewardItemIds', []);
                  }}
                />

                <RHFAsyncCombobox
                  name="rewardItemIds"
                  label="Add Reward Items"
                  placeholder="Choose items to add..."
                  searchPlaceholder="Search menu items..."
                  multiple
                  initialSelected={toInitialSelected(challenge?.rewardMenuItems ?? [])}
                  useOptionsQuery={useGetMenuItemsQuery}
                  queryArgs={rewardItemArgs}
                  skip={companySkip}
                  getOptionValue={(item) => item._id}
                  getOptionLabel={(item) => item.title}
                />
              </>
            )}

            {rewardType === 'linkedReward' && (
              <RHFAsyncCombobox
                name="linkedRewardId"
                label="Select Reward"
                placeholder="Choose existing reward..."
                searchPlaceholder="Search rewards..."
                selectedLabel={challenge?.linkedRewardName || undefined}
                useOptionsQuery={useLinkedRewardOptionsQuery}
                queryArgs={companyArgs}
                skip={companySkip}
                getOptionValue={(reward) => reward._id}
                getOptionLabel={(reward) => reward.title}
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

            <ChallengeCalculatorPanel companyOrganizer={scopedCompanyId} userType={userType} />
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
