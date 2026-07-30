'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { CONDITION_TYPE_OPTIONS, SELECT_ITEM_CLASS, SELECT_TRIGGER_CLASS, TAX_PERCENTAGE_OPTIONS, suggestMaxCapacity } from '../constants';
import { FieldGroup } from '../field-group';
import { SettingRow } from '../setting-row';
import { ToggleSwitch } from '../toggle-switch';
import { ConditionType, ReservationType, ReservationTypePayload, ReservationTypeStatus, TaxPercentage } from '../types';

const uid = () => `note_${Math.random().toString(36).slice(2, 10)}`;

/** Empty numeric inputs arrive as `''`; treat that as "not filled in". */
const numberField = (label: string, min: number) =>
  Yup.number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError(`${label} must be a number`)
    .integer(`${label} must be a whole number`)
    .min(min, `${label} must be at least ${min}`)
    .required(`${label} is required`);

const schema: Yup.ObjectSchema<ReservationTypePayload> = Yup.object().shape({
  name: Yup.string().trim().required('Reservation type name is required').max(60, 'Name must be 60 characters or fewer').default(''),
  description: Yup.string().trim().max(120, 'Description must be 120 characters or fewer').default(''),
  quantity: numberField('Available quantity', 1),
  maxPartySize: numberField('Max party size', 1),
  maxCapacity: numberField('Max capacity', 1),
  conditionType: Yup.mixed<ConditionType>()
    .oneOf(
      CONDITION_TYPE_OPTIONS.map((option) => option.value),
      'Select a condition type'
    )
    .required('Condition type is required'),
  bonusPoints: numberField('Bonus points', 0),
  taxPercentage: Yup.mixed<TaxPercentage>()
    .oneOf(
      TAX_PERCENTAGE_OPTIONS.map((option) => option.value),
      'Select a tax percentage'
    )
    .required('Tax percentage is required'),
  requiresConfirmation: Yup.boolean().required(),
  asksForOccasion: Yup.boolean().required(),
  status: Yup.mixed<ReservationTypeStatus>().oneOf(['active', 'inactive']).required(),
  visibleToGuests: Yup.boolean().required(),
  importantInformation: Yup.array()
    .of(Yup.object({ id: Yup.string().defined(), text: Yup.string().defined() }))
    .defined()
    .default([]),
});

// Numeric fields start blank so their placeholders show; yup turns `''` back
// into a required-field error, the same trick delivery-option-modal uses.
const EMPTY_NUMBER = '' as unknown as number;

const EMPTY_VALUES: ReservationTypePayload = {
  name: '',
  description: '',
  quantity: EMPTY_NUMBER,
  maxPartySize: EMPTY_NUMBER,
  maxCapacity: EMPTY_NUMBER,
  conditionType: 'free',
  bonusPoints: 0,
  taxPercentage: 25,
  requiresConfirmation: false,
  asksForOccasion: true,
  status: 'active',
  visibleToGuests: true,
  importantInformation: [],
};

interface ReservationTypeModalProps {
  open: boolean;
  /** Present when editing, absent when creating. */
  reservationType?: ReservationType | null;
  /** Existing names, used to block duplicates. Includes the edited type's own name. */
  existingNames: string[];
  isSubmitting: boolean;
  onSubmit: (payload: ReservationTypePayload) => Promise<void>;
  onClose: () => void;
}

