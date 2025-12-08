'use client';

import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type ReferralFormValues = {
  refLimit: number;
  userPoints: number;
  refPoints: number;
};

const defaultValues: ReferralFormValues = {
  refLimit: 10,
  userPoints: 132,
  refPoints: 332,
};

const schema = Yup.object({
  refLimit: Yup.number().min(0, 'Ref limit cannot be negative').required(),
  userPoints: Yup.number().min(0, 'User points cannot be negative').required(),
  refPoints: Yup.number().min(0, 'Referrer points cannot be negative').required(),
});

type ReferralModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: ReferralFormValues;
  onResetCount?: () => void;
  referralSettingData?: any;
};

const ReferralModal = ({ open, onClose, isEdit = false, selectedData, onResetCount, referralSettingData }: ReferralModalProps) => {
  const methods = useForm<ReferralFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset } = methods;

  console.log("referralSettingData", referralSettingData);

  const handleSubmit = (data: ReferralFormValues) => {
    console.log('Referral data:', data);
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
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Referral Settings' : 'Referral Settings'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Referral Limit */}
                <RHFTextField name="refLimit" label="Referral Limit" type="number" placeholder="Enter referral limit" />

                {/* User Points */}
                <RHFTextField name="userPoints" label="User Points" type="number" placeholder="Enter user points" />

                {/* Referrer Points */}
                <RHFTextField name="refPoints" label="Referrer Points" type="number" placeholder="Enter referrer points" />

                {/* Minimum Purchase */}
                <RHFTextField name="minPurchase" label="Minimum Purchase" type="number" placeholder="Enter minimum purchase" />

                {/* Purchase Threshold */}
                <RHFTextField name="purchaseThreshold" label="Purchase Threshold" type="number" placeholder="Enter purchase threshold" />

                {/* Expiry Date */}
                {/* <RHFTextField name="expiryDate" label="Expiry Date" type="date" placeholder="Enter expiry date" /> */}
                <RHFDate name="expiryDate" label="Expiry Date" className="h-10 w-full cursor-pointer border-gray-200 focus:border-blue-600" />
              </div>

              <div className="mt-6 flex w-full items-center justify-between gap-2">
                <Button type="button" className="cursor-pointer bg-[#82181A] hover:bg-[#82181A]/80" onClick={onResetCount}>
                  Reset Count
                </Button>

                <Button type="submit" className="bg-primary hover:bg-primary cursor-pointer px-7 text-white">
                  Save
                </Button>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ReferralModal;
