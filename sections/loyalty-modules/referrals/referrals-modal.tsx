'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import {
  useAddGlobalReferralSettingMutation,
  useAddLocalReferralSettingMutation,
  useUpdateGlobalReferralSettingMutation,
  useUpdateLocalReferralSettingMutation,
} from '@/store/Reducer/referrals-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

export type ReferralFormValues = {
  userPoints: number;
  referrerPoints: number;
  minimumPurchases: number;
  referralLimit: number;
  status: 'active' | 'inactive';
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
  referralLimit: 0,
  status: 'inactive',
};

const schema = Yup.object({
  userPoints: Yup.number().min(0).required(),
  referrerPoints: Yup.number().min(0).required(),
  minimumPurchases: Yup.number().min(0).required(),
  referralLimit: Yup.number().min(0).required(),
  status: Yup.string().oneOf(['active', 'inactive']).required(),
});

const ReferralModal = ({ open, onClose, referralSettingData, global, companyId }: ReferralModalProps) => {
  const methods = useForm<ReferralFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, handleSubmit, control } = methods;
  const [activeAction, setActiveAction] = useState<'submit' | 'reset' | null>(null);

  const [addSetting, { isLoading: isAdding }] = useAddGlobalReferralSettingMutation();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateGlobalReferralSettingMutation();

  const [addLocalSetting, { isLoading: isAddingLocal }] = useAddLocalReferralSettingMutation();
  const [updateLocalSetting, { isLoading: isUpdatingLocal }] = useUpdateLocalReferralSettingMutation();

  const isEditMode = Boolean(referralSettingData?._id);
  const isMutationLoading = isAddingLocal || isUpdatingLocal || isAdding || isUpdating;
  const isSubmitLoading = isMutationLoading && activeAction === 'submit';
  const isResetLoading = isMutationLoading && activeAction === 'reset';

  const mappedValues = useMemo<ReferralFormValues>(() => {
    if (!referralSettingData) return defaultValues;

    return {
      userPoints: referralSettingData.userPoints ?? 0,
      referrerPoints: referralSettingData.referrerPoints ?? 0,
      minimumPurchases: referralSettingData.minimumPurchases ?? 0,
      referralLimit: referralSettingData.referralLimit ?? 0,
      status: referralSettingData.status ?? 'inactive',
    };
  }, [referralSettingData]);

  useEffect(() => {
    if (open) {
      reset(mappedValues);
    }
  }, [open, mappedValues, reset]);

  const onSubmit = async (values: ReferralFormValues) => {
    setActiveAction('submit');

    const basePayload = {
      userPoints: values.userPoints,
      referrerPoints: values.referrerPoints,
      minimumPurchases: values.minimumPurchases,
      referralLimit: values.referralLimit,
      status: values.status,
      ...(global === false && { companyOrganizer: companyId || undefined }),
    };

    const finalPayload = isEditMode
      ? {
          ...basePayload,
          id: referralSettingData?._id,
        }
      : basePayload;

    let response;

    try {
      if (isEditMode) {
        if (global) {
          response = await updateSetting(finalPayload).unwrap();
        } else {
          response = await updateLocalSetting(finalPayload).unwrap();
        }
      } else {
        if (global) {
          response = await addSetting(finalPayload).unwrap();
        } else {
          response = await addLocalSetting(finalPayload).unwrap();
        }
      }

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || '');
      onClose();
      reset();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setActiveAction(null);
    }
  };

  const onResetCount = async () => {
    setActiveAction('reset');

    const resetValues: ReferralFormValues = {
      userPoints: 0,
      referrerPoints: 0,
      minimumPurchases: 0,
      referralLimit: 0,
      status: methods.getValues('status') || 'inactive',
    };

    const basePayload = {
      userPoints: resetValues.userPoints,
      referrerPoints: resetValues.referrerPoints,
      minimumPurchases: resetValues.minimumPurchases,
      referralLimit: resetValues.referralLimit,
      status: resetValues.status,
      ...(global === false && { companyOrganizer: companyId || undefined }),
    };

    const finalPayload = isEditMode
      ? {
          ...basePayload,
          id: referralSettingData?._id,
        }
      : basePayload;

    try {
      const response = isEditMode
        ? global
          ? await updateSetting(finalPayload).unwrap()
          : await updateLocalSetting(finalPayload).unwrap()
        : global
          ? await addSetting(finalPayload).unwrap()
          : await addLocalSetting(finalPayload).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Referral points have been reset successfully.');
      onClose();
      reset(resetValues);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setActiveAction(null);
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
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-x-1">
                      <div
                        className={`peer relative h-6 w-11 cursor-pointer rounded-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${
                          field.value === 'active' ? 'bg-primary after:translate-x-full after:border-white' : 'bg-gray-200'
                        }`}
                        onClick={() => field.onChange(field.value === 'active' ? 'inactive' : 'active')}
                      />
                      <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {field.value === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )}
                />
              </div>

              <div className="mt-6 flex w-full items-center justify-between gap-2">
                {isResetLoading ? (
                  <Button type="button" disabled className="cursor-not-allowed bg-[#82181A] px-4 py-2 text-white hover:bg-[#82181A]/80">
                    <ButtonLoading title="Resetting" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isMutationLoading}
                    className="cursor-pointer bg-[#82181A] hover:bg-[#82181A]/80"
                    onClick={onResetCount}
                  >
                    Reset Count
                  </Button>
                )}

                {isSubmitLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                    <ButtonLoading title={isEditMode ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isMutationLoading} className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white">
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
