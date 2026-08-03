'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFChipToggleGroup, RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFTimeField from '@/components/rhf/rhf-time-field';
import RHFToggleField from '@/components/rhf/rhf-toggle-field';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import PromotionItemsField from '../components/promotion-items-field';
import {
  POINTS_MULTIPLIER_OPTIONS,
  PROMOTION_ACTIVE_DAYS_OPTIONS,
  PROMOTION_ITEMS_FIELD_LABELS,
  PROMOTION_TYPE_FORM_OPTIONS,
  PROMOTION_TYPE_HINTS,
  WEEKDAY_OPTIONS,
} from '../constants';
import { MOCK_MENUS, MOCK_MENU_ITEMS } from '../mock-data';
import { Promotion, PromotionActiveDaysMode, PromotionPayload, PromotionType, Weekday } from '../types';

/** Numbers are held as strings so empty inputs stay empty rather than becoming 0. */
interface PromotionFormValues {
  image: unknown;
  title: string;
  description: string;
  type: PromotionType;
  menuId: string;
  qualifyingItemIds: string[];
  extraPointsPerPurchase: string;
  pointsMultiplier: string;
  discountPercent: string;
  startDate: Date | string;
  endDate: Date | string;
  activeDaysMode: PromotionActiveDaysMode;
  activeWeekdays: Weekday[];
  startTime: string;
  endTime: string;
  isActive: boolean;
}

/** The two types that draw items from a menu. */
const ITEM_BASED_TYPES: PromotionType[] = ['extraPoints', 'itemDiscount'];

const schema = yup.object({
  image: yup.mixed().nullable(),
  title: yup.string().required('Title is required'),
  description: yup.string(),
  type: yup.string().required('Promotion type is required'),
  menuId: yup.string().when('type', {
    is: (value: PromotionType) => ITEM_BASED_TYPES.includes(value),
    then: (current) => current.required('Menu is required'),
    otherwise: (current) => current,
  }),
  qualifyingItemIds: yup
    .array()
    .of(yup.string().required())
    .when('type', {
      is: (value: PromotionType) => ITEM_BASED_TYPES.includes(value),
      then: (current) => current.min(1, 'Add at least one item'),
      otherwise: (current) => current,
    }),
  extraPointsPerPurchase: yup.string().when('type', {
    is: 'extraPoints',
    then: (current) =>
      current.required('Extra points is required').test('is-positive', 'Extra points must be greater than 0', (value) => Number(value) > 0),
    otherwise: (current) => current,
  }),
  pointsMultiplier: yup.string().when('type', {
    is: 'happyHour',
    then: (current) => current.required('Points multiplier is required'),
    otherwise: (current) => current,
  }),
  discountPercent: yup.string().when('type', {
    is: 'itemDiscount',
    then: (current) =>
      current.required('Discount is required').test('is-valid-percent', 'Must be between 1 and 100', (value) => {
        const parsed = Number(value);
        return parsed >= 1 && parsed <= 100;
      }),
    otherwise: (current) => current,
  }),
  startDate: yup.mixed<Date | string>().required('Start date is required'),
  endDate: yup
    .mixed<Date | string>()
    .required('End date is required')
    .test('after-start', 'End date must be on or after the start date', function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value as Date).getTime() >= new Date(startDate as Date).getTime();
    }),
  activeDaysMode: yup.string().required('Active days is required'),
  activeWeekdays: yup
    .array()
    .of(yup.string().required())
    .when('activeDaysMode', {
      is: 'specific',
      then: (current) => current.min(1, 'Pick at least one day'),
      otherwise: (current) => current,
    }),
  startTime: yup.string(),
  endTime: yup.string(),
  isActive: yup.boolean(),
});

const defaultValues: PromotionFormValues = {
  image: null,
  title: '',
  description: '',
  type: 'extraPoints',
  menuId: '',
  qualifyingItemIds: [],
  extraPointsPerPurchase: '',
  pointsMultiplier: '1.5',
  discountPercent: '',
  startDate: '',
  endDate: '',
  activeDaysMode: 'all',
  activeWeekdays: [],
  startTime: '',
  endTime: '',
  isActive: true,
};

