'use client';

import Header from '@/app/common/header';
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
import HighlightTable from '@/sections/highlight/hightlightTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

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

const HighlightView = () => {
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

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        <Button
          onClick={openModal.onTrue}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="mr-1" />
          Create Highlight
        </Button>
      </div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <HighlightTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING HIGHLIGHT ------------- */}
      <Dialog open={openModal.value} onOpenChange={closeModal}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0" />
        <DialogContent className="w-full md:!max-w-screen-md dark:bg-[#171717]">
          <DialogHeader>
            <DialogTitle>
              {!editModal.value ? 'Create Highlight' : 'Edit Highlight'}
            </DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4 grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <RHFUploadVideo name="video" label="Highlight Video" />
              </div>

              <div className="col-span-12 flex flex-col gap-4 md:col-span-8">
                <RHFTextField
                  name="title"
                  label="Highlight Title"
                  placeholder="Enter Highlight Title"
                  className={`${
                    methods.formState.errors.title ? 'border-red-400' : ''
                  }`}
                />

                <RHFTextfieldWithSelect
                  name="event"
                  placeholder="Select Event"
                  options={[
                    { value: 'event1', label: 'Event 1' },
                    { value: 'event2', label: 'Event 2' },
                    { value: 'event3', label: 'Event 3' },
                  ]}
                />

                <RHFTextfieldWithSelect
                  name="organization"
                  placeholder="Select Organization"
                  options={[
                    { label: 'Organization 1', value: 'org1' },
                    { label: 'Organization 2', value: 'org2' },
                    { label: 'Organization 3', value: 'org3' },
                  ]}
                />

                <RHFSelectField
                  name="status"
                  // label="Status"
                  placeholder="Select Status"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary cursor-pointer text-white"
              >
                {!editModal.value ? 'Add Highlight' : 'Update Highlight'}
              </Button>
            </div>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Highlight"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default HighlightView;
