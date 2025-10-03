'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
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

type status = 'active' | 'inactive';

type StatusFormValues = {
  title: string;
  entryPoint: string;
  retainPoint: string;
  setOrder: string;
  background?: null | File;
  image?: null | File;
  status: status;
};

const defaultValues: StatusFormValues = {
  title: '',
  entryPoint: '',
  retainPoint: '',
  setOrder: '',
  background: null,
  image: null,
  status: 'active',
};

const schema = Yup.object({
  title: Yup.string().required('Status name is required'),
  status: Yup.string().oneOf(['active', 'inactive']).default('active'),
});

type StatusModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: StatusFormValues) => void;
  isEdit?: boolean;
  selectedData?: StatusFormValues;
};

const StatusModal = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
  selectedData,
}: StatusModalProps) => {
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset } = methods;

  const handleSubmit = (data: any) => {
    console.log('Status data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
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
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[25vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Status' : 'Create Status'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-7 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="image" label="Image" />

                <div className="flex max-w-[12rem] items-center justify-start">
                  <RHFUploadButton
                    name="background"
                    label="Upload Background"
                    initialImage={null}
                  />
                </div>

                {/* Tier Name */}
                <div className="space-y-3">
                  <RHFTextField
                    name="title"
                    label="Status Name"
                    placeholder="Enter status name"
                  />

                  <RHFTextField
                    name="entryPoint"
                    label="Entry Point"
                    type="number"
                    placeholder="Enter entry point"
                  />

                  <RHFTextField
                    name="retainPoint"
                    label="Retain Point"
                    type="number"
                    placeholder="Enter retain point"
                  />

                  <RHFCustomDropdown
                    name="setorder"
                    label="Set Order of Appearance"
                    placeholder="Select order"
                    options={Array.from({ length: 10 }, (_, i) => ({
                      label: `${i + 1}`,
                      value: `${i + 1}`,
                    }))}
                    isLoading={false}
                    showNone={false}
                  />
                </div>

                {/* Status - Only show in edit mode */}
                {isEdit && (
                  <div className="space-y-1">
                    <RHFSelectField
                      name="status"
                      label="Status"
                      placeholder="Select status"
                      className="w-full"
                      options={statusOptions}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary px-6 text-white"
                >
                  {isEdit ? 'Update Status' : 'Create Status'}
                </Button>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default StatusModal;
