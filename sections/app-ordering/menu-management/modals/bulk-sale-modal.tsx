'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddMenuManagementSaleMutation } from '@/store/Reducer/menu-management-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface MenuItem {
  _id: string;
  title: string;
  basePrice: number;
  discountPrice: number;
  taxPercent: number;
}

interface BulkSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
  menuItemLoading?: boolean;
  companyId: string | null;
}

type BulkSaleFormValues = {
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  selectedMenuItems: string[];
  startDate: Date | string;
  startTime: string;
  endDate: Date | string;
  endTime: string;
};

const schema = Yup.object().shape({
  title: Yup.string().required('Sale name is required').min(3, 'Sale name must be at least 3 characters').default(''),
  discountType: Yup.string()
    .oneOf(['percentage', 'fixed'] as const)
    .required('Discount type is required')
    .default('percentage'),
  discountValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Discount value is required')
    .min(0.01, 'Discount value must be greater than 0')
    .when('discountType', {
      is: 'percentage',
      then: (schema) => schema.max(100, 'Percentage cannot exceed 100%'),
      otherwise: (schema) => schema.min(0.01, 'Amount must be greater than 0'),
    }),
  selectedMenuItems: Yup.array().of(Yup.string()).min(1, 'Please select at least one menu item').required('Menu items are required'),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
  startTime: Yup.string()
    .required('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .default(''),
  endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date').typeError('Invalid date'),
  endTime: Yup.string()
    .required('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .default(''),
}) as Yup.ObjectSchema<BulkSaleFormValues>;

const defaultValues: BulkSaleFormValues = {
  title: '',
  discountType: 'percentage',
  discountValue: '' as any,
  selectedMenuItems: [],
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
};

const formatDateTimeToAPI = (date: Date | string, time: string): string => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  // Convert 24h time to 12h with AM/PM
  const [hours24, minutes] = time.split(':').map(Number);
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const formattedTime = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;

  return `${year}-${month}-${day} ${formattedTime}`;
};

export const BulkSaleModal: React.FC<BulkSaleModalProps> = ({ isOpen, onClose, menuItems = [], menuItemLoading = false, companyId }) => {
  const [addSale, { isLoading: addSaleLoading }] = useAddMenuManagementSaleMutation();

  const methods = useForm<BulkSaleFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { reset, watch } = methods;

  const discountType = watch('discountType');
  const discountValue = watch('discountValue');

  const menuItemOptions = useMemo(
    () =>
      menuItems.map((item) => {
        const effectivePrice = item.discountPrice ?? item.basePrice;
        return {
          label: `${item.title} - €${effectivePrice.toFixed(2)}`,
          value: item._id,
        };
      }),
    [menuItems]
  );

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const handleSubmit = async (formData: BulkSaleFormValues) => {
    try {
      if (!companyId) {
        showError('Company ID is required');
        return;
      }

      const payload = {
        title: formData.title,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        menuItems: formData.selectedMenuItems,
        startDateTime: formatDateTimeToAPI(formData.startDate, formData.startTime),
        endDateTime: formatDateTimeToAPI(formData.endDate, formData.endTime),
        creator: companyId,
      };

      const response = await addSale(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Bulk sale created successfully');
      handleClose();
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>Create Bulk Sale</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="w-full space-y-5">
                {/* Sale Name */}
                <RHFTextField name="title" label="Sale Name" placeholder="e.g., Happy Hour, Weekend Special" />

                {/* Discount Type and Value Row */}
                <div className="grid grid-cols-2 gap-4">
                  <RHFSelectField
                    name="discountType"
                    label="Discount Type"
                    placeholder="Select type"
                    options={[
                      { label: 'Percentage (%)', value: 'percentage' },
                      { label: 'Fixed Amount (€)', value: 'fixed' },
                    ]}
                  />

                  <RHFTextField
                    name="discountValue"
                    label={discountType === 'percentage' ? 'Discount Value' : 'Discount Price'}
                    placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 5.00'}
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={discountType === 'percentage' ? 100 : undefined}
                  />
                </div>

                {/* Discount Preview */}
                {discountValue > 0 && (
                  <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950">
                    <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                      💰 Discount: {discountType === 'percentage' ? `${discountValue}% OFF` : `€${Number(discountValue).toFixed(2)} OFF`}
                    </div>
                  </div>
                )}

                {/* Sale Period */}
                <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sale Period</div>

                  {/* Start Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <RHFDate name="startDate" label="Start Date" placeholder="Select start date" />
                    <RHFTextField name="startTime" label="Start Time" placeholder="00:00" type="time" />
                  </div>

                  {/* End Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <RHFDate name="endDate" label="End Date" placeholder="Select end date" />
                    <RHFTextField name="endTime" label="End Time" placeholder="00:00" type="time" />
                  </div>
                </div>

                {/* Select Items for Sale */}
                {menuItemLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="ml-1 h-3 w-40 rounded-4xl" />
                    <Skeleton className="h-32 rounded-4xl" />
                  </div>
                ) : (
                  <RHFCustomCombobox
                    name="selectedMenuItems"
                    label="Select Items for Sale"
                    placeholder="Select menu items"
                    className="w-full"
                    multiple={true}
                    allowCustom={false}
                    options={menuItemOptions}
                  />
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={addSaleLoading} className="h-10 font-bold">
                    Cancel
                  </Button>

                  {addSaleLoading ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary h-10 cursor-not-allowed px-4 text-white">
                      <ButtonLoading title="Creating" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-primary hover:bg-primary-dark h-10 cursor-pointer px-4 text-white">
                      Create Bulk Sale
                    </Button>
                  )}
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
