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
import { Calculator, Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TransactionsTable from './transactionsTable';

type HighlightFormValues = {
  image: any;
  name: string;
  type: string;
  pointValue: string;
  limit: string;
  tierLimit: string;
  description: string;
};

const defaultValues = {
  image: null,
  name: '',
  type: '',
  pointValue: '',
  limit: '',
  tierLimit: '',
  description: '',
};

const schema = Yup.object({
  image: Yup.mixed().nullable().required('Image is required'),
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  pointValue: Yup.string().required('Point Value is required'),
  limit: Yup.string().required('Limit is required'),
  tierLimit: Yup.string().required('Tier Limit is required'),
  description: Yup.string().required('Description is required'),
});

const TransactionsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();
  const calculatorModal = useBoolean();

  const methods = useForm<HighlightFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    watch,
    // reset,
    // handleSubmit
  } = methods;
  const image = watch('image');

  const imagePreviewUrl = useMemo(() => {
    return image instanceof File ? URL.createObjectURL(image) : null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // const onSubmit = (data: any) => {
  //   console.log('data', data);
  // };

  // const closeModal = () => {
  //   reset(defaultValues);
  //   openModal.onFalse();
  //   editModal.onFalse();
  // };

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

  // const handleCreate = () => {
  //   editModal.onFalse();
  //   openModal.onTrue();
  // };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end gap-3 md:mt-0">
        <Button
          // onClick={handleCreate}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="mr-1" />
          Create Transactions
        </Button>
      </div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <TransactionsTable handleDelete={handleDelete} handleEdit={handleEdit} />

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

                  <div className="relative">
                    <RHFTextField
                      name="pointValue"
                      label="Point Value"
                      placeholder="Enter Point Value"
                      type="number"
                    />
                    <Button
                      type="button"
                      onClick={calculatorModal.onTrue}
                      className="absolute top-8 right-2 h-8 w-8 bg-blue-100 p-0 text-blue-600 hover:bg-blue-200"
                      title="Open Calculator"
                    >
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>

                  <RHFTextField
                    name="limit"
                    label="Limit"
                    placeholder="Enter Limit"
                    type="number"
                  />

                  <RHFSelectField
                    name="tierLimit"
                    label="Tier Limit"
                    placeholder="Select Tier Limit"
                    className="w-full flex-1"
                    options={[
                      { label: 'Bronze', value: 'bronze' },
                      { label: 'Silver', value: 'silver' },
                      { label: 'Gold', value: 'gold' },
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
        title="Delete Transaction"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default TransactionsView;
