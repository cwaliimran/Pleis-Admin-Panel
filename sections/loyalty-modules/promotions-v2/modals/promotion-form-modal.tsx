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
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';
import { useGetMenuItemByMenuIdQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import type { ApiPromotionType, PromotionWriteBody } from '@/store/Reducer/promotions-v2-api';
import { useCreatePromotionV2Mutation, useUpdatePromotionV2Mutation } from '@/store/Reducer/promotions-v2-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import * as yup from 'yup';
import PromotionItemsField from '../components/promotion-items-field';
import {
  OPTIONS_PAGE_LIMIT,
  POINTS_MULTIPLIER_OPTIONS,
  PROMOTION_ACTIVE_DAYS_OPTIONS,
  PROMOTION_ITEMS_FIELD_LABELS,
  PROMOTION_TYPE_FORM_OPTIONS,
  PROMOTION_TYPE_HINTS,
  WEEKDAY_OPTIONS,
} from '../constants';
import { Promotion, PromotionActiveDaysMode, PromotionType, Weekday } from '../types';

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

const ITEM_BASED_TYPES: PromotionType[] = ['extraPoints', 'itemDiscount'];

const VIEW_TYPE_TO_API: Record<PromotionType, ApiPromotionType> = {
  extraPoints: 'extraPointsForItem',
  happyHour: 'happyHour',
  itemDiscount: 'productSale',
  claimPromotion: 'claimPromotion',
};

const toBlobKey = (url: string): string => (url.includes('/') ? (url.split('/').pop() ?? '') : url);

const toDateOnly = (value: Date | string): string => {
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
};

const schema = yup.object({
  image: yup.mixed().required('Image is required'),
  title: yup.string().required('Title is required'),
  description: yup.string(),
  type: yup.string().required('Promotion type is required'),
  menuId: yup.string(),
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
  startTime: yup.string().when('type', {
    is: 'happyHour',
    then: (current) => current.required('Start time is required'),
    otherwise: (current) => current,
  }),
  endTime: yup.string().when('type', {
    is: 'happyHour',
    then: (current) => current.required('End time is required'),
    otherwise: (current) => current,
  }),
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
  promotion: Promotion | null;
  onClose: () => void;
  onCreated?: () => void;
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ open, promotion, onClose, onCreated }) => {
  const isEdit = Boolean(promotion);

  const { companyId } = useCompanySelectionState();
  const { uploadImage, uploading } = useImageUpload();
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const [createPromotion, { isLoading: isCreating }] = useCreatePromotionV2Mutation();
  const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionV2Mutation();

  const isSubmitting = isCreating || isUpdating || uploading || isCleaningUp;

  const methods = useForm<PromotionFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues,
  });

  const { watch, reset, setValue, handleSubmit } = methods;

  const type = watch('type');
  const menuId = watch('menuId');
  const activeDaysMode = watch('activeDaysMode');
  const isActive = watch('isActive');

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

  const itemBased = ITEM_BASED_TYPES.includes(type);
  const timeRequired = type === 'happyHour';

  const { data: menuData, isFetching: menusFetching } = useGetMenuListQuery(
    { page: 0, search: '', limit: OPTIONS_PAGE_LIMIT, status: '', date: undefined, companyOrganizer: companyId || undefined },
    { skip: !open || !itemBased || !companyId }
  );

  const { data: menuItemsData, isFetching: menuItemsFetching } = useGetMenuItemByMenuIdQuery({ menuId }, { skip: !menuId || !itemBased });

  const menuOptions = useMemo(() => {
    const byId = new Map<string, { value: string; label: string }>();

    if (promotion?.menuId) byId.set(promotion.menuId, { value: promotion.menuId, label: promotion.menuName || 'Selected menu' });

    (menuData?.data ?? []).forEach((menu: { _id: string; title: string }) => {
      byId.set(menu._id, { value: menu._id, label: menu.title });
    });

    return Array.from(byId.values());
  }, [menuData, promotion]);

  const itemOptions = useMemo(() => {
    const byId = new Map((promotion?.qualifyingItems ?? []).map((item) => [item.id, { id: item.id, menuId, name: item.name }]));

    (menuItemsData?.data ?? []).forEach((item: { _id: string; title: string }) => {
      byId.set(item._id, { id: item._id, menuId, name: item.title });
    });

    return Array.from(byId.values());
  }, [menuItemsData, menuId, promotion]);

  const hint = PROMOTION_TYPE_HINTS[type];
  const itemsFieldLabel = PROMOTION_ITEMS_FIELD_LABELS[type];

  const resolveImageKey = async (value: unknown, uploaded: string[]): Promise<string> => {
    if (typeof value === 'string' && value) return toBlobKey(value);

    const file = value instanceof FileList ? value[0] : value instanceof File ? value : null;
    if (!file) return '';

    const key = await uploadImage(file);
    if (!key) throw new Error('Image upload failed');

    uploaded.push(key);
    return key;
  };

  const reportInvalid = (errors: FieldErrors<PromotionFormValues>) => {
    const firstMessage = Object.values(errors).find((entry) => entry?.message)?.message;
    showError(firstMessage ? String(firstMessage) : 'Please complete the highlighted fields.');
  };

  const submit = handleSubmit(async (values) => {
    if (!companyId) {
      showError('Please select a company first.');
      return;
    }

    const uploaded: string[] = [];

    try {
      const image = await resolveImageKey(values.image, uploaded);
      const isItemBased = ITEM_BASED_TYPES.includes(values.type);
      const specificDays = values.activeDaysMode === 'specific';

      const body: PromotionWriteBody = {
        companyOrganizer: companyId,
        image,
        promotionType: VIEW_TYPE_TO_API[values.type],
        title: values.title.trim(),
        description: values.description?.trim() || '',
        startDate: toDateOnly(values.startDate),
        endDate: toDateOnly(values.endDate),
        status: values.isActive ? 'active' : 'inactive',
        activeDays: specificDays ? { mode: 'selective', days: values.activeWeekdays } : { mode: 'all' },
      };

      if (values.startTime) body.startTime = values.startTime;
      if (values.endTime) body.endTime = values.endTime;

      if (isItemBased) body.menuItem = values.qualifyingItemIds;

      if (values.type === 'extraPoints') body.extraPoints = Number(values.extraPointsPerPurchase);
      if (values.type === 'happyHour') body.pointsMultiplier = String(values.pointsMultiplier);
      if (values.type === 'itemDiscount') body.discountedPercent = Number(values.discountPercent);

      const response = promotion && isEdit ? await updatePromotion({ id: promotion.id, ...body }).unwrap() : await createPromotion(body).unwrap();

      showSuccess(response?.message || (isEdit ? 'Promotion updated' : 'Promotion created'));
      reset(defaultValues);
      if (!isEdit) onCreated?.();
      onClose();
    } catch (error) {
      if (uploaded.length > 0) {
        setIsCleaningUp(true);
        try {
          await Promise.all(uploaded.map((key) => deleteFileFromAzure(key)));
        } catch {
        } finally {
          setIsCleaningUp(false);
        }
      }

      showError(getErrorMessage(error));
    }
  }, reportInvalid);

  const handleClose = () => {
    if (isSubmitting) return;
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">{isEdit ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex flex-col gap-4">
            <RHFUploadAvatar name="image" label="Promotion Image" initialImage={promotion?.image || null} />

            <RHFTextField name="title" label="Title" placeholder="Enter Title" />

            <RHFTextField name="description" label="Description (optional)" placeholder="Enter Description" multiline rows={3} />

            <div>
              <RHFSelectField
                name="type"
                label="Promotion Type"
                placeholder="Select promotion type"
                className="w-full"
                options={PROMOTION_TYPE_FORM_OPTIONS}
                disabled={isEdit}
              />
              {isEdit && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Promotion type can&apos;t be changed after creation. Create a new promotion to use a different type.
                </p>
              )}
            </div>

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

            {itemBased && (
              <>
                <RHFCustomDropdown
                  name="menuId"
                  label="Select Menu"
                  placeholder={menusFetching ? 'Loading menus...' : 'Select menu'}
                  options={menuOptions}
                  showNone={false}
                />

                <PromotionItemsField
                  name="qualifyingItemIds"
                  label={itemsFieldLabel || 'Add Items'}
                  placeholder={!menuId ? 'Select a menu first...' : menuItemsFetching ? 'Loading items...' : 'Choose item to add...'}
                  options={itemOptions}
                  disabled={!menuId || menuItemsFetching}
                />
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
              <RHFDate
                name="startDate"
                label="Start Date"
                placeholder="Select start date"
                displayFormat="dd/MM/yyyy"
                minDate={isEdit ? new Date(0) : new Date()}
              />

              <RHFDate
                name="endDate"
                label="End Date"
                placeholder="Select end date"
                displayFormat="dd/MM/yyyy"
                minDate={isEdit ? new Date(0) : new Date()}
              />
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
                <RHFTimeField name="startTime" label={timeRequired ? 'Start Time' : 'Start Time (optional)'} />
                <RHFTimeField name="endTime" label={timeRequired ? 'End Time' : 'End Time (optional)'} />
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
