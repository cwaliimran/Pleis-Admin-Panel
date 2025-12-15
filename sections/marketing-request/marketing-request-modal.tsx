'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddMarketingRequestMutation } from '@/store/Reducer/marketing-request-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as Yup from 'yup';

type MarketingRequestFormValues = {
  title: string;
  description: string;
  budget: number;
  email: string;
  phone: string;
  phoneCode: string;
};

type MarketingRequestModalProps = {
  open: boolean;
  onClose: () => void;
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
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required')
    .default(''),
  phoneCode: Yup.string().default(''),
}) as Yup.ObjectSchema<MarketingRequestFormValues>;

const defaultValues: MarketingRequestFormValues = {
  title: '',
  description: '',
  budget: '' as any,
  email: '',
  phone: '',
  phoneCode: '',
};

const MarketingRequestModal = ({ open, onClose }: MarketingRequestModalProps) => {
  const [addMarketingRequest, { isLoading: addLoading }] = useAddMarketingRequestMutation();

  const methods = useForm<MarketingRequestFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, watch, setValue, control } = methods;
  const budget = watch('budget');

  const handleSubmit = async (formData: MarketingRequestFormValues) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        email: formData.email,
        phoneNumber: {
          code: formData.phoneCode || '+92',
          number: formData.phone,
        },
      };

      console.log('Marketing Request Payload:', payload);

      const response = await addMarketingRequest(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Marketing request submitted successfully');

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>Submit Marketing Request</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                <RHFTextField name="title" label="Campaign Title" placeholder="e.g., Summer Sale Campaign" />

                <RHFTextField
                  name="description"
                  label="Campaign Description"
                  placeholder="Describe your marketing campaign goals and requirements..."
                  multiline
                  rows={4}
                />

                <RHFTextField name="budget" label="Budget (€)" placeholder="e.g., 5000" type="number" min="1" />

                {budget > 0 && (
                  <div className="rounded-lg bg-linear-to-r from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Summary:</p>
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">€{Number(budget).toLocaleString()}</p>
                  </div>
                )}

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="email" label="Contact Email" placeholder="email@example.com" type="email" />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => {
                      const phoneCodeValue = methods.getValues('phoneCode') || '';
                      const displayValue = field.value && phoneCodeValue ? `${phoneCodeValue}${field.value}` : field.value || '';

                      return (
                        <div>
                          <p className="mb-0.5 text-sm font-medium">Phone Number</p>
                          <PhoneInput
                            value={displayValue}
                            country="pk"
                            onChange={(value, country: any) => {
                              const phoneCode = `+${country?.dialCode || ''}`;
                              const phoneNumber = value.replace(country?.dialCode || '', '');
                              field.onChange(phoneNumber);
                              setValue('phoneCode', phoneCode, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            placeholder="Phone Number"
                            inputProps={{
                              required: true,
                              'aria-invalid': fieldState.invalid,
                            }}
                            containerClass="w-full"
                            dropdownStyle={{
                              zIndex: 9999,
                              position: 'fixed',
                              width: '16rem',
                            }}
                            buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                            inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm flex !h-[42px] !w-full min-w-0 rounded-lg !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${fieldState.invalid ? 'border-destructive ring-destructive/40' : ''}`}
                          />
                          {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                      );
                    }}
                  />
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                  <p className="font-medium text-blue-900 dark:text-blue-300">📢 Marketing Request:</p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                    Our team will review your request and get back to you within 24-48 hours with a detailed proposal.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6" disabled={addLoading}>
                  Cancel
                </Button>

                {addLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title="Submitting" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white">
                    Submit Request
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
