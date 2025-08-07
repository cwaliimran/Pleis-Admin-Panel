'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider, {
  RHFDate,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import ChallengesTable from './challengesTable';

type ChallengesFormValues = {
  name: string;
  reward: string;
  taskType: string;
  taskParameters: string;
  claimLimit: string;
  endTime: string;
  tierLimit: string;
};

const defaultValues = {
  name: '',
  reward: '',
  taskType: '',
  taskParameters: '',
  claimLimit: '',
  endTime: '',
  tierLimit: '',
};

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  reward: Yup.string().required('Reward is required'),
  taskType: Yup.string().required('Task Type is required'),
  taskParameters: Yup.string().required('Task Parameters is required'),
  claimLimit: Yup.string().required('Claim Limit is required'),
  endTime: Yup.string().required('End Time is required'),
  tierLimit: Yup.string().required('Tier Limit is required'),
});

const ChallengesView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const methods = useForm<ChallengesFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = (data: ChallengesFormValues) => {
    console.log('Challenge data:', data);
    // Add your API call here to save the challenge
    closeModal();
  };

  const closeModal = () => {
    reset(defaultValues);
    openModal.onFalse();
    editModal.onFalse();
  };
  const handleEdit = (id: string) => {
    console.log('id', id);
    openModal.onTrue();
    editModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log('id', id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    deleteModal.onFalse();
  };

  const handleCreate = () => {
    editModal.onFalse();
    openModal.onTrue();
  };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="mr-1" />
          Create Challenges
        </Button>
      </div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <ChallengesTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING ------------- */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editModal.value ? 'Edit Challenge' : 'Create Challenge'}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="mt-7 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="name"
                    label="Challenge Name"
                    placeholder="Enter Challenge Name"
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="reward"
                    label="Reward"
                    placeholder="Enter Reward"
                  />

                  <RHFSelectField
                    name="taskType"
                    label="Task Type"
                    placeholder="Select Task Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Order Count', value: 'Order Count' },
                      { label: 'Menu Item', value: 'Menu Item' },
                      { label: 'Referral', value: 'Referral' },
                      { label: 'Combo Purchase', value: 'Combo Purchase' },
                    ]}
                  />

                  <RHFTextField
                    name="taskParameters"
                    label="Task Parameters"
                    placeholder="Enter Task Parameters"
                  />

                  <RHFTextField
                    name="claimLimit"
                    label="Claim Limit"
                    placeholder="Enter Claim Limit"
                    type="number"
                  />

                  <RHFDate
                    name="endTime"
                    label="End Date"
                    placeholder="Select End Date"
                  />

                  <RHFSelectField
                    name="tierLimit"
                    label="Tier Limit"
                    placeholder="Select Tier Limit"
                    className="w-full flex-1"
                    options={[
                      { label: 'Bronze', value: 'Bronze' },
                      { label: 'Silver', value: 'Silver' },
                      { label: 'Gold', value: 'Gold' },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Challenge"
        content="Are you sure you want to delete this challenge?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default ChallengesView;
