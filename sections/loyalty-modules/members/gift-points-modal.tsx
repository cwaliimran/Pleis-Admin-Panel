'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useSendGiftToMemberMutation } from '@/store/Reducer/members-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';

interface GiftPointsFormValues {
  points: number;
  notes: string;
}

interface GiftPointsModalProps {
  open: boolean;
  onClose: () => void;
  companyOrganizer: string;
  userId: string;
}

const schema = Yup.object().shape({
  points: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Points are required')
    .min(1, 'Must be at least 1 point')
    .integer('Must be a whole number')
    .default(0),
  notes: Yup.string().default(''),
}) as Yup.ObjectSchema<GiftPointsFormValues>;

const defaultValues: GiftPointsFormValues = {
  points: '' as any,
  notes: '',
};

const GiftPointsModal = ({ open, onClose, companyOrganizer, userId }: GiftPointsModalProps) => {
  const [sendGiftToMember, { isLoading: giftSending }] = useSendGiftToMemberMutation();

  const methods: UseFormReturn<GiftPointsFormValues> = useForm<GiftPointsFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState } = methods;

  const handleSubmit = async (formData: GiftPointsFormValues) => {
    if (!companyOrganizer) {
      showError('Company organizer is missing.');
      return;
    }

    if (!userId) {
      showError('User ID is missing.');
      return;
    }

    try {
      const payload = {
        companyOrganizer,
        user: userId,
        points: Number(formData.points),
        notes: formData.notes || '',
      };

      const response = await sendGiftToMember(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Points sent successfully');

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[450px]!"
        >
          <DialogHeader>
            <DialogTitle>Gift Points to Member</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="flex w-full flex-col gap-4">
                <RHFTextField name="points" label="Points to Gift" placeholder="Enter points (e.g., 100)" type="number" min="1" />
                <RHFTextField name="notes" label="Notes (Optional)" placeholder="Add a message for the member..." multiline rows={3} />
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6" disabled={giftSending}>
                  Cancel
                </Button>

                {giftSending ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title="Sending" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white" disabled={!formState.isValid}>
                    Send Points
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

export default GiftPointsModal;
