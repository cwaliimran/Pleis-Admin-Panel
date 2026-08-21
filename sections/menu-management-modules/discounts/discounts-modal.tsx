'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAddDiscountMutation, useUpdateDiscountMutation } from '@/store/Reducer/discounts-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { DiscountTypeCards, ItemsPicker } from './discounts-modal-fields';
import { DiscountFormValues, DiscountModalProps, DiscountType } from './types';
import { buildDiscountDateTime, parseDiscountDateTime } from './utils';

const NO_MIN_DATE = new Date(0);

type DiscountValidationContext = {
  itemsTotal: number;
  itemsTotalKnown: boolean;
  ignorePastStart: boolean;
  ignorePastEnd: boolean;
};

const startOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isPastDate = (date?: Date) => !!date && date.getTime() < startOfToday().getTime();

const defaultValues: DiscountFormValues = {
  name: '',
  type: 'percentage',
  value: '',
  menuItems: [],
  startDateDate: undefined,
  startTime: '',
  endDateDate: undefined,
  endTime: '',
  status: 'active',
};

const isValidTime = (time?: string) => !!time && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const combineDateTime = (date?: Date, time?: string): number | null => {
  if (!date || !isValidTime(time)) return null;
  const [hours, minutes] = time!.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.getTime();
};

