'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type MarketingRequestFormValues = {
  title: string;
  description: string;
  budget: number;
  email: string;
  phoneNumber: string;
  status?: 'pending' | 'approved' | 'rejected';
};

type MarketingRequestModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Must be at least 3 characters').default(''),
  description: Yup.string().required('Description is required').min(10, 'Must be at least 10 characters').default(''),
  budget: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Budget is required')
    .min(1, 'Budget must be at least 1')
    .default(0),
  email: Yup.string().required('Email is required').email('Must be a valid email address').default(''),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Must be a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .default(''),
  status: Yup.string()
    .oneOf(['pending', 'approved', 'rejected'] as const)
    .default('pending'),
}) as Yup.ObjectSchema<MarketingRequestFormValues>;

const defaultValues: MarketingRequestFormValues = {
  title: '',
  description: '',
  budget: '' as any,
  email: '',
  phoneNumber: '',
  status: 'pending',
};

const MarketingRequestModal = ({ open, onClose, isEdit = false, selectedData }: MarketingRequestModalProps) => {
  // const [addMarketingRequest, { isLoading: addLoading }] = useAddMarketingRequestMutation();
  // const [updateMarketingRequest, { isLoading: updateLoading }] = useUpdateMarketingRequestMutation();

  const methods = useForm<MarketingRequestFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, watch } = methods;
  const isDirty = formState?.isDirty;

  const budget = watch('budget');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mappedData: MarketingRequestFormValues = {
        title: selectedData?.title || '',
        description: selectedData?.description || '',
        budget: selectedData?.budget || ('' as any),
        email: selectedData?.email || '',
        phoneNumber: selectedData?.phoneNumber || '',
        status: selectedData?.status || 'pending',
      };

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: MarketingRequestFormValues) => {
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      };

      // Add fields for edit mode
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      console.log('payload', payload);

      // const response = isEdit ? await updateMarketingRequest(payload).unwrap() : await addMarketingRequest(payload).unwrap();

      // if (!response) {
      //   showError('No response from server. Please try again later.');
      //   return;
      // }

      // if (response?.error) {
      //   showError(getErrorMessage(response.error));
      //   return;
      // }

      // showSuccess(response?.message || (isEdit ? 'Marketing request updated successfully' : 'Marketing request created successfully'));
      showSuccess('Marketing request created successfully');

      // methods.reset(defaultValues);
      // onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // const isLoading = addLoading || updateLoading;
  const isLoading = false;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Marketing Request' : 'Create Marketing Request'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                {/* Title */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="title" label="Title" placeholder="Enter title" />
                </div>

                {/* Description */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Describe your marketing campaign goals and requirements..."
                    multiline
                    rows={4}
                  />
                </div>

                {/* Budget */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="budget" label="Budget (€)" placeholder="e.g., 5000" type="number" min="1" />
                </div>

                {/* Budget Preview */}
                <div className="rounded-lg bg-linear-to-r from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Summary:</p>
                  <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">€{budget ? Number(budget).toLocaleString() : '0'}</p>
                </div>

                {/* Contact Information */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="email" label="Contact Email" placeholder="email@example.com" type="email" />

                  <RHFTextField name="phoneNumber" label="Phone Number" placeholder="+1234567890" type="tel" />
                </div>

                {/* Status - Only in edit mode */}
                {isEdit && (
                  <div className="mt-2">
                    <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Request' : 'Submit Request'}
                  </Button>
                )}
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default MarketingRequestModal;
