'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFAsyncCombobox, RHFChipToggleGroup, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetAllergensQuery } from '@/store/Reducer/allergens-api';
import { useGetBrandsQuery } from '@/store/Reducer/brands-api';
import { useGetDaypartsQuery } from '@/store/Reducer/daypart-api';
import { useGetDietTagsQuery } from '@/store/Reducer/diet-tags-api';
import { useGetItemsCategoryQuery } from '@/store/Reducer/items-category-api';
import { useAddMenuItemMutation, useUpdateMenuItemMutation } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetPresetTypesQuery } from '@/store/Reducer/preset-type-api';
import { useGetServingsQuery } from '@/store/Reducer/serving-api';
import { getErrorMessage } from '@/utils/api';
import { convertTimeFormat } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { DAY_OPTIONS, TAX_OPTIONS } from './constants';
import { SummaryMultiSelect, ToggleRow } from './menuItems-modal-fields';
import { formatServingLabel, getRefId, getRefLabel, toImageKey, toRefArray } from './menuItems-utils';
import { MenuItemFormValues, MenuItemModalProps } from './types';

const PLACEHOLDER_IMAGE_URLS: string[] = [noImageUrl, noImageUrlDev, noImageUrlDevCap];

const isValidTime = (time?: string) => !time || /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const defaultValues: MenuItemFormValues = {
  image: null,
  title: '',
  description: '',
  type: '',
  category: '',
  basePrice: '',
  taxPercent: '25',
  menus: [],
  startTime: '',
  endTime: '',
  status: 'active',
  presetType: '',
  brand: '',
  amountQuantity: '',
  servingSize: '',
  availableDays: [],
  dayparts: [],
  dietTags: [],
  allergens: [],
  cuisine: '',
  isRecommended: false,
  upSellItem: false,
  isTogo: false,
  isRequiresOrderConfirmation: false,
};

const schema = Yup.object().shape({
  image: Yup.mixed().nullable(),
  title: Yup.string().required('Name is required'),
  description: Yup.string().optional(),
  type: Yup.string().optional(),
  category: Yup.string().required('Category is required'),
  basePrice: Yup.string()
    .required('Price is required')
    .test('is-decimal', 'Price must be a valid number greater than 0', (value) => !!value && !isNaN(Number(value)) && Number(value) > 0),
  taxPercent: Yup.string().required('Tax is required'),
  menus: Yup.array().of(Yup.string().required()).min(1, 'Select at least one menu').required(),
  startTime: Yup.string().optional().test('valid-time', 'Invalid time format', isValidTime),
  endTime: Yup.string()
    .optional()
    .test('valid-time', 'Invalid time format', isValidTime)
    .test('after-start', 'End time must be after start time', function (value) {
      const { startTime } = this.parent;
      if (!value || !startTime) return true;
      return value > startTime;
    }),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
  presetType: Yup.string().optional(),
  brand: Yup.string().optional(),
  amountQuantity: Yup.string().optional(),
  servingSize: Yup.string().optional(),
  availableDays: Yup.array().of(Yup.string().required()).optional(),
  dayparts: Yup.array().of(Yup.string().required()).optional(),
  dietTags: Yup.array().of(Yup.string().required()).optional(),
  allergens: Yup.array().of(Yup.string().required()).optional(),
  cuisine: Yup.string().optional(),
  isRecommended: Yup.boolean().required(),
  upSellItem: Yup.boolean().required(),
  isTogo: Yup.boolean().required(),
  isRequiresOrderConfirmation: Yup.boolean().required(),
});

