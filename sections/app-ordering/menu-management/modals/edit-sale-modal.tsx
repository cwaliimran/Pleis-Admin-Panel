'use client';
import Time24hInput from '@/components/common/time-24h-input';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFDate from '@/components/rhf/rhf-date';
import RHFSelectField from '@/components/rhf/rhf-select-field';
import RHFTextField from '@/components/rhf/rhf-text-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useUpdateSaleItemMutation } from '@/store/Reducer/menu-management-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SaleItem } from '../types';

interface MenuItemOption {
  label: string;
  value: string;
}

interface MenuItemOption {
  label: string;
  value: string;
}

interface MenuItem {
  _id: string;
  title: string;
}

interface EditSaleModalProps {
  open: boolean;
  onClose: () => void;
  sale: SaleItem;
  menuItems?: MenuItem[];
  menuItemLoading?: boolean;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Sale name is required').min(3, 'Sale name must be at least 3 characters').default(''),
  discountType: Yup.string()
    .oneOf(['percentage', 'fixed'] as const)
    .required('Discount type is required')
    .default('percentage'),
  discountValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Discount value is required')
    .min(0.01, 'Discount value must be greater than 0'),
  menuItems: Yup.array().of(Yup.string()).min(1, 'Please select at least one menu item').required('Menu items are required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
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
}) as Yup.ObjectSchema<any>;

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

const parseDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d;
};

const parseTime = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Helper function to get effective price (handles discountPrice being 0, null, or undefined)
const getEffectivePrice = (item: any): any => {
  return item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.basePrice;
};

const EditSaleModal: React.FC<EditSaleModalProps> = ({ open, onClose, sale, menuItems, menuItemLoading }) => {
  const [updateSale, { isLoading }] = useUpdateSaleItemMutation();

  // Use all menu items if provided, else fallback to sale.menuItems
  const menuItemOptions: MenuItemOption[] = useMemo(() => {
    if (menuItems && menuItems.length > 0) {
      return menuItems.map((item) => ({
        // label: item.title,
        label: `${item.title} - €${getEffectivePrice(item).toFixed(2)}`,
        value: item._id,
      }));
    }
    // fallback to sale.menuItems (for direct edit from card)
    return sale.menuItems.map((item) => ({
      //   label: item.title,
      label: `${item.title} - €${getEffectivePrice(item).toFixed(2)}`,
      value: item.id,
    }));
  }, [menuItems, sale.menuItems]);

  const defaultValues = useMemo(
    () => ({
      title: sale.title,
      discountType: sale.discountType,
      discountValue: sale.discountValue,
      menuItems: sale.menuItems.map((item) => item.id),
      status: sale.status || 'active',
      startDate: parseDate(sale.startDateTime as any),
      startTime: parseTime(sale.startDateTime as any),
      endDate: parseDate(sale.endDateTime as any),
      endTime: parseTime(sale.endDateTime as any),
    }),
    [sale]
  );

  const methods = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { reset } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        id: sale.id,
        title: formData.title,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        menuItems: formData.menuItems,
        status: formData.status,
        startDateTime: formatDateTimeToAPI(formData.startDate, formData.startTime),
        endDateTime: formatDateTimeToAPI(formData.endDate, formData.endTime),
      };
      const response = await updateSale(payload).unwrap();
      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }
      showSuccess(response?.message || 'Sale updated successfully');
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleSubmit)} className="w-full space-y-5">
                <RHFTextField name="title" label="Sale Name" placeholder="e.g., Happy Hour, Weekend Special" />
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
                  <RHFTextField name="discountValue" label="Discount Value" placeholder="e.g., 20 or 5.00" type="number" step="0.01" min="0.01" />
                </div>

                {menuItemLoading ? (
                  <div className="space-y-2">
                    <div className="ml-1 h-3 w-40 animate-pulse rounded-4xl bg-gray-200 dark:bg-gray-700" />
                    <div className="h-32 animate-pulse rounded-4xl bg-gray-200 dark:bg-gray-700" />
                  </div>
                ) : (
                  <RHFCustomCombobox
                    name="menuItems"
                    label="Select Items for Sale"
                    placeholder="Select menu items"
                    className="w-full"
                    multiple={true}
                    allowCustom={false}
                    options={menuItemOptions}
                  />
                )}

                <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sale Period</div>
                  <div className="grid grid-cols-2 gap-4">
                    <RHFDate name="startDate" label="Start Date" placeholder="Select start date" />
                    <Controller
                      name="startTime"
                      control={methods.control}
                      render={({ field, fieldState }) => (
                        <div>
                          <div className="mb-0.5 text-sm font-semibold">Start Time</div>
                          <Time24hInput
                            title="Start time"
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="HH:mm"
                            className="w-full"
                          />
                          {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <RHFDate name="endDate" label="End Date" placeholder="Select end date" />
                    <Controller
                      name="endTime"
                      control={methods.control}
                      render={({ field, fieldState }) => (
                        <div>
                          <div className="mb-0.5 text-sm font-semibold">End Time</div>
                          <Time24hInput title="End time" value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" className="w-full" />
                          {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <RHFSelectField
                    name="status"
                    label="Select Status"
                    placeholder="Select Status"
                    className="w-full flex-1"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="h-10 font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary-dark h-10 cursor-pointer px-4 text-white" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default EditSaleModal;
