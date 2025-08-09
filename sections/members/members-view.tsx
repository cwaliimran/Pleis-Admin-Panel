'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
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
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import MembersTable from './membersTable';

type PromotionsFormValues = {
  photo: any;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  tierLimit: string;
  repeatSettings: string;
  type: string;
};

const defaultValues = {
  photo: null,
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  tierLimit: '',
  repeatSettings: '',
  type: '',
};

const schema = Yup.object({
  photo: Yup.mixed().nullable().required('Photo is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startTime: Yup.string().required('Start Time is required'),
  endTime: Yup.string().required('End Time is required'),
  tierLimit: Yup.string().required('Tier Limit is required'),
  repeatSettings: Yup.string().required('Repeat Settings is required'),
  type: Yup.string().required('Type is required'),
});

const MembersView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const methods = useForm<PromotionsFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;
  const photo = watch('photo');

  const imagePreviewUrl = useMemo(() => {
    return photo instanceof File ? URL.createObjectURL(photo) : null;
  }, [photo]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onSubmit = (data: any) => {
    console.log('data', data);
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
      <div className="mt-3 flex w-full items-center justify-end md:mt-0"></div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <MembersTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING ------------- */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editModal.value ? 'Edit Promotion' : 'Create Promotion'}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(() => {})}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="photo" label="Photo" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="title"
                    label="Title"
                    placeholder="Enter Title"
                  />

                  <RHFSelectField
                    name="type"
                    label="Type"
                    placeholder="Select Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Happy Hour', value: 'Happy Hour' },
                      { label: 'Special Offer', value: 'Special Offer' },
                      { label: 'Seasonal', value: 'Seasonal' },
                    ]}
                  />

                  <RHFTextField
                    name="startTime"
                    label="Start Time"
                    placeholder="Enter Start Time"
                    type="date"
                  />

                  <RHFTextField
                    name="endTime"
                    label="End Time"
                    placeholder="Enter End Time"
                    type="date"
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
                      { label: 'Platinum', value: 'Platinum' },
                    ]}
                  />

                  <RHFSelectField
                    name="repeatSettings"
                    label="Repeat Settings"
                    placeholder="Select Repeat Settings"
                    className="w-full flex-1"
                    options={[
                      { label: 'None', value: 'None' },
                      { label: 'Daily', value: 'Daily' },
                      { label: 'Weekly', value: 'Weekly' },
                      { label: 'Monthly', value: 'Monthly' },
                    ]}
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    multiline
                    rows={2}
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
        title="Delete Member"
        content="Are you sure you want to delete this member?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default MembersView;