interface PromotionFormModalProps {
  open: boolean;
  /** `null` opens the form in create mode. */
  promotion: Promotion | null;
  isSubmitting?: boolean;
  onSubmit: (payload: PromotionPayload) => Promise<void>;
  onClose: () => void;
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ open, promotion, isSubmitting = false, onSubmit, onClose }) => {
  const isEdit = Boolean(promotion);

  const methods = useForm<PromotionFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues,
  });

  const { watch, reset, setValue, handleSubmit } = methods;

  const type = watch('type');
  const menuId = watch('menuId');
  const activeDaysMode = watch('activeDaysMode');
  const isActive = watch('isActive');

  // Reload whenever the modal opens so a stale draft never leaks into the next use.
  useEffect(() => {
    if (!open) return;

    if (!promotion) {
      reset(defaultValues);
      return;
    }

    reset({
      image: promotion.image || null,
      title: promotion.title,
      description: promotion.description,
      // A legacy record cannot be retyped, but its own type is not selectable —
      // fall back so the dropdown still has a valid value.
      type: PROMOTION_TYPE_FORM_OPTIONS.some((option) => option.value === promotion.type) ? promotion.type : 'extraPoints',
      menuId: promotion.menuId || '',
      qualifyingItemIds: promotion.qualifyingItemIds,
      extraPointsPerPurchase: promotion.extraPointsPerPurchase ? String(promotion.extraPointsPerPurchase) : '',
      pointsMultiplier: String(promotion.pointsMultiplier || 1.5),
      discountPercent: promotion.discountPercent ? String(promotion.discountPercent) : '',
      startDate: promotion.startDate ? new Date(promotion.startDate) : '',
      endDate: promotion.endDate ? new Date(promotion.endDate) : '',
      activeDaysMode: promotion.activeDaysMode || 'all',
      activeWeekdays: promotion.activeWeekdays,
      startTime: promotion.startTime || '',
      endTime: promotion.endTime || '',
      isActive: promotion.status === 'active',
    });
  }, [open, promotion, reset]);

  // Leaving a branch makes its selections meaningless — drop them so they
  // cannot be submitted or trip validation from behind a hidden field.
  useEffect(() => {
    if (!ITEM_BASED_TYPES.includes(type)) {
      setValue('menuId', '');
      setValue('qualifyingItemIds', []);
    }
    if (type !== 'extraPoints') setValue('extraPointsPerPurchase', '');
    if (type !== 'itemDiscount') setValue('discountPercent', '');
  }, [type, setValue]);

  useEffect(() => {
    if (activeDaysMode !== 'specific') setValue('activeWeekdays', []);
  }, [activeDaysMode, setValue]);

  const menuOptions = useMemo(() => MOCK_MENUS.map((menu) => ({ value: menu.id, label: menu.name })), []);

  // Narrow to the chosen menu; before one is picked every item is fair game.
  const itemOptions = useMemo(() => (menuId ? MOCK_MENU_ITEMS.filter((item) => item.menuId === menuId) : MOCK_MENU_ITEMS), [menuId]);

  const hint = PROMOTION_TYPE_HINTS[type];
  const itemsFieldLabel = PROMOTION_ITEMS_FIELD_LABELS[type];

  const submit = async (values: PromotionFormValues) => {
    try {
      const itemBased = ITEM_BASED_TYPES.includes(values.type);

      const payload: PromotionPayload = {
        title: values.title.trim(),
        image: typeof values.image === 'string' ? values.image : '',
        description: values.description?.trim() || '',
        type: values.type,
        status: values.isActive ? 'active' : 'inactive',
        menuId: itemBased ? values.menuId : undefined,
        qualifyingItemIds: itemBased ? values.qualifyingItemIds : [],
        extraPointsPerPurchase: values.type === 'extraPoints' ? Number(values.extraPointsPerPurchase) : 0,
        pointsMultiplier: values.type === 'happyHour' ? Number(values.pointsMultiplier) : 1,
        discountPercent: values.type === 'itemDiscount' ? Number(values.discountPercent) : 0,
        startDate: values.startDate instanceof Date ? values.startDate.toISOString().slice(0, 10) : String(values.startDate),
        endDate: values.endDate instanceof Date ? values.endDate.toISOString().slice(0, 10) : String(values.endDate),
        activeDaysMode: values.activeDaysMode,
        activeWeekdays: values.activeDaysMode === 'specific' ? values.activeWeekdays : [],
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
      };

      await onSubmit(payload);
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
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">{isEdit ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-4">
            <RHFUploadAvatar name="image" label="Promotion Image" initialImage={promotion?.image || null} />

            <RHFTextField name="title" label="Title" placeholder="Enter Title" />

            <RHFTextField name="description" label="Description (optional)" placeholder="Enter Description" multiline rows={3} />

            <RHFSelectField
              name="type"
              label="Promotion Type"
              placeholder="Select promotion type"
              className="w-full"
              options={PROMOTION_TYPE_FORM_OPTIONS}
            />

            {hint && (
              <div className={cn('rounded-lg border px-3 py-2.5', hint.className)}>
                <p className="text-xs leading-relaxed">
                  {hint.icon} {hint.lead}
                  {hint.emphasis && (
                    <>
                      {' '}
                      <span className="font-semibold">{hint.emphasis}</span>
                      {hint.trail === '.' ? '.' : ` ${hint.trail}`}
                    </>
                  )}
                </p>
              </div>
            )}

            {ITEM_BASED_TYPES.includes(type) && (
              <>
                <RHFCustomDropdown name="menuId" label="Select Menu" placeholder="Select menu" options={menuOptions} showNone={false} />

                <PromotionItemsField name="qualifyingItemIds" label={itemsFieldLabel || 'Add Items'} options={itemOptions} />
              </>
            )}

            {type === 'extraPoints' && (
              <RHFTextField
                name="extraPointsPerPurchase"
                label="Extra Points per Purchase"
                placeholder="Extra points awarded on top of regular"
                type="number"
                min="1"
              />
            )}

            {type === 'happyHour' && (
              <RHFSelectField
                name="pointsMultiplier"
                label="Points Multiplier"
                placeholder="Select multiplier"
                className="w-full"
                options={POINTS_MULTIPLIER_OPTIONS}
              />
            )}

            {type === 'itemDiscount' && (
              <div>
                <RHFTextField name="discountPercent" label="Discount" placeholder="% off (e.g. 20)" type="number" min="1" max="100" />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Applied as a percentage off the original price across all selected items.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Editing an already-finished promotion must not be blocked by the "future dates only" rule. */}
              <RHFDate name="startDate" label="Start Date" placeholder="Select start date" minDate={isEdit ? new Date(0) : new Date()} />

              <RHFDate name="endDate" label="End Date" placeholder="Select end date" minDate={isEdit ? new Date(0) : new Date()} />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Active time</p>

              <RHFSelectField
                name="activeDaysMode"
                label="Active Days"
                placeholder="Select active days"
                className="w-full"
                options={PROMOTION_ACTIVE_DAYS_OPTIONS}
              />

              {activeDaysMode === 'specific' && <RHFChipToggleGroup name="activeWeekdays" label="Days" options={WEEKDAY_OPTIONS} />}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RHFTimeField name="startTime" label="Start Time (optional)" />
                <RHFTimeField name="endTime" label="End Time (optional)" />
              </div>
            </div>

            <RHFToggleField
              name="isActive"
              title="Status"
              badge={<CustomBadge variant={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</CustomBadge>}
              description="When inactive, this promotion is paused — it won't run and can't award points. Historical data is preserved."
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Button type="button" variant="outline" className="cursor-pointer px-6" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>

            {isSubmitting ? (
              <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
              </Button>
            ) : (
              <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white">
                {isEdit ? 'Update Promotion' : 'Create Promotion'}
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionFormModal;
