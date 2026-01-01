'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import {
  useAddGlobalReferralSettingMutation,
  useAddLocalReferralSettingMutation,
  useResetGlobalReferralSettingMutation,
  useResetLocalReferralSettingMutation,
  useUpdateGlobalReferralSettingMutation,
  useUpdateLocalReferralSettingMutation,
} from '@/store/Reducer/referrals-api';
import { getErrorMessage } from '@/utils/api';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export type ReferralFormValues = {
  userPoints: number;
  referrerPoints: number;
  minimumPurchases: number;
  purchaseThresholdAmount: number;
  referralLimit: number;
  expiryDate: string;
};

type ReferralModalProps = {
  open: boolean;
  onClose: () => void;
  referralSettingData?: any;
  global?: boolean;
  companyId?: string | null;
};

const defaultValues: ReferralFormValues = {
  userPoints: 0,
  referrerPoints: 0,
  minimumPurchases: 0,
  purchaseThresholdAmount: 0,
  referralLimit: 0,
  expiryDate: '',
};

const schema = Yup.object({
  userPoints: Yup.number().min(0).required(),
  referrerPoints: Yup.number().min(0).required(),
  minimumPurchases: Yup.number().min(0).required(),
  purchaseThresholdAmount: Yup.number().min(0).required(),
  referralLimit: Yup.number().min(0).required(),
  expiryDate: Yup.string().required(),
});

const ReferralModal = ({ open, onClose, referralSettingData, global, companyId }: ReferralModalProps) => {
  const methods = useForm<ReferralFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const [addSetting, { isLoading: isAdding }] = useAddGlobalReferralSettingMutation();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateGlobalReferralSettingMutation();
  const [resetSetting, { isLoading: isResetting }] = useResetGlobalReferralSettingMutation();

  const [addLocalSetting, { isLoading: isAddingLocal }] = useAddLocalReferralSettingMutation();
  const [updateLocalSetting, { isLoading: isUpdatingLocal }] = useUpdateLocalReferralSettingMutation();
  const [resetLocalSetting, { isLoading: isResettingLocal }] = useResetLocalReferralSettingMutation();

  const isEditMode = Boolean(referralSettingData?._id);

  const mappedValues = useMemo<ReferralFormValues>(() => {
    if (!referralSettingData) return defaultValues;

    return {
      userPoints: referralSettingData.userPoints ?? 0,
      referrerPoints: referralSettingData.referrerPoints ?? 0,
      minimumPurchases: referralSettingData.minimumPurchases ?? 0,
      purchaseThresholdAmount: referralSettingData.purchaseThresholdAmount ?? 0,
      referralLimit: referralSettingData.referralLimit ?? 0,
      expiryDate: referralSettingData.expiryDate ? referralSettingData.expiryDate.split('T')[0] : '',
    };
  }, [referralSettingData]);

  useEffect(() => {
    if (open) {
      reset(mappedValues);
    }
  }, [open, mappedValues, reset]);

  const onSubmit = async (values: ReferralFormValues) => {
    const basePayload = {
      userPoints: values.userPoints,
      referrerPoints: values.referrerPoints,
      minimumPurchases: values.minimumPurchases,
      purchaseThresholdAmount: values.purchaseThresholdAmount,
      referralLimit: values.referralLimit,
      expiryDate: fDate(values.expiryDate, formatStr.paramCase.db),
      ...(global === false && { companyOrganizer: companyId || undefined }),
    };

    const finalPayload = isEditMode
      ? {
          ...basePayload,
          id: referralSettingData?._id,
          status: referralSettingData?.status ?? 'active',
        }
      : basePayload;

    try {
      if (isEditMode) {
        if (global) {
          await updateSetting(finalPayload).unwrap();
        } else {
          await updateLocalSetting(finalPayload).unwrap();
        }
      } else {
        if (global) {
          await addSetting(finalPayload).unwrap();
        } else {
          await addLocalSetting(finalPayload).unwrap();
        }
      }

      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onResetCount = async () => {
    try {
      const response = global ? await resetSetting({}).unwrap() : await resetLocalSetting({}).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Referral counts have been reset successfully.');
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
        >
          <DialogHeader>
            <DialogTitle>Referral Settings</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RHFTextField name="referralLimit" label="Referral Limit" type="number" placeholder="Enter referral limit" />
                <RHFTextField name="userPoints" label="User Points" type="number" placeholder="Enter user points" />
                <RHFTextField name="referrerPoints" label="Referrer Points" type="number" placeholder="Enter referrer points" />
                <RHFTextField name="minimumPurchases" label="Minimum Purchase" type="number" placeholder="Enter minimum purchase" />
                <RHFTextField name="purchaseThresholdAmount" label="Purchase Threshold" type="number" placeholder="Enter purchase threshold" />
                <RHFDate name="expiryDate" label="Expiry Date" className="h-10 w-full cursor-pointer border-gray-200 focus:border-blue-600" />
              </div>

              <div className="mt-6 flex w-full items-center justify-between gap-2">
                {isResettingLocal || isResetting ? (
                  <Button type="button" disabled className="cursor-not-allowed bg-[#82181A] px-4 py-2 text-white hover:bg-[#82181A]/80">
                    <ButtonLoading title="Resetting" />
                  </Button>
                ) : (
                  <Button type="button" className="cursor-pointer bg-[#82181A] hover:bg-[#82181A]/80" onClick={onResetCount}>
                    Reset Count
                  </Button>
                )}

                {isAddingLocal || isUpdatingLocal || isAdding || isUpdating ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                    <ButtonLoading title={isEditMode ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white">
                    {isEditMode ? 'Update' : 'Create'}
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

export default ReferralModal;
