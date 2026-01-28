'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
  menuItemLoading?: boolean;
  companyId?: string | null;
}

type AddSaleFormValues = {
  title: string;
  menuItemId: string;
  discountValue: number;
  startDate: Date | string;
  startTime: string;
  endDate: Date | string;
  endTime: string;
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters').default(''),
  menuItemId: Yup.string().required('Menu item is required').default(''),
  discountValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Sale price is required')
    .min(0.01, 'Sale price must be greater than 0')
    .test('less-than-base', 'Sale price must be less than original price', function (value) {
      const { menuItemId } = this.parent;
      const menuItems = this.options.context?.menuItems || [];
      const selectedItem = menuItems.find((item: MenuItem) => item._id === menuItemId);
      if (selectedItem && value) {
        const effectivePrice = selectedItem.discountPrice ?? selectedItem.basePrice;
        return value < effectivePrice;
      }
      return true;
    }),
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
}) as Yup.ObjectSchema<AddSaleFormValues>;

const defaultValues: AddSaleFormValues = {
  title: '',
  menuItemId: '',
  discountValue: '' as any,
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

export const AddSaleModal: React.FC<AddSaleModalProps> = ({ isOpen, onClose, menuItems = [], menuItemLoading = false, companyId }) => {
  const [addSale, { isLoading: addSaleLoading }] = useAddMenuManagementSaleMutation();

  const methods = useForm<AddSaleFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
    context: { menuItems },
  });

  const { reset, watch } = methods;

  const selectedMenuItemId = watch('menuItemId');
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

  const selectedItem = useMemo(() => menuItems.find((item) => item._id === selectedMenuItemId), [menuItems, selectedMenuItemId]);

  // Get effective price (discountPrice if available, otherwise basePrice)
  const effectivePrice = useMemo(() => {
    if (selectedItem) {
      return selectedItem.discountPrice ?? selectedItem.basePrice;
    }
    return 0;
  }, [selectedItem]);

  const discountAmount = useMemo(() => {
    if (selectedItem && discountValue > 0 && discountValue < effectivePrice) {
      return effectivePrice - discountValue;
    }
    return 0;
  }, [selectedItem, discountValue, effectivePrice]);

  const discountPercentage = useMemo(() => {
    if (selectedItem && discountAmount > 0 && effectivePrice > 0) {
      return ((discountAmount / effectivePrice) * 100).toFixed(0);
    }
    return 0;
  }, [selectedItem, discountAmount, effectivePrice]);

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const handleSubmit = async (formData: AddSaleFormValues) => {
    try {
      if (!companyId) {
        showError('Company ID is required');
        return;
      }

      const payload = {
        title: formData.title,
        discountType: 'fixed' as const,
        discountValue: Number(formData.discountValue),
        menuItems: [formData.menuItemId],
        startDateTime: formatDateTimeToAPI(formData.startDate, formData.startTime),
        endDateTime: formatDateTimeToAPI(formData.endDate, formData.endTime),
        creator: companyId,
      };

      const response = await addSale(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Sale created successfully');
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[600px]!"
        >
          <DialogHeader>
            <DialogTitle>Add Sale</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="w-full space-y-5">
                {/* Title */}
                <RHFTextField name="title" label="Sale Title" placeholder="e.g., Holiday Special Discount" />

                {/* Menu Item Selection */}
                {menuItemLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="ml-1 h-3 w-32 rounded-4xl" />
                    <Skeleton className="h-8 rounded-xl" />
                  </div>
                ) : (
                  <RHFCustomDropdown
                    name="menuItemId"
                    label="Select Menu Item"
                    placeholder="Choose an item"
                    options={menuItemOptions}
                    isLoading={menuItemLoading}
                    showNone={false}
                  />
                )}

                {/* Original Price Display & Discount Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Original Price</Label>
                    <div className="flex h-11 items-center rounded-md border-2 border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
                      €{selectedItem ? effectivePrice.toFixed(2) : '0.00'}
                    </div>
                  </div>

                  <RHFTextField name="discountValue" label="Sale Price (€)" placeholder="0.00" type="number" step="0.01" min="0.01" />
                </div>

                {/* Sale Discount Preview */}
                {selectedItem && discountValue > 0 && discountValue < effectivePrice && (
                  <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950">
                    <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                      💰 Discount: €{discountAmount.toFixed(2)} ({discountPercentage}% off)
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
                      Create Sale
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
