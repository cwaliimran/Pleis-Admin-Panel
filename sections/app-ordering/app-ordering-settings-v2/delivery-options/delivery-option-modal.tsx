'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { DELIVERY_OPTION_STATUS_OPTIONS, DELIVERY_OPTION_TYPE_OPTIONS } from './constants';
import { DeliveryOption, DeliveryOptionPayload, DeliveryOptionStatus, DeliveryOptionType } from './types';

const schema: Yup.ObjectSchema<DeliveryOptionPayload> = Yup.object().shape({
  name: Yup.string().trim().required('Name is required').max(40, 'Name must be 40 characters or fewer').default(''),
  type: Yup.mixed<DeliveryOptionType>()
    .oneOf(
      DELIVERY_OPTION_TYPE_OPTIONS.map((option) => option.value),
      'Select a type'
    )
    .required('Type is required'),
  status: Yup.mixed<DeliveryOptionStatus>()
    .oneOf(DELIVERY_OPTION_STATUS_OPTIONS.map((option) => option.value))
    .required('Status is required'),
});

const EMPTY_VALUES = { name: '', type: '' as unknown as DeliveryOptionType, status: 'active' as DeliveryOptionStatus };

interface DeliveryOptionModalProps {
  open: boolean;
  onClose: () => void;
  /** Present when editing, absent when adding. */
  option?: DeliveryOption | null;
  /** Existing names, used to block duplicates. Should include the edited option's own name. */
  existingNames: string[];
  onSubmit: (payload: DeliveryOptionPayload) => Promise<void>;
  isSubmitting: boolean;
}

export const DeliveryOptionModal: React.FC<DeliveryOptionModalProps> = ({ open, onClose, option, existingNames, onSubmit, isSubmitting }) => {
  const isEdit = Boolean(option);

  const methods = useForm<DeliveryOptionPayload>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY_VALUES,
    mode: 'onChange',
  });

  const { reset, control, handleSubmit } = methods;

  // Seed on open so a reopened modal never shows the previous option's values.
  useEffect(() => {
    if (!open) return;
    reset(option ? { name: option.name, type: option.type, status: option.status } : EMPTY_VALUES);
  }, [open, option, reset]);

  const submit = handleSubmit(async (values) => {
    const name = values.name.trim();
    const clashes = existingNames.some((existing) => existing.toLowerCase() === name.toLowerCase() && existing !== option?.name);

    if (clashes) {
      showError(`A delivery option named "${name}" already exists`);
      return;
    }

    try {
      await onSubmit({ ...values, name });
      showSuccess(isEdit ? 'Delivery option updated' : 'Delivery option added');
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent aria-describedby={undefined} className="w-full max-w-md dark:bg-[#222121]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{isEdit ? 'Edit Delivery Option' : 'Add Delivery Option'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex flex-col gap-4 py-2">
            <RHFTextField name="name" label="Name" placeholder="e.g. Table 3, Counter 1, To go" />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DELIVERY_OPTION_TYPE_OPTIONS.map((typeOption) => (
                        <SelectItem key={typeOption.value} value={typeOption.value}>
                          {typeOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DELIVERY_OPTION_STATUS_OPTIONS.map((statusOption) => (
                        <SelectItem key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer">
              Cancel
            </Button>
            {isSubmitting ? (
              <Button type="button" disabled className="cursor-not-allowed">
                <ButtonLoading title="Saving" />
              </Button>
            ) : (
              <Button type="submit" className="cursor-pointer font-semibold">
                Save
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
