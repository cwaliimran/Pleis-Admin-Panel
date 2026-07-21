'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFCheckboxGroup, RHFChipToggleGroup, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { ALLERGEN_OPTIONS, COMBO_SERVING_VALUE, DAYPART_OPTIONS, DAY_OPTIONS, DIET_TAG_OPTIONS, SERVING_OPTIONS, TAX_OPTIONS } from './constants';
import { ComboItemsPicker, QuantityTypeCards, ToggleRow } from './menuItems-modal-fields';
import { MenuItemFormValues, MenuItemModalProps } from './types';

const NO_BRAND = 'none';

const defaultValues: MenuItemFormValues = {
  image: '',
  title: '',
  amount: '',
  presetTypeId: '',
  brandId: NO_BRAND,
  subcategoryId: '',
  menuIds: [],
  description: '',
  quantityType: 'single',
  comboItemIds: [],
  serving: 'glass',
  price: '',
  taxPercent: '25',
  availableDays: [],
  daypart: [],
  dietTags: [],
  allergens: [],
  cuisine: '',
  isRecommended: false,
  isUpsell: false,
  isToGo: false,
  requiresConfirmation: false,
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
  amount: Yup.string().optional(),
  presetTypeId: Yup.string().required('Preset type is required'),
  brandId: Yup.string().optional(),
  subcategoryId: Yup.string().required('Subcategory is required'),
  menuIds: Yup.array().of(Yup.string().required()).min(1, 'Select at least one menu').required(),
  description: Yup.string().optional(),
  quantityType: Yup.mixed<'single' | 'combo'>().oneOf(['single', 'combo']).required(),
  comboItemIds: Yup.array()
    .of(Yup.string().required())
    .when('quantityType', {
      is: 'combo',
      then: (s) => s.min(2, 'Add at least 2 combo items'),
    }),
  serving: Yup.string().required('Serving is required'),
  price: Yup.string()
    .required('Price is required')
    .test('is-decimal', 'Price must be a valid number', (value) => !!value && !isNaN(Number(value)) && Number(value) > 0),
  taxPercent: Yup.string().required('Tax is required'),
  availableDays: Yup.array().of(Yup.string().required()).min(1, 'Select at least one available day').required(),
  daypart: Yup.array().of(Yup.string().required()).optional(),
  dietTags: Yup.array().of(Yup.string().required()).optional(),
  allergens: Yup.array().of(Yup.string().required()).optional(),
  cuisine: Yup.string().optional(),
  isRecommended: Yup.boolean().optional(),
  isUpsell: Yup.boolean().optional(),
  isToGo: Yup.boolean().optional(),
  requiresConfirmation: Yup.boolean().optional(),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const MenuItemModalV2 = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
  menus,
  subcategories,
  presetTypes,
  brands,
  allItems,
  onSubmit,
}: MenuItemModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
    defaultValues,
  });

  const { reset, control, setValue, formState } = methods;
  const isDirty = formState?.isDirty;
  const quantityType = useWatch({ control, name: 'quantityType' });

  const prepareFormData = (data: any): MenuItemFormValues => ({
    title: data?.title || '',
    amount: data?.amount || '',
    presetTypeId: data?.presetTypeId || '',
    brandId: data?.brandId || NO_BRAND,
    subcategoryId: data?.subcategoryId || '',
    menuIds: data?.menuIds || [],
    description: data?.description || '',
    quantityType: data?.quantityType || 'single',
    comboItemIds: data?.comboItemIds || [],
    serving: data?.serving || 'glass',
    price: data?.price !== undefined ? String(data.price) : '',
    taxPercent: data?.taxPercent !== undefined ? String(data.taxPercent) : '25',
    availableDays: data?.availableDays || [],
    daypart: data?.daypart || [],
    dietTags: data?.dietTags || [],
    allergens: data?.allergens || [],
    cuisine: data?.cuisine || '',
    isRecommended: data?.isRecommended || false,
    isUpsell: data?.isUpsell || false,
    isToGo: data?.isToGo || false,
    requiresConfirmation: data?.requiresConfirmation || false,
    status: data?.status || 'active',
  });

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset(prepareFormData(selectedData));
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  // Serving is fixed to "Combo" once quantity type switches — a combo is priced/served as one bundle, not per-glass/bottle/etc.
  useEffect(() => {
    if (quantityType === 'combo') {
      setValue('serving', COMBO_SERVING_VALUE);
    } else if (quantityType === 'single' && methods.getValues('serving') === COMBO_SERVING_VALUE) {
      setValue('serving', 'glass');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantityType]);

  const presetTypeOptions = presetTypes.map((preset) => ({ value: preset._id, label: `${preset.code} — ${preset.label}` }));
  const brandOptions = [{ value: NO_BRAND, label: 'No brand' }, ...brands.map((brand) => ({ value: brand._id, label: brand.label }))];
  const subcategoryOptions = subcategories.map((subcategory) => ({ value: subcategory._id, label: subcategory.title }));
  const menuOptions = menus.map((menu) => ({ value: menu._id, label: menu.title }));

  const handleSubmit = async (formData: MenuItemFormValues) => {
    setSubmitting(true);
    try {
      onSubmit({ ...formData, brandId: formData.brandId === NO_BRAND ? undefined : formData.brandId });
      methods.reset(defaultValues);
      onClose();
    } finally {
      setSubmitting(false);
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[800px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Menu Item' : 'Create Menu Item'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-5">
                <RHFUploadAvatar name="image" label="Image" initialImage={typeof selectedData?.image === 'string' ? selectedData.image : null} />

                {/* BASIC INFORMATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Basic Information</h4>

                  <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                    <RHFSelectField name="presetTypeId" label="Preset Type" placeholder="Select preset type..." options={presetTypeOptions} />

                    <RHFSelectField name="brandId" label="Brand (Optional)" placeholder="Select brand" options={brandOptions} />

                    <RHFTextField name="title" label="Name" placeholder="Item name as shown to guests" />

                    <RHFTextField name="amount" label="Amount (Optional)" placeholder="e.g. 200ml, 250g — appended to name" />

                    <div className="col-span-2">
                      <RHFSelectField name="subcategoryId" label="Subcategory" placeholder="Select subcategory..." options={subcategoryOptions} />
                    </div>
                  </div>

                  <RHFMultiSelectField
                    name="menuIds"
                    label="Menus (item can appear in multiple menus)"
                    placeholder="Select menus"
                    options={menuOptions}
                  />

                  <RHFTextField name="description" label="Description (Optional)" placeholder="Shown to guests if filled in" multiline rows={2} />
                </div>

                {/* QUANTITY TYPE */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Quantity Type</h4>
                  <QuantityTypeCards />
                  {quantityType === 'combo' && <ComboItemsPicker name="comboItemIds" allItems={allItems} excludeId={selectedData?._id} />}
                </div>

                {/* SERVING & PRICING */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Serving &amp; Pricing</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <RHFSelectField
                      name="serving"
                      label="Serving"
                      placeholder="Select serving"
                      options={SERVING_OPTIONS}
                      disabled={quantityType === 'combo'}
                    />

                    <RHFTextField name="price" label="Price (€)" type="number" placeholder="0.00" step="0.01" min="0.01" />

                    <RHFSelectField name="taxPercent" label="Tax %" placeholder="Select Tax %" options={TAX_OPTIONS} />
                  </div>

                  <RHFChipToggleGroup name="availableDays" label="Available Days" options={DAY_OPTIONS} />

                  <RHFCheckboxGroup name="daypart" label="Daypart (Optional)" helperText="· multi-select" options={DAYPART_OPTIONS} />
                </div>

                {/* DIETARY & ALLERGENS */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Dietary &amp; Allergens</h4>

                  <RHFCheckboxGroup name="dietTags" label="Diet Tags (Optional)" options={DIET_TAG_OPTIONS} />

                  <RHFCheckboxGroup name="allergens" label="Allergens (Optional)" options={ALLERGEN_OPTIONS} />

                  <RHFTextField name="cuisine" label="Cuisine (Optional)" placeholder="e.g. Mediterranean, Asian fusion..." />
                </div>

                {/* VISIBILITY & BEHAVIOUR */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Visibility &amp; Behaviour</h4>

                  <div className="divide-y">
                    <ToggleRow
                      name="status"
                      title="Active"
                      description="Item appears in the menu"
                      isChecked={(value) => value === 'active'}
                      toValue={(checked) => (checked ? 'active' : 'inactive')}
                    />
                    <ToggleRow name="isRecommended" title="⭐ Recommended" description="Highlighted on the Offer / browse screen" />
                    <ToggleRow name="isUpsell" title="↑ Upsell item" description="Shown as add-on suggestion at order confirmation" />
                    <ToggleRow name="isToGo" title="To go" description="Item can be ordered for takeaway" />
                    <ToggleRow
                      name="requiresConfirmation"
                      title="Requires order confirmation"
                      description="Short stock or limited availability — staff must approve"
                    />
                  </div>
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
                    {isEdit ? 'Update Menu Item' : 'Create Menu Item'}
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

export default MenuItemModalV2;
