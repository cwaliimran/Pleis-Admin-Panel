'use client';

import FormProvider, {
  RHFDate,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import RewardCalculatorFields from '../rewards/reward-calculation-fields';

type RewardType = 'point' | 'item' | 'custom' | 'ticket';
type TaskType = 'visit' | 'earn_points' | 'buy_menu_item' | 'refer_users';

type ChallengesFormValues = {
  name: string;
  rewardType: RewardType;
  pointReward: string;
  itemRewardId: string;
  customReward: {
    name: string;
    description: string;
    photo?: string | null | undefined;
  } | null;
  ticketReward: string;
  taskType: TaskType;
  taskValue: number;
  menuItemId: string;
  claimLimit: string;
  endTime: string;
  tierLimit: string;
};

const defaultValues: ChallengesFormValues = {
  name: '',
  rewardType: 'point',
  pointReward: '',
  itemRewardId: '',
  // customReward: null,
  customReward: {
    name: '',
    description: '',
    photo: undefined,
  },
  ticketReward: '',
  taskType: 'visit',
  taskValue: 1,
  menuItemId: '',
  claimLimit: '',
  endTime: '',
  tierLimit: '',
};

const schema = Yup.object({
  name: Yup.string().default('').required('Name is required'),
  rewardType: Yup.string()
    .oneOf(['point', 'item', 'custom', 'ticket'])
    .default('point')
    .required('Reward type is required'),
  pointReward: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'point',
      then: (schema) => schema.required('Point reward is required'),
      otherwise: (schema) => schema.default(''),
    }),
  itemRewardId: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'item',
      then: (schema) => schema.required('Menu item is required'),
      otherwise: (schema) => schema.default(''),
    }),
  customReward: Yup.object({
    name: Yup.string().required('Custom reward name is required'),
    description: Yup.string().required('Custom reward description is required'),
    photo: Yup.string().nullable(),
  })
    .nullable()
    .default(null)
    .when('rewardType', {
      is: 'custom',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable().default(null),
    }),
  ticketReward: Yup.string()
    .default('')
    .when('rewardType', {
      is: 'ticket',
      then: (schema) => schema.required('Ticket reward is required'),
      otherwise: (schema) => schema.default(''),
    }),
  taskType: Yup.string()
    .oneOf(['visit', 'earn_points', 'buy_menu_item', 'refer_users'])
    .required('Task type is required'),
  taskValue: Yup.number().required('Task value is required').min(1),
  menuItemId: Yup.string()
    .default('')
    .when('taskType', {
      is: 'buy_menu_item',
      then: (schema) => schema.required('Menu item is required'),
      otherwise: (schema) => schema.default(''),
    }),
  claimLimit: Yup.string().default(''),
  endTime: Yup.string().default('').required('End Time is required'),
  tierLimit: Yup.string().default('').required('Tier Limit is required'),
});

type ChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: ChallengesFormValues;
  global?: boolean;
};

const ChallengeModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
  global = false,
}: ChallengeModalProps) => {
  const menuItems = [
    { label: 'Burger', value: 'burger' },
    { label: 'Pizza', value: 'pizza' },
    { label: 'Soda', value: 'soda' },
  ];

  const tiers = [
    { label: 'Bronze', value: 'Bronze' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Gold', value: 'Gold' },
  ];

  const methods = useForm<ChallengesFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset, watch } = methods;

  const handleSubmit = (data: ChallengesFormValues) => {
    console.log('Challenge data:', data);
    // onSubmit(data);
    reset(defaultValues);
    onClose();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Challenge' : 'Create Challenge'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-7 flex w-full flex-col gap-4">
                {/* Challenge Name */}
                <RHFTextField
                  name="name"
                  label="Challenge Name"
                  placeholder="Enter Challenge Name"
                />

                {/* Task Type and Parameters */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="taskType"
                    label="Task Type"
                    placeholder="Select Task Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Visit X Times', value: 'visit' },
                      { label: 'Earn X Points', value: 'earn_points' },
                      ...(!global
                        ? [
                            {
                              label: 'Buy Specific Menu Item X Times',
                              value: 'buy_menu_item',
                            },
                          ]
                        : []),
                      { label: 'Refer X Users', value: 'refer_users' },
                    ]}
                  />

                  {/* Task Value (X) */}
                  <RHFTextField
                    name="taskValue"
                    label="Task Value (X)"
                    placeholder="Enter value (e.g. 5)"
                    type="number"
                  />

                  {/* Menu Item selection if taskType is buy_menu_item */}
                  {watch('taskType') === 'buy_menu_item' && (
                    <RHFSelectField
                      name="menuItemId"
                      label="Menu Item"
                      placeholder="Select Menu Item"
                      options={menuItems}
                    />
                  )}
                </div>

                {/* Claim Limit */}
                <RHFTextField
                  name="claimLimit"
                  label="Claim Limit (optional)"
                  placeholder="Enter Claim Limit"
                  type="number"
                />

                {/* End Time */}
                <RHFDate
                  name="endTime"
                  label="End Date"
                  placeholder="Select End Date"
                />

                {/* Tier Limit */}
                <RHFSelectField
                  name="tierLimit"
                  label="Tier Limit"
                  placeholder="Select Tier Limit"
                  className="w-full flex-1"
                  options={tiers}
                />

                {/* Reward Type Selection */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="rewardType"
                    label="Reward Type"
                    placeholder="Select Reward Type"
                    options={[
                      { label: 'Point Reward', value: 'point' },
                      { label: 'Menu Item Reward', value: 'item' },
                      { label: 'Custom Reward', value: 'custom' },
                      { label: 'Special Ticket', value: 'ticket' },
                    ]}
                  />

                  {/* Point Reward Calculator */}
                  {watch('rewardType') === 'point' && (
                    <div className="flex flex-col gap-2">
                      <RHFTextField
                        name="pointReward"
                        label="Point Reward"
                        placeholder="Enter points to reward"
                        type="number"
                      />
                      {/* <div className="text-muted-foreground text-xs">
                        <span>Reward Calculator: </span>
                        <span>
                          Point Reward = Desired € value × (100 / Return %) ×
                          [lowest points per EUR]
                        </span>
                      </div> */}
                    </div>
                  )}

                  {/* Menu Item Reward */}
                  {watch('rewardType') === 'item' && (
                    <RHFSelectField
                      name="itemRewardId"
                      label="Menu Item Reward"
                      placeholder="Select Menu Item"
                      options={menuItems}
                    />
                  )}

                  {/* Custom Reward */}
                  {watch('rewardType') === 'custom' && (
                    <div className="col-span-2 flex flex-col gap-2">
                      <div className="mb-2 flex max-w-[10rem] items-center justify-start">
                        <RHFUploadButton
                          name="customReward.photo"
                          label="Upload Photo"
                          initialImage={null}
                        />
                      </div>

                      <RHFTextField
                        name="customReward.name"
                        label="Custom Reward Name"
                        placeholder="Enter custom reward name"
                      />
                      <RHFTextField
                        name="customReward.description"
                        label="Custom Reward Description"
                        placeholder="Enter description"
                      />
                    </div>
                  )}

                  {/* Special Ticket Reward */}
                  {watch('rewardType') === 'ticket' && (
                    <RHFTextField
                      name="ticketReward"
                      label="Special Ticket Reward"
                      placeholder="Enter ticket details"
                    />
                  )}
                </div>
              </div>

              <RewardCalculatorFields />

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    Save
                  </Button>
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
