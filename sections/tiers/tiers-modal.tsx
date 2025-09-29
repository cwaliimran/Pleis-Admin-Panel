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

type TierStatus = 'active' | 'inactive';

type TierFormValues = {
  tierName: string;
  entryPoints: number;
  retainPoints: number;
  bonusPointsPerEUR: number;
  status: TierStatus;
};

const defaultValues: TierFormValues = {
  tierName: '',
  entryPoints: 0,
  retainPoints: 0,
  bonusPointsPerEUR: 0,
  status: 'active',
};

const schema = Yup.object({
  tierName: Yup.string()
    .required('Tier name is required')
    .min(2, 'Tier name must be at least 2 characters')
    .max(50, 'Tier name cannot exceed 50 characters'),
  entryPoints: Yup.number()
    .required('Entry points is required')
    .min(0, 'Entry points must be at least 0')
    .integer('Entry points must be a whole number'),
  bonusPointsPerEUR: Yup.number()
    .required('Bonus points per EUR is required')
    .min(0, 'Bonus points per EUR must be at least 0'),
  retainPoints: Yup.number()
    .required('Retain points is required')
    .min(0, 'Retain points must be at least 0')
    .integer('Retain points must be a whole number')
    .test(
      'retain-points-validation',
      'Retain points should be less than or equal to entry points',
      function (value) {
        const { entryPoints } = this.parent;
        if (value && entryPoints && value > entryPoints) {
          return false;
        }
        return true;
      }
    ),
  status: Yup.string().oneOf(['active', 'inactive']).default('active'),
});

type TierModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: TierFormValues) => void;
  isEdit?: boolean;
  selectedData?: TierFormValues;
};

const TiersModal = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
  selectedData,
}: TierModalProps) => {
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const methods = useForm<TierFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset } = methods;

  const handleSubmit = (data: TierFormValues) => {
    console.log('Tier data:', data);
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
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:!max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-7 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Tier Name */}
                  <div className="space-y-1">
                    <RHFTextField
                      name="tierName"
                      label="Tier Name"
                      placeholder="Enter tier name"
                    />
                  </div>

                  <div className="space-y-1">
                    <RHFTextField
                      name="bonusPointsPerEUR"
                      label="Bonus Points per EUR"
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>

                {/* Entry Points and Retain Points */}
                <div className="mt-2 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <RHFTextField
                      name="entryPoints"
                      label="Entry Points"
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                    <p className="text-sm text-gray-500">
                      Points needed to reach this tier
                    </p>
                  </div>

                  <div className="space-y-1">
                    <RHFTextField
                      name="retainPoints"
                      label="Retain Points"
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                    <p className="text-sm text-gray-500">
                      Points needed to maintain this tier
                    </p>
                  </div>
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

export default TiersModal;