export const ReservationTypeModal: React.FC<ReservationTypeModalProps> = ({
  open,
  reservationType,
  existingNames,
  isSubmitting,
  onSubmit,
  onClose,
}) => {
  const isEdit = Boolean(reservationType);

  const methods = useForm<ReservationTypePayload>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY_VALUES,
    mode: 'onChange',
  });

  const { reset, control, watch, setValue, handleSubmit } = methods;

  /** Once max capacity is edited by hand, stop deriving it from quantity × party size. */
  const capacityOverriddenRef = useRef(false);

  const quantity = watch('quantity');
  const maxPartySize = watch('maxPartySize');
  const notes = watch('importantInformation');

  // Seed on open so a reopened modal never shows the previous type's values.
  useEffect(() => {
    if (!open) return;

    capacityOverriddenRef.current = Boolean(reservationType);
    reset(
      reservationType
        ? {
            name: reservationType.name,
            description: reservationType.description,
            quantity: reservationType.quantity,
            maxPartySize: reservationType.maxPartySize,
            maxCapacity: reservationType.maxCapacity,
            conditionType: reservationType.conditionType,
            bonusPoints: reservationType.bonusPoints,
            taxPercentage: reservationType.taxPercentage,
            requiresConfirmation: reservationType.requiresConfirmation,
            asksForOccasion: reservationType.asksForOccasion,
            status: reservationType.status,
            visibleToGuests: reservationType.visibleToGuests,
            importantInformation: reservationType.importantInformation,
          }
        : EMPTY_VALUES
    );
  }, [open, reservationType, reset]);

  // Suggested capacity — quantity × party size, until the field is touched.
  useEffect(() => {
    if (!open || capacityOverriddenRef.current) return;

    const suggested = suggestMaxCapacity(Number(quantity), Number(maxPartySize));
    setValue('maxCapacity', suggested > 0 ? suggested : EMPTY_NUMBER, { shouldValidate: suggested > 0 });
  }, [open, quantity, maxPartySize, setValue]);

  const updateNote = (id: string, text: string) => {
    setValue(
      'importantInformation',
      notes.map((note) => (note.id === id ? { ...note, text } : note)),
      { shouldDirty: true }
    );
  };

  const submit = handleSubmit(async (values) => {
    const name = values.name.trim();
    const clashes = existingNames.some((existing) => existing.toLowerCase() === name.toLowerCase() && existing !== reservationType?.name);

    if (clashes) {
      showError(`A reservation type named "${name}" already exists`);
      return;
    }

    try {
      await onSubmit({
        ...values,
        name,
        // Blank notes are dropped rather than rejected — an empty row is just
        // a note the user started and abandoned.
        importantInformation: values.importantInformation.filter((note) => note.text.trim()).map((note) => ({ ...note, text: note.text.trim() })),
      });
      showSuccess(isEdit ? 'Reservation type updated' : 'Reservation type created');
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent aria-describedby={undefined} className="flex max-h-[90vh] w-full sm:max-w-2xl flex-col gap-0 p-0 dark:bg-[#222121]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold">{isEdit ? 'Edit reservation type' : 'Create reservation type'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex max-h-[calc(90vh-9rem)] flex-col gap-4 overflow-y-auto px-6 py-5">
            <RHFTextField name="name" label="Reservation type name *" placeholder="e.g. VIP booth" />

            <RHFTextField name="description" label="Description" placeholder="Description of this reservation type (optional)" />

            <FieldGroup legend="Capacity">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <RHFTextField name="quantity" type="number" min={1} label="Available quantity" placeholder="e.g. 6" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Number of tables of this type.</p>
                </div>

                <div>
                  <RHFTextField name="maxPartySize" type="number" min={1} label="Max party size" placeholder="e.g. 8" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Max persons in a single reservation.</p>
                </div>
              </div>

              <div>
                <RHFTextField
                  name="maxCapacity"
                  type="number"
                  min={1}
                  label="Max capacity (total seats)"
                  placeholder="e.g. 48"
                  onInput={() => {
                    capacityOverriddenRef.current = true;
                  }}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Suggested from Quantity × Max party size. Edit it directly to override.
                </p>
              </div>
            </FieldGroup>

            <FormField
              control={control}
              name="conditionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition type</FormLabel>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                        <SelectValue placeholder="Select condition type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONDITION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <RHFTextField name="bonusPoints" type="number" min={0} label="Bonus points" placeholder="0" />

            <FieldGroup legend="Additional settings">
              <FormField
                control={control}
                name="taxPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax percentage</FormLabel>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Applied to reservations of this type.</p>
                    <Select value={String(field.value ?? '')} onValueChange={(next) => field.onChange(Number(next) as TaxPercentage)}>
                      <FormControl>
                        <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                          <SelectValue placeholder="Select tax percentage..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TAX_PERCENTAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)} className={SELECT_ITEM_CLASS}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SettingRow
                className="py-0"
                title="Requires confirmation from organizer?"
                description="If on, each request must be manually approved."
                control={
                  <ToggleSwitch
                    size="sm"
                    ariaLabel="Requires confirmation from organizer"
                    checked={watch('requiresConfirmation')}
                    onChange={(next) => setValue('requiresConfirmation', next, { shouldDirty: true })}
                  />
                }
              />

              <SettingRow
                className="py-0"
                title="Ask for occasion in reservation form?"
                description="If on, guest can pick an occasion when booking this type."
                control={
                  <ToggleSwitch
                    size="sm"
                    ariaLabel="Ask for occasion in reservation form"
                    checked={watch('asksForOccasion')}
                    onChange={(next) => setValue('asksForOccasion', next, { shouldDirty: true })}
                  />
                }
              />

              <SettingRow
                className="py-0"
                title="Status: Active"
                description="Inactive types are not shown to guests."
                control={
                  <ToggleSwitch
                    size="sm"
                    ariaLabel="Status active"
                    checked={watch('status') === 'active'}
                    onChange={(next) => setValue('status', next ? 'active' : 'inactive', { shouldDirty: true })}
                  />
                }
              />
            </FieldGroup>

            <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
              <SettingRow
                className="py-0"
                title="Visible to guests?"
                description="Can the guest see and select this type, or is it managed manually by the organizer?"
                control={
                  <ToggleSwitch
                    size="sm"
                    ariaLabel="Visible to guests"
                    checked={watch('visibleToGuests')}
                    onChange={(next) => setValue('visibleToGuests', next, { shouldDirty: true })}
                  />
                }
              />
            </div>

            <FieldGroup legend="Important information">
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Custom notes shown to the guest in the Reservation detail (Wallet). Add anything type-specific: arrival buffer, dress code, parking,
                etc. Voucher mechanics and cancellation are added automatically.
              </p>

              {notes.map((note) => (
                <div key={note.id} className="flex items-center gap-2">
                  <Input
                    value={note.text}
                    aria-label="Important information note"
                    placeholder="e.g. Please arrive 15 minutes early."
                    onChange={(event) => updateNote(note.id, event.target.value)}
                    className="h-10 flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Remove note"
                    onClick={() =>
                      setValue(
                        'importantInformation',
                        notes.filter((candidate) => candidate.id !== note.id),
                        { shouldDirty: true }
                      )
                    }
                    className="h-10 w-10 shrink-0 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setValue('importantInformation', [...notes, { id: uid(), text: '' }], { shouldDirty: true })}
                className="w-fit cursor-pointer gap-1 font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                Add note
              </Button>
            </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer font-semibold">
              Cancel
            </Button>
            {isSubmitting ? (
              <Button type="button" disabled className="cursor-not-allowed font-semibold">
                <ButtonLoading title="Saving" />
              </Button>
            ) : (
              <Button type="submit" className="cursor-pointer font-semibold">
                Save type
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