const MenuItemModalV2 = ({ open, onClose, isEdit = false, selectedData, companyId, userType, lookups }: MenuItemModalProps) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [addMenuItem, { isLoading: addLoading }] = useAddMenuItemMutation();
  const [updateMenuItem, { isLoading: updateLoading }] = useUpdateMenuItemMutation();
  const submitting = addLoading || updateLoading || imageUploading;

  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
    defaultValues,
  });

  const { reset, control, setValue, formState } = methods;
  const isDirty = formState?.isDirty;

  /** Category label carried over from a picked preset, so the combobox shows a name, not a raw id. */
  const [presetCategoryLabel, setPresetCategoryLabel] = useState<string | undefined>();

  const { data: dietTagsData, isFetching: dietTagsLoading } = useGetDietTagsQuery({ page: 0, limit: 100, search: '', summary: true });
  const { data: allergensData, isFetching: allergensLoading } = useGetAllergensQuery({ page: 0, limit: 100, search: '', summary: true });
  const { data: daypartsData, isFetching: daypartsLoading } = useGetDaypartsQuery({ page: 0, limit: 100, search: '', summary: true });

  useEffect(() => {
    if (!open) return;
    setPresetCategoryLabel(undefined);

    if (isEdit && selectedData) {
      const imageValue = selectedData.image && !PLACEHOLDER_IMAGE_URLS.includes(selectedData.image) ? selectedData.image : null;
      reset({
        image: imageValue,
        title: selectedData.title,
        description: selectedData.description || '',
        type: selectedData.type || '',
        category: getRefId(selectedData.category),
        basePrice: String(selectedData.basePrice),
        taxPercent: String(selectedData.taxPercent),
        menus: selectedData.menu ? [getRefId(selectedData.menu)] : [],
        startTime: selectedData.startTime ? convertTimeFormat(selectedData.startTime, true) : '',
        endTime: selectedData.endTime ? convertTimeFormat(selectedData.endTime, true) : '',
        status: selectedData.status,
        presetType: getRefId(selectedData.presetType),
        brand: getRefId(selectedData.brand),
        amountQuantity: selectedData.amountQuantity || '',
        servingSize: getRefId(selectedData.servingSize),
        availableDays: selectedData.availableDays || [],
        dayparts: toRefArray(selectedData.daypart).map(getRefId).filter(Boolean),
        dietTags: toRefArray(selectedData.dietTags).map(getRefId).filter(Boolean),
        allergens: toRefArray(selectedData.allergens).map(getRefId).filter(Boolean),
        cuisine: selectedData.cuisine || '',
        isRecommended: !!selectedData.isRecommended,
        // Sent as a string, so it can come back as one too — `!!'false'` would be true.
        upSellItem: selectedData.upSellItem === true || selectedData.upSellItem === 'true',
        isTogo: !!selectedData.isTogo,
        isRequiresOrderConfirmation: !!selectedData.isRequiresOrderConfirmation,
      });
    } else if (!isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  /** Copies a picked preset's image, name, description and category into the form — all still editable after. */
  const applyPreset = (preset?: { image?: string; name?: string; description?: string; category?: any }) => {
    if (!preset) return;

    const setIfPresent = (field: 'title' | 'image' | 'description' | 'category', value?: string) => {
      if (value) setValue(field, value, { shouldDirty: true, shouldValidate: true });
    };

    setIfPresent('title', preset.name);
    setIfPresent('description', preset.description);
    setIfPresent('image', preset.image && !PLACEHOLDER_IMAGE_URLS.includes(preset.image) ? preset.image : undefined);
    setIfPresent('category', getRefId(preset.category));

    // The prefilled id usually isn't on the category dropdown's first fetched page, so carry its label.
    setPresetCategoryLabel(preset.category ? getRefLabel(preset.category) : undefined);
  };

  const handleSubmit = async (formData: MenuItemFormValues) => {
    try {
      // A newly picked file is uploaded first and already yields a bare key; a plain string is an
      // already-hosted image (kept from the record, or inherited from a preset) whose absolute URL
      // has to be reduced to that same key before it goes in the payload.
      let imageKey: string | undefined;
      if (formData.image instanceof FileList && formData.image.length > 0) {
        const uploaded = await uploadImage(formData.image[0]);
        if (!uploaded) return;
        imageKey = uploaded;
      } else if (typeof formData.image === 'string' && formData.image) {
        imageKey = toImageKey(formData.image);
      }

      if (isEdit && selectedData?._id) {
        // Only send fields the user actually changed, not the whole record.
        const dirty = formState.dirtyFields as Partial<Record<keyof MenuItemFormValues, boolean>>;
        const payload: any = {};

        if (dirty.title) payload.title = formData.title;
        if (dirty.description) payload.description = formData.description || '';
        if (dirty.type) payload.type = formData.type || '';
        if (dirty.category) payload.category = formData.category;
        if (dirty.basePrice) payload.basePrice = Number(formData.basePrice);
        if (dirty.taxPercent) payload.taxPercent = Number(formData.taxPercent);
        if (dirty.menus) payload.menuIds = formData.menus;
        if (dirty.startTime) payload.startTime = formData.startTime ? convertTimeFormat(formData.startTime, false) : null;
        if (dirty.endTime) payload.endTime = formData.endTime ? convertTimeFormat(formData.endTime, false) : null;
        if (dirty.status) payload.status = formData.status;
        if (dirty.presetType) payload.presetType = formData.presetType || null;
        if (dirty.brand) payload.brand = formData.brand || null;
        if (dirty.amountQuantity) payload.amountQuantity = formData.amountQuantity || '';
        if (dirty.servingSize) payload.servingSize = formData.servingSize || null;
        if (dirty.availableDays) payload.availableDays = formData.availableDays;
        if (dirty.dayparts) payload.daypart = formData.dayparts;
        if (dirty.dietTags) payload.dietTags = formData.dietTags;
        if (dirty.allergens) payload.allergens = formData.allergens;
        if (dirty.cuisine) payload.cuisine = formData.cuisine || '';
        if (dirty.isRecommended) payload.isRecommended = formData.isRecommended;
        if (dirty.upSellItem) payload.upSellItem = String(formData.upSellItem);
        if (dirty.isTogo) payload.isTogo = formData.isTogo;
        if (dirty.isRequiresOrderConfirmation) payload.isRequiresOrderConfirmation = formData.isRequiresOrderConfirmation;
        if (dirty.image && imageKey) payload.image = imageKey;

        await updateMenuItem({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Menu item updated successfully');
      } else {
        const payload: any = {
          title: formData.title,
          description: formData.description || '',
          type: formData.type || '',
          category: formData.category,
          basePrice: Number(formData.basePrice),
          taxPercent: Number(formData.taxPercent),
          menuIds: formData.menus,
          startTime: formData.startTime ? convertTimeFormat(formData.startTime, false) : null,
          endTime: formData.endTime ? convertTimeFormat(formData.endTime, false) : null,
          status: formData.status,
          presetType: formData.presetType || null,
          brand: formData.brand || null,
          amountQuantity: formData.amountQuantity || '',
          quantityType: 'single',
          servingSize: formData.servingSize || null,
          availableDays: formData.availableDays,
          daypart: formData.dayparts,
          dietTags: formData.dietTags,
          allergens: formData.allergens,
          cuisine: formData.cuisine || '',
          isRecommended: formData.isRecommended,
          upSellItem: String(formData.upSellItem),
          isTogo: formData.isTogo,
          isRequiresOrderConfirmation: formData.isRequiresOrderConfirmation,
        };
        if (imageKey) payload.image = imageKey;
        if (companyId) payload.companyOrganizer = companyId;

        await addMenuItem(payload).unwrap();
        showSuccess('Menu item created successfully');
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-200!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Menu Item' : 'Create Menu Item'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-5">
                <RHFUploadAvatar
                  name="image"
                  label="Image"
                  initialImage={
                    typeof selectedData?.image === 'string' && !PLACEHOLDER_IMAGE_URLS.includes(selectedData.image) ? selectedData.image : null
                  }
                />

                {/* BASIC INFORMATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Basic Information</h4>

                  <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                    <RHFAsyncCombobox
                      name="presetType"
                      label="Preset Type"
                      placeholder="Select preset type..."
                      searchPlaceholder="Search preset types..."
                      useOptionsQuery={useGetPresetTypesQuery}
                      getOptionValue={(presetType) => presetType._id}
                      getOptionLabel={(presetType) => presetType.name}
                      onValueChange={(_, preset) => applyPreset(preset)}
                    />

                    <RHFAsyncCombobox
                      name="brand"
                      label="Brand"
                      placeholder="Select brand..."
                      searchPlaceholder="Search brands..."
                      useOptionsQuery={useGetBrandsQuery}
                      queryArgs={{ summary: true }}
                      getOptionValue={(brand) => brand._id}
                      getOptionLabel={(brand) => brand.name}
                    />

                    <RHFTextField name="title" label="Name" placeholder="Item name as shown to guests" />

                    <RHFTextField name="amountQuantity" label="Amount (Optional)" placeholder="e.g. 200ml, 250g" />

                    <RHFAsyncCombobox
                      name="category"
                      label="Category"
                      placeholder="Select category..."
                      searchPlaceholder="Search categories..."
                      selectedLabel={
                        presetCategoryLabel ?? (selectedData?.category ? getRefLabel(selectedData.category, lookups?.categories) : undefined)
                      }
                      useOptionsQuery={useGetItemsCategoryQuery}
                      getOptionValue={(category) => category._id}
                      getOptionLabel={(category) => category.title}
                      onValueChange={() => setPresetCategoryLabel(undefined)}
                    />

                    <RHFTextField name="type" label="Type (Optional)" placeholder="e.g. Pizza, Drink, Tea" />

                    <RHFAsyncCombobox
                      name="menus"
                      label="Menus"
                      placeholder="Select menus..."
                      searchPlaceholder="Search menus..."
                      multiple
                      disabled={isEdit}
                      initialSelected={
                        selectedData?.menu
                          ? [{ value: getRefId(selectedData.menu), label: getRefLabel(selectedData.menu, lookups?.menus) }]
                          : undefined
                      }
                      useOptionsQuery={useGetMenuListQuery}
                      queryArgs={{ companyOrganizer: userType === 'super-admin' ? companyId || undefined : undefined }}
                      skip={userType === 'super-admin' && !companyId}
                      getOptionValue={(menu) => menu._id}
                      getOptionLabel={(menu) => menu.title}
                    />
                  </div>

                  <RHFTextField name="description" label="Description (Optional)" placeholder="Shown to guests if filled in" multiline rows={2} />
                </div>

                {/* CLASSIFICATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">
                    Classification 
                  </h4>

                  <RHFAsyncCombobox
                    name="servingSize"
                    label="Serving Size"
                    placeholder="Select serving size..."
                    searchPlaceholder="Search servings..."
                    selectedLabel={selectedData?.servingSize ? getRefLabel(selectedData.servingSize, lookups?.servingSizes) : undefined}
                    useOptionsQuery={useGetServingsQuery}
                    queryArgs={{ summary: true }}
                    getOptionValue={(serving) => serving._id}
                    getOptionLabel={(serving) => formatServingLabel(serving)}
                  />
                </div>

                {/* PRICING */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Pricing</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField name="basePrice" label="Price (€)" type="number" placeholder="0.00" step="0.01" min="0.01" />

                    <RHFSelectField name="taxPercent" label="Tax %" placeholder="Select Tax %" options={TAX_OPTIONS} />
                  </div>
                </div>

                {/* AVAILABILITY */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">
                    Availability 
                  </h4>

                  <RHFChipToggleGroup name="availableDays" label="Available Days" options={DAY_OPTIONS} />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
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

                {/* DAYPART */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">
                    Daypart 
                  </h4>

                  <SummaryMultiSelect
                    name="dayparts"
                    label="Dayparts (Optional)"
                    placeholder="Select dayparts..."
                    options={daypartsData?.data || []}
                    loading={daypartsLoading}
                  />
                </div>

                {/* DIETARY & ALLERGENS */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Dietary &amp; Allergens</h4>

                  <SummaryMultiSelect
                    name="dietTags"
                    label="Diet Tags (Optional)"
                    placeholder="Select diet tags..."
                    options={dietTagsData?.data || []}
                    loading={dietTagsLoading}
                  />

                  <SummaryMultiSelect
                    name="allergens"
                    label="Allergens (Optional)"
                    placeholder="Select allergens..."
                    options={allergensData?.data || []}
                    loading={allergensLoading}
                  />

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
                    <ToggleRow name="upSellItem" title="Upsell Item" description="Suggested to guests as an add-on at checkout" />
                    <ToggleRow name="isTogo" title="To go" description="Item can be ordered for takeaway" />
                    <ToggleRow
                      name="isRequiresOrderConfirmation"
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
