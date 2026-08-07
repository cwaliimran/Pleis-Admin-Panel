'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useAddComboMutation, useUpdateComboMutation } from '@/store/Reducer/combos-api';
import { useGetMenuItemsQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuSubcategoriesQuery } from '@/store/Reducer/menu-subcategories-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { AvailabilityCards, ComponentsCard, InfoCallout, SectionHeading } from './combos-modal-fields';
import {
  clampQuantity,
  deriveAvailability,
  getComboFinalPrice,
  getComboLines,
  getPriceComparison,
  getRefId,
  getRefLabel,
  MAX_QUANTITY,
  MIN_QUANTITY,
  PRICE_INPUT_CONFIG,
  PRICE_MODE_OPTIONS,
} from './combos-utils';
import { ComboComponent, ComboComponentLine, ComboFormMenuItem, ComboFormValues, ComboModalProps, PriceMode } from './types';

const MENU_ITEM_FETCH_LIMIT = 1000;

const defaultValues: ComboFormValues = {
  name: '',
  subCategory: '',
  description: '',
  menuItems: [],
  priceMode: 'fixed_combo_price',
  price: '',
  status: 'active',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Combo name is required'),
  subCategory: Yup.string().required('Subcategory is required'),
  description: Yup.string().optional(),

  menuItems: Yup.array()
    .of(
      Yup.object({
        menuItem: Yup.string().required(),
        quantity: Yup.number().integer().min(MIN_QUANTITY).max(MAX_QUANTITY).required(),
      }).required()
    )
    .min(2, 'A combo needs at least 2 menu items')
    .required(),
  priceMode: Yup.mixed<'fixed_combo_price' | 'percentage_off_sum' | 'fixed_amount_off_sum'>()
    .oneOf(['fixed_combo_price', 'percentage_off_sum', 'fixed_amount_off_sum'])
    .required(),
  price: Yup.string()
    .required('Price is required')
    .test('is-decimal', 'Must be a valid number greater than 0', (v) => !!v && Number(v) > 0)

    .test('within-mode-range', 'Invalid for the selected price mode', function (value) {
      const price = Number(value);
      if (!value || isNaN(price) || price <= 0) return true;

      const mode = this.parent.priceMode as PriceMode;
      const sumOfParts = (this.options.context as { sumOfParts?: number } | undefined)?.sumOfParts ?? 0;

      if (mode === 'percentage_off_sum' && price > 100) {
        return this.createError({ message: 'Cannot charge more than 100% of the sum' });
      }
      if (mode === 'fixed_amount_off_sum' && sumOfParts > 0 && price >= sumOfParts) {
        return this.createError({ message: `Must be less than the sum of parts (€${sumOfParts.toFixed(2)})` });
      }
      return true;
    }),

  status: Yup.mixed<'active' | 'inactive' | 'draft'>().oneOf(['active', 'inactive', 'draft']).required(),
});

