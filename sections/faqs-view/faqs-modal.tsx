'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddFaqMutation, useUpdateFaqMutation } from '@/store/Reducer/faqs-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type FaqFormValues = {
  question: string;
  answer: string;
  type: 'saved_events' | 'saved_organizers' | 'purchases';
};

type FaqModalProps = {
  open: boolean;
  onClose: () => void;
  editData?: {
    _id: string;
    question: string;
    answer: string;
    type: 'saved_events' | 'saved_organizers' | 'purchases';
  } | null;
};

const schema = Yup.object().shape({
  question: Yup.string().required('Question is required').min(5, 'Must be at least 5 characters').default(''),
  answer: Yup.string().required('Answer is required').min(10, 'Must be at least 10 characters').default(''),
  type: Yup.string()
    .oneOf(['saved_events', 'saved_organizers', 'purchases'], 'Invalid FAQ type')
    .required('Type is required')
    .default('saved_events'),
}) as Yup.ObjectSchema<FaqFormValues>;

const defaultValues: FaqFormValues = {
  question: '',
  answer: '',
  type: 'saved_events',
};

const FaqsModal = ({ open, onClose, editData }: FaqModalProps) => {
  const [addFaq, { isLoading: addLoading }] = useAddFaqMutation();
  const [updateFaq, { isLoading: updateLoading }] = useUpdateFaqMutation();

  const isEditMode = !!editData;
  const isLoading = addLoading || updateLoading;

  const methods = useForm<FaqFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset } = methods;

  // Populate form with edit data
  useEffect(() => {
    if (editData) {
      reset({
        question: editData.question,
        answer: editData.answer,
        type: editData.type,
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const handleSubmit = async (formData: FaqFormValues) => {
    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        type: formData.type,
      };

      console.log('FAQ Payload:', payload);

      let response;

      if (isEditMode && editData?._id) {
        // Update existing FAQ
        response = await updateFaq({ id: editData._id, ...payload }).unwrap();
      } else {
        // Create new FAQ
        response = await addFaq(payload).unwrap();
      }

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || `FAQ ${isEditMode ? 'updated' : 'created'} successfully`);

      methods.reset();
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
            <DialogTitle>{isEditMode ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                <RHFTextField name="question" label="Question" placeholder="e.g., How to use this feature?" />

                <RHFTextField name="answer" label="Answer" placeholder="Provide a detailed answer to the question..." multiline rows={5} />

                <RHFSelectField
                  name="type"
                  label="FAQ Type"
                  placeholder="Select FAQ Type"
                  options={[
                    { label: 'Saved Events', value: 'saved_events' },
                    { label: 'Saved Organizers', value: 'saved_organizers' },
                    { label: 'Purchases', value: 'purchases' },
                  ]}
                />

                <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                  <p className="font-medium text-blue-900 dark:text-blue-300">ℹ️ FAQ Information:</p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                    {isEditMode
                      ? 'Update the FAQ details and click Save Changes to apply modifications.'
                      : 'Create a new frequently asked question to help users better understand the platform.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6" disabled={isLoading}>
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEditMode ? 'Updating' : 'Submitting'} />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white">
                    {isEditMode ? 'Update FAQ' : 'Create FAQ'}
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

export default FaqsModal;
