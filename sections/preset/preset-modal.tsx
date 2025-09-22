'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import FormProvider, { RHFTextField, RHFSelectField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';

type PresetFormValues = {
  name: string;
  status: string;
};

const defaultValues: PresetFormValues = {
  name: '',
  status: 'active',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  status: Yup.string().required('Status is required'),
});

type PresetModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: PresetFormValues;
};

const PresetModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: PresetModalProps) => {
  const methods = useForm<PresetFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset } = methods;

  const onSubmit = (data: PresetFormValues) => {
    console.log('Preset data:', data);
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
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Preset' : 'Create Preset'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="mt-6 flex w-full flex-col gap-4">
                {/* Name */}
                <RHFTextField
                  name="name"
                  label="Item Name"
                  placeholder="Enter Item Name"
                />

                {/* Status (only for edit) */}
                {isEdit && (
                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                )}
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary cursor-pointer px-7 text-white"
                >
                  {isEdit ? 'Update' : 'Create'} Menu Item
                </Button>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default PresetModal;
