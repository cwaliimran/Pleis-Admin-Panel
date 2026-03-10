'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddPromoCodeMutation, useUpdatePromoCodeMutation } from '@/store/Reducer/promo-codes-api';
import { getErrorMessage } from '@/utils/api';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type PromoCodeFormValues = {
  promoCode: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  maxDiscountCap: number | null;
  maxCountPerUser: number | null;
  expiryDate: string | Date;
  maxUsage: number;
  status?: 'active' | 'inactive';
};

type PromoCodeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  companyId?: any;
};

const schema = Yup.object().shape({
  promoCode: Yup.string().required('Promo code is required').min(3, 'Must be at least 3 characters').default(''),
  title: Yup.string().required('Title is required').default(''),
  description: Yup.string().required('Description is required').default(''),
  discountType: Yup.string()
    .oneOf(['percentage', 'amount'] as const)
    .required('Discount type is required')
    .default('percentage'),
  discountValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Discount value is required')
    .min(1, 'Must be at least 1')
    .when('discountType', {
      is: 'percentage',
      then: (schema) => schema.max(100, 'Percentage cannot exceed 100%'),
      otherwise: (schema) => schema.min(1, 'Amount must be greater than 0'),
    }),
  maxDiscountCap: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(1, 'Must be at least 1')
    .nullable()
    .default(null),
  maxCountPerUser: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(1, 'Must be at least 1')
    .nullable()
    .default(null),
  expiryDate: Yup.string().required('Expiry date is required').default(''),
  maxUsage: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Max usage is required')
    .min(1, 'Must be at least 1')
    .default(0),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<PromoCodeFormValues>;

const defaultValues: PromoCodeFormValues = {
  promoCode: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: '' as any,
  maxDiscountCap: '' as any,
  maxCountPerUser: '' as any,
  expiryDate: '',
  maxUsage: '' as any,
  status: 'active',
};

const PromoCodeModal = ({ open, onClose, isEdit = false, selectedData, companyId }: PromoCodeModalProps) => {
  const [addPromoCode, { isLoading: addLoading }] = useAddPromoCodeMutation();
  const [updatePromoCode, { isLoading: updateLoading }] = useUpdatePromoCodeMutation();

  const methods = useForm<PromoCodeFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, watch } = methods;
  const isDirty = formState?.isDirty;

  const discountType = watch('discountType');
  const discountValue = watch('discountValue');

  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'amount', label: 'Fixed Amount (€)' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mappedData: PromoCodeFormValues = {
        promoCode: selectedData?.promoCode || '',
        title: selectedData?.title || '',
        description: selectedData?.description || '',
        discountType: selectedData?.discountType || 'percentage',
        discountValue: selectedData?.discountValue || ('' as any),
        maxDiscountCap: selectedData?.maxDiscountCap || ('' as any),
        maxCountPerUser: selectedData?.maxCountPerUser || ('' as any),
        expiryDate: selectedData?.expiryDate ? new Date(selectedData.expiryDate) : '',
        maxUsage: selectedData?.maxUsage || ('' as any),
        status: selectedData?.status || 'active',
      };

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: PromoCodeFormValues) => {
    try {
      const payload: any = {
        promoCode: formData.promoCode.toUpperCase(),
        title: formData.title,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        expiryDate: fDate(formData.expiryDate, formatStr.paramCase.db),
        maxUsage: Number(formData.maxUsage),
      };

      // Add optional fields only if provided
      if (formData.maxDiscountCap && Number(formData.maxDiscountCap) > 0) {
        payload.maxDiscountCap = Number(formData.maxDiscountCap);
      }

      if (formData.maxCountPerUser && Number(formData.maxCountPerUser) > 0) {
        payload.maxCountPerUser = Number(formData.maxCountPerUser);
      }

      // Add fields for edit mode
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      if (companyId) {
        payload.companyOrganizer = companyId;
      }

      const response = isEdit ? await updatePromoCode(payload).unwrap() : await addPromoCode(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Promo code updated successfully' : 'Promo code created successfully'));

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

  const isLoading = addLoading || updateLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="promoCode" label="Promo Code" placeholder="e.g., SUMMER2025" />

                  <RHFTextField name="title" label="Promo Code Title" placeholder="e.g., Summer Sale 2025" />

                  <RHFTextField name="description" label="Description" placeholder="e.g., Get 20% off on all products" multiline rows={2} />
                </div>

                {/* Discount Type & Value */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField name="discountType" label="Discount Type" placeholder="Select discount type" options={discountTypeOptions} />

                  <RHFTextField
                    name="discountValue"
                    label={discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (€)'}
                    placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                    type="number"
                    min="1"
                    max={discountType === 'percentage' ? 100 : undefined}
                  />
                </div>

                {/* Preview Box */}
                <div className="rounded-lg bg-linear-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</p>
                  <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                    {discountType === 'percentage' ? `${discountValue || 0}% OFF` : `€${discountValue || 0} OFF`}
                  </p>
                </div>

                {/* Optional Fields */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="maxDiscountCap" label="Max Discount Cap (Optional)" placeholder="e.g., 500" type="number" min="1" />

                  <RHFTextField name="maxCountPerUser" label="Max Uses Per User (Optional)" placeholder="e.g., 5" type="number" min="1" />
                </div>

                {/* Expiry Date & Max Usage */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFDate name="expiryDate" label="Expiry Date" placeholder="Select expiry date" />

                  <RHFTextField name="maxUsage" label="Total Max Usage" placeholder="e.g., 100" type="number" min="1" />
                </div>

                {/* Help Text */}
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  <p className="font-medium">📝 Note:</p>
                  <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
                    <li>
                      <strong>Total Max Usage:</strong> Maximum times this code can be used overall
                    </li>
                    <li>
                      <strong>Max Uses Per User:</strong> How many times one user can use this code
                    </li>
                    <li>
                      <strong>Max Discount Cap:</strong> Maximum discount amount (useful for percentage discounts)
                    </li>
                  </ul>
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
                    {isEdit ? 'Update Promo Code' : 'Create Promo Code'}
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

export default PromoCodeModal;