const ComboModal = ({ open, onClose, isEdit = false, selectedData, companyId, userType }: ComboModalProps) => {
  const [addCombo, { isLoading: addLoading }] = useAddComboMutation();
  const [updateCombo, { isLoading: updateLoading }] = useUpdateComboMutation();
  const submitting = addLoading || updateLoading;

  const validationContext = useRef({ sumOfParts: 0 }).current;

  const methods = useForm<ComboFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<ComboFormValues>),
    defaultValues,
    context: validationContext,
  });

  const { reset, control, setValue, formState } = methods;
  const isDirty = formState?.isDirty;

  const watchedMenuItems = useWatch({ control, name: 'menuItems' });

  const selectedLines: ComboFormMenuItem[] = useMemo(() => watchedMenuItems || [], [watchedMenuItems]);
  const selectedIds = useMemo(() => selectedLines.map((line) => line.menuItem), [selectedLines]);
  const priceValue = useWatch({ control, name: 'price' });
  const priceModeValue = useWatch({ control, name: 'priceMode' });

  const companySkip = userType === 'super-admin' && !companyId;
  const { data: menuItemsData, isFetching: menuItemsLoading } = useGetMenuItemsQuery(
    { page: 0, limit: MENU_ITEM_FETCH_LIMIT, search: '', companyOrganizer: userType === 'super-admin' ? companyId || undefined : undefined },
    { skip: companySkip }
  );

  const menuItems: ComboComponent[] = useMemo(() => menuItemsData?.data || [], [menuItemsData]);
  const menuItemsById = useMemo(() => new Map(menuItems.map((item) => [item._id, item])), [menuItems]);

  const componentLines: ComboComponentLine[] = useMemo(() => {
    const fallbacks = new Map(
      getComboLines(selectedData?.menuItems)
        .filter((line) => line.ref && typeof line.ref !== 'string')
        .map((line) => [line.id, line.ref as unknown as ComboComponent])
    );
    return selectedLines
      .map((line) => {
        const component = menuItemsById.get(line.menuItem) || fallbacks.get(line.menuItem);
        return component ? { component, quantity: line.quantity } : null;
      })
      .filter((line): line is ComboComponentLine => !!line);
  }, [selectedLines, menuItemsById, selectedData]);

  const components: ComboComponent[] = useMemo(() => componentLines.map((line) => line.component), [componentLines]);

  const addableItems = useMemo(() => menuItems.filter((item) => !selectedIds.includes(item._id)), [menuItems, selectedIds]);

  const sumOfParts = useMemo(() => componentLines.reduce((sum, line) => sum + (line.component.basePrice || 0) * line.quantity, 0), [componentLines]);
  validationContext.sumOfParts = sumOfParts;

  const availability = useMemo(() => deriveAvailability(components), [components]);

  useEffect(() => {
    if (priceValue) methods.trigger('price');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceModeValue, sumOfParts]);

  const priceInput = PRICE_INPUT_CONFIG[priceModeValue as PriceMode] || PRICE_INPUT_CONFIG.fixed_combo_price;
  const finalPrice = getComboFinalPrice(priceModeValue as PriceMode, sumOfParts, Number(priceValue));
  const comparison = getPriceComparison(sumOfParts, finalPrice);

  useEffect(() => {
    if (!open) return;

    if (isEdit && selectedData) {
      reset({
        name: selectedData.name,
        subCategory: getRefId(selectedData.subCategory),
        description: selectedData.description || '',
        menuItems: getComboLines(selectedData.menuItems).map((line) => ({ menuItem: line.id, quantity: line.quantity })),
        priceMode: selectedData.priceMode,
        price: String(selectedData.price),

        status: selectedData.status === 'draft' ? 'active' : selectedData.status,
      });
    } else {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const commitLines = (lines: ComboFormMenuItem[]) => setValue('menuItems', lines, { shouldDirty: true, shouldValidate: true });

  const changeQuantity = (id: string, quantity: number) =>
    commitLines(selectedLines.map((line) => (line.menuItem === id ? { ...line, quantity: clampQuantity(quantity) } : line)));

  const addComponent = (id: string) => {
    const existing = selectedLines.find((line) => line.menuItem === id);
    if (existing) {
      changeQuantity(id, existing.quantity + 1);
      return;
    }
    commitLines([...selectedLines, { menuItem: id, quantity: MIN_QUANTITY }]);
  };

  const removeComponent = (id: string) => commitLines(selectedLines.filter((line) => line.menuItem !== id));

  const handleSubmit = async (formData: ComboFormValues) => {
    const payload: any = {
      name: formData.name,
      subCategory: formData.subCategory,
      description: formData.description || '',
      menuItems: formData.menuItems.map((line) => ({ menuItem: line.menuItem, quantity: clampQuantity(line.quantity) })),
      priceMode: formData.priceMode,
      price: Number(formData.price),

      status: availability.isUnorderable ? 'draft' : formData.status,
    };
    if (userType === 'super-admin' && companyId) payload.companyOrganizer = companyId;

    try {
      if (isEdit && selectedData?._id) {
        await updateCombo({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Combo updated successfully');
      } else {
        await addCombo(payload).unwrap();
        showSuccess('Combo created successfully');
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
            <DialogTitle>{isEdit ? 'Edit Combo' : 'Create Combo'}</DialogTitle>
          </DialogHeader>

          <div className="mt-2 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <SectionHeading title="Combo details" />

                  <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                    <RHFTextField name="name" label="Name" placeholder="e.g. Sunset Combo" />

                    <RHFAsyncCombobox
                      name="subCategory"
                      label="Subcategory"
                      placeholder="Select subcategory..."
                      searchPlaceholder="Search subcategories..."
                      selectedLabel={selectedData?.subCategory ? getRefLabel(selectedData.subCategory) : undefined}
                      useOptionsQuery={useGetMenuSubcategoriesQuery}
                      getOptionValue={(subCategory) => subCategory._id}
                      getOptionLabel={(subCategory) => subCategory.name}
                    />
                  </div>

                  <RHFTextField name="description" label="Description (Optional)" placeholder="Shown to guests if filled in" multiline rows={2} />
                </div>

                <div className="flex flex-col gap-4">
                  <SectionHeading title="Components" affix="minimum 2 items" affixClassName="text-red-500" />

                  <FormField
                    control={control}
                    name="menuItems"
                    render={() => (
                      <FormItem className="space-y-0">
                        <ComponentsCard
                          lines={componentLines}
                          options={addableItems}
                          loading={menuItemsLoading}
                          sumOfParts={sumOfParts}
                          onAdd={addComponent}
                          onRemove={removeComponent}
                          onQuantityChange={changeQuantity}
                        />
                        <FormMessage className="mt-2" />
                      </FormItem>
                    )}
                  />

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Components stay available as standalone items. On the bill the combo expands to these lines so each keeps its own preset type and
                    tax.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <SectionHeading title="Availability" affix="derived from components, read-only" />

                  <AvailabilityCards components={components} availability={availability} />
                </div>

                <div className="flex flex-col gap-4">
                  <SectionHeading title="Combo price" />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <RHFSelectField name="priceMode" label="Price mode" placeholder="Select price mode" options={PRICE_MODE_OPTIONS} />

                    <RHFTextField name="price" label={priceInput.label} type="number" placeholder={priceInput.placeholder} step="0.01" min="0.01" />

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Guest pays</span>
                      <div className="bg-muted/50 flex min-h-9 flex-wrap items-center justify-between gap-x-2 gap-y-0.5 rounded-md border px-3 py-1.5">
                        {finalPrice != null ? (
                          <>
                            <span className="text-sm font-semibold tabular-nums">€{finalPrice.toFixed(2)}</span>
                            {comparison ? (
                              <span
                                className={cn(
                                  'text-[11px] leading-tight tabular-nums',
                                  comparison.isSaving ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                )}
                              >
                                {comparison.isSaving ? '−' : '+'}
                                {comparison.percent}% · {comparison.isSaving ? 'saves' : 'adds'} €{comparison.amount.toFixed(2)}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    The combo price is distributed across the component lines for fiscalization — each item carries its share of the total.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <SectionHeading title="Where it appears" />

                  <InfoCallout>
                    A combo is shown in a menu only when that menu contains <span className="font-semibold">all</span> its components. This is derived
                    automatically — you don&apos;t assign the combo to menus.
                  </InfoCallout>
                </div>

                {(availability.isUnorderable || isEdit) && (
                  <div className="flex flex-col gap-4">
                    <SectionHeading title="Status" />

                    {availability.isUnorderable ? (
                      <div className="bg-muted/30 flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
                        <div>
                          <p className="text-sm font-medium">Draft</p>
                          <p className="text-muted-foreground mt-0.5 text-xs">Set automatically because the components have no orderable overlap.</p>
                        </div>
                        <CustomBadge variant="warning">Draft</CustomBadge>
                      </div>
                    ) : (
                      <RHFSelectField
                        name="status"
                        placeholder="Select Status"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                      />
                    )}
                  </div>
                )}
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
                    {isEdit ? 'Update Combo' : 'Create Combo'}
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

export default ComboModal;
