'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
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
  status: status;
};

const defaultValues: StatusFormValues = {
  title: '',
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

  const methods = useForm<StatusFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset } = methods;

  const handleSubmit = (data: StatusFormValues) => {
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
                {/* Tier Name */}
                <div className="space-y-1">
                  <RHFTextField
                    name="title"
                    label="Status Name"
                    placeholder="Enter status name"
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

              <div className="mt-6 flex items-center justify-end gap-2">
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
                  {isEdit ? 'Update Tier' : 'Create Tier'}
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
