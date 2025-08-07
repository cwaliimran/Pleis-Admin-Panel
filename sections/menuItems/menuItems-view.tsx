'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider, {
  RHFSelectField,
  RHFTextField,
  RHFUploadVideo,
} from '@/components/rhf';
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select';
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
import MenuItemsTable from './menuItemsTable';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';

type HighlightFormValues = {
  video: any;
  title: string;
  event: string;
  status: string;
  organization: string;
};

const defaultValues = {
  video: null,
  title: '',
  event: '',
  status: '',
  organization: '',
};

const schema = Yup.object({
  video: Yup.mixed().nullable().required('Video is required'),
  title: Yup.string().required('Title is required'),
  event: Yup.string().required('Event is required'),
  status: Yup.string().required('Status is required'),
  organization: Yup.string().required('Organization is required'),
});

const MenuItemsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const methods = useForm<HighlightFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;
  const video = watch('video');

  const videoPreviewUrl = useMemo(() => {
    return video instanceof File ? URL.createObjectURL(video) : null;
  }, [video]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

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
    editModal.onFalse(); // Reset edit state
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
          Create Menu Item
        </Button>
      </div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <MenuItemsTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING ------------- */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editModal.value ? 'Edit Menu Item' : 'Create Menu Item'}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(() => {})}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="image" label="Image" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                  />

                  <RHFTextField
                    name="type"
                    label="Type"
                    placeholder="Enter Type"
                  />

                  <RHFSelectField
                    name="itemCategory"
                    label="Item Category"
                    placeholder="Select Item Category"
                    className="w-full flex-1"
                    options={[
                      { label: 'Type 1', value: 'type1' },
                      { label: 'Type 2', value: 'type2' },
                      { label: 'Type 3', value: 'type3' },
                    ]}
                  />

                  <RHFTextField
                    name="basePrice"
                    label="Base Price"
                    placeholder="Enter Base Price"
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
        title="Delete Menu Item"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default MenuItemsView;