const schema = Yup.object().shape({
  name: Yup.string().required('Discount name is required'),
  type: Yup.mixed<'percentage' | 'fixed'>().oneOf(['percentage', 'fixed']).required(),
  value: Yup.string()
    .required('Value is required')
    .test('is-decimal', 'Value must be a valid number greater than 0', (value) => !!value && !isNaN(Number(value)) && Number(value) > 0)
    .test('within-items-total', 'Value is too high for the selected items', function (value) {
      const amount = Number(value);
      if (!value || isNaN(amount) || amount <= 0) return true;

      const type = this.parent.type as DiscountType;
      const context = this.options.context as DiscountValidationContext | undefined;

      if (type === 'percentage') {
        return amount > 100 ? this.createError({ message: 'Percentage cannot be more than 100%' }) : true;
      }

      if (!context?.itemsTotalKnown || context.itemsTotal <= 0) return true;
      return amount > context.itemsTotal
        ? this.createError({ message: `Cannot be more than the selected items' total (€${context.itemsTotal.toFixed(2)})` })
        : true;
    }),
  menuItems: Yup.array().of(Yup.string().required()).min(1, 'Select at least one menu item').required(),
  startDateDate: Yup.date()
    .required('Start date is required')
    .test('not-past', 'Start date cannot be in the past', function (value) {
      const context = this.options.context as DiscountValidationContext | undefined;
      if (context?.ignorePastStart) return true;
      return !isPastDate(value);
    }),
  startTime: Yup.string().required('Start time is required').test('valid-time', 'Invalid time format', isValidTime),
  endDateDate: Yup.date()
    .required('End date is required')
    .test('not-past', 'End date cannot be in the past', function (value) {
      const context = this.options.context as DiscountValidationContext | undefined;
      if (context?.ignorePastEnd) return true;
      return !isPastDate(value);
    })
    .test('after-start', 'End date/time must be after the start date/time', function (value) {
      const { startDateDate, startTime, endTime } = this.parent;
      const start = combineDateTime(startDateDate, startTime);
      const end = combineDateTime(value, endTime);
      if (start === null || end === null) return true;
      return end > start;
    }),
  endTime: Yup.string().required('End time is required').test('valid-time', 'Invalid time format', isValidTime),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const DiscountModal = ({ open, onClose, isEdit = false, selectedData, companyId, userType }: DiscountModalProps) => {
  const [addDiscount, { isLoading: addLoading }] = useAddDiscountMutation();
  const [updateDiscount, { isLoading: updateLoading }] = useUpdateDiscountMutation();
  const submitting = addLoading || updateLoading;

  const validationContext = useRef<DiscountValidationContext>({
    itemsTotal: 0,
    itemsTotalKnown: false,
    ignorePastStart: false,
    ignorePastEnd: false,
  }).current;

  const methods = useForm<DiscountFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<DiscountFormValues>),
    defaultValues,
    context: validationContext,
  });

  const { reset, control, trigger, formState } = methods;
  const isDirty = formState?.isDirty;
  const type = useWatch({ control, name: 'type' });
  const value = useWatch({ control, name: 'value' });
  const startDateDate = useWatch({ control, name: 'startDateDate' });
  const startTime = useWatch({ control, name: 'startTime' });
  const endDateDate = useWatch({ control, name: 'endDateDate' });
  const endTime = useWatch({ control, name: 'endTime' });

  const [itemsTotal, setItemsTotal] = useState({ total: 0, allPricesKnown: false });

  const handleItemsTotalChange = useCallback((total: number, allPricesKnown: boolean) => {
    setItemsTotal((prev) => (prev.total === total && prev.allPricesKnown === allPricesKnown ? prev : { total, allPricesKnown }));
  }, []);

  validationContext.itemsTotal = itemsTotal.total;
  validationContext.itemsTotalKnown = itemsTotal.allPricesKnown;
  // A pre-existing schedule the user hasn't touched is left alone — the past-date rule only applies
  // to a date they actually pick, so editing an old discount doesn't open with two red fields.
  validationContext.ignorePastStart = isEdit && !formState.dirtyFields.startDateDate;
  validationContext.ignorePastEnd = isEdit && !formState.dirtyFields.endDateDate;

  // Re-check the end-after-start rule live as the surrounding fields change, not just on submit.
  useEffect(() => {
    if (endDateDate || formState.touchedFields.endDateDate || formState.submitCount > 0) {
      trigger('endDateDate');
    }
  }, [startDateDate, startTime, endDateDate, endTime, trigger, formState.touchedFields.endDateDate, formState.submitCount]);

  // Surface the past-date and items-total errors as soon as the user picks/types, not on submit.
  useEffect(() => {
    if (startDateDate) trigger('startDateDate');
  }, [startDateDate, trigger]);

  useEffect(() => {
    if (value) trigger('value');
  }, [value, type, itemsTotal, trigger]);

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const start = parseDiscountDateTime(selectedData.startDate);
      const end = parseDiscountDateTime(selectedData.endDate);

      reset({
        name: selectedData.name,
        type: selectedData.type,
        value: String(selectedData.value),
        menuItems: selectedData.menuItems.map((item) => item._id),
        startDateDate: start.date,
        startTime: start.time24,
        endDateDate: end.date,
        endTime: end.time24,
        status: selectedData.status === 'active' ? 'active' : 'inactive',
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: DiscountFormValues) => {
    const payload: any = {
      name: formData.name,
      type: formData.type,
      value: Number(formData.value),
      menuItems: formData.menuItems,
      startDate: buildDiscountDateTime(formData.startDateDate!, formData.startTime),
      endDate: buildDiscountDateTime(formData.endDateDate!, formData.endTime),
      status: formData.status,
    };
    if (userType === 'super-admin' && companyId) payload.companyOrganizer = companyId;

    try {
      if (isEdit && selectedData?._id) {
        await updateDiscount({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Discount updated successfully');
      } else {
        await addDiscount(payload).unwrap();
        showSuccess('Discount created successfully');
      }
      reset(defaultValues);
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-162.5!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-5">
                {/* BASIC INFORMATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Basic Information</h4>

                  <RHFTextField name="name" label="Discount name" placeholder="e.g. Summer Happy Hour" />
                </div>

                {/* DISCOUNT VALUE */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Discount Value</h4>

                  <DiscountTypeCards />

                  <div>
                    <RHFTextField name="value" label="Value" type="number" placeholder="e.g. 15" step="0.01" min="0.01" />
                    <p className="text-muted-foreground mt-1 text-xs">
                      {type === 'fixed' ? 'Enter fixed amount in € (e.g. 5 = €5 off)' : 'Enter percentage (e.g. 15 = 15% off)'}
                    </p>
                  </div>
                </div>

                {/* APPLIES TO */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">
                    Applies To <span className="normal-case">· select a menu, then one or more of its items</span>
                  </h4>

                  <ItemsPicker
                    name="menuItems"
                    companyId={companyId}
                    userType={userType}
                    initialItemRefs={selectedData?.menuItems}
                    onTotalChange={handleItemsTotalChange}
                  />
                </div>

                {/* SCHEDULE */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Schedule</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFDate name="startDateDate" label="Start date" placeholder="Select date" minDate={NO_MIN_DATE} displayFormat="dd/MM/yyyy" />

                    <FormField
                      control={control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start time</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" title="Start Time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <RHFDate name="endDateDate" label="End date" placeholder="Select date" minDate={NO_MIN_DATE} displayFormat="dd/MM/yyyy" />

                    <FormField
                      control={control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End time</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" title="End Time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Status</h4>

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => {
                      const checked = field.value === 'active';
                      return (
                        <FormItem className="mt-1 flex flex-row items-center justify-between gap-4">
                          <FormLabel>Active</FormLabel>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={checked}
                            onClick={() => field.onChange(checked ? 'inactive' : 'active')}
                            className={cn(
                              'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
                              checked ? 'bg-primary' : 'bg-input'
                            )}
                          >
                            <span
                              className={cn(
                                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                                checked && 'translate-x-5'
                              )}
                            />
                          </button>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex w-full items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={submitting} className="cursor-pointer px-4 py-2">
                  Cancel
                </Button>

                {submitting ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Discount' : 'Create Discount'}
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

export default DiscountModal;
