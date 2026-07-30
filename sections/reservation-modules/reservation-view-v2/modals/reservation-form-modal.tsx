'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  NO_OCCASION_VALUE,
  OCCASION_OPTIONS,
  RESERVATION_STATUS_OPTIONS,
  SELECT_ITEM_CLASS,
  SELECT_TRIGGER_CLASS,
  deriveEndTime,
} from '../constants';
import { ConditionOption, Reservation, ReservationPayload, ReservationStatus, ReservationTypeOption, VenueOption } from '../types';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const schema: Yup.ObjectSchema<ReservationPayload> = Yup.object().shape({
  venueId: Yup.string().required('Organization is required').default(''),
  guestName: Yup.string().trim().required('Full name is required').max(80, 'Name must be 80 characters or fewer').default(''),
  pleisId: Yup.string().trim().default(''),
  sourceLabel: Yup.string().trim().default(''),
  phoneNumber: Yup.string().trim().default(''),
  reservationTypeId: Yup.string().required('Reservation type is required').default(''),
  seats: Yup.number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('Number of persons must be a number')
    .integer('Number of persons must be a whole number')
    .min(1, 'At least 1 person is required')
    .required('Number of persons is required'),
  quantity: Yup.number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('Quantity must be a number')
    .integer('Quantity must be a whole number')
    .min(1, 'At least 1 table is required')
    .required('Quantity is required'),
  date: Yup.string().required('Date is required').default(''),
  time: Yup.string().matches(TIME_PATTERN, 'Use 24h time, e.g. 19:30').required('Time is required').default(''),
  endTime: Yup.string().matches(TIME_PATTERN, 'Use 24h time, e.g. 21:00').required('End time is required').default(''),
  conditionId: Yup.string().required('Condition is required').default(''),
  occasion: Yup.string().default(''),
  note: Yup.string().default(''),
  status: Yup.mixed<ReservationStatus>().oneOf(['new', 'confirmed', 'cancelled']).required(),
  eventName: Yup.string().default(''),
});

const EMPTY_NUMBER = '' as unknown as number;

/** Label left, value right — one cell of the user-info grid. */
const ProfileField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="truncate text-right text-sm font-bold text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

interface ReservationFormModalProps {
  open: boolean;
  /** Present when editing, absent when creating. */
  reservation?: Reservation | null;
  venues: VenueOption[];
  reservationTypes: ReservationTypeOption[];
  conditions: ConditionOption[];
  /** Seeds date/time/type on a fresh reservation from the board's selection. */
  defaults: { date: string; time: string; reservationTypeId: string };
  isSubmitting: boolean;
  onSubmit: (payload: ReservationPayload) => Promise<void>;
  onDelete?: () => void;
  onClose: () => void;
}

export const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  open,
  reservation,
  venues,
  reservationTypes,
  conditions,
  defaults,
  isSubmitting,
  onSubmit,
  onDelete,
  onClose,
}) => {
  const isEdit = Boolean(reservation);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  /** Read-only account data — only ever present on an existing Pleis booking. */
  const guestProfile = reservation?.guestProfile;

  const methods = useForm<ReservationPayload>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { reset, control, watch, setValue, handleSubmit } = methods;

  /** Once the end time is edited by hand, stop deriving it from the start time. */
  const endTimeOverriddenRef = useRef(false);
  const time = watch('time');

  /**
   * Seeding reads these, but must not re-run when they change — `defaults` is a
   * fresh object every render, and the reference lists resolve asynchronously.
   * Re-running on either would reset the form under the user mid-edit.
   */
  const seedRef = useRef({ defaults, venues, reservationTypes, conditions });
  seedRef.current = { defaults, venues, reservationTypes, conditions };

  useEffect(() => {
    if (!open) return;

    const seed = seedRef.current;
    endTimeOverriddenRef.current = Boolean(reservation);
    setShowUserInfo(false);

    reset(
      reservation
        ? {
            venueId: reservation.venueId,
            guestName: reservation.guestName,
            pleisId: reservation.pleisId || '',
            sourceLabel: reservation.sourceLabel || '',
            phoneNumber: reservation.phoneNumber || '',
            reservationTypeId: reservation.reservationTypeId,
            seats: reservation.seats,
            quantity: reservation.quantity,
            date: reservation.date,
            time: reservation.time,
            endTime: reservation.endTime,
            conditionId: reservation.conditionId,
            occasion: reservation.occasion,
            note: reservation.note,
            status: reservation.status,
            eventName: reservation.eventName || '',
          }
        : {
            venueId: seed.venues[0]?.id || '',
            guestName: '',
            pleisId: '',
            sourceLabel: '',
            phoneNumber: '',
            reservationTypeId: seed.defaults.reservationTypeId || seed.reservationTypes[0]?.id || '',
            seats: EMPTY_NUMBER,
            quantity: 1,
            date: seed.defaults.date,
            time: seed.defaults.time,
            endTime: deriveEndTime(seed.defaults.time),
            conditionId: seed.conditions[0]?.id || '',
            occasion: '',
            note: '',
            status: 'new',
            eventName: '',
          }
    );
  }, [open, reservation, reset]);

  // End time follows the start time until it is touched.
  useEffect(() => {
    if (!open || endTimeOverriddenRef.current || !TIME_PATTERN.test(time || '')) return;
    setValue('endTime', deriveEndTime(time), { shouldValidate: true });
  }, [open, time, setValue]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit({
        ...values,
        guestName: values.guestName.trim(),
        // A guest with no Pleis ID came in by phone or walk-in — label the row.
        sourceLabel: values.pleisId?.trim() ? '' : values.sourceLabel?.trim() || 'Phone reservation',
      });
      showSuccess(isEdit ? 'Reservation updated' : 'Reservation created');
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  const renderSelect = (
    name: 'venueId' | 'reservationTypeId' | 'conditionId' | 'occasion' | 'status',
    label: string,
    description: string,
    options: { value: string; label: string }[]
  ) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>}
          <Select
            value={name === 'occasion' ? field.value || NO_OCCASION_VALUE : (field.value as string) || ''}
            onValueChange={(next) => field.onChange(name === 'occasion' && next === NO_OCCASION_VALUE ? '' : next)}
          >
            <FormControl>
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}...`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
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
  );

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent aria-describedby={undefined} className="flex max-h-[90vh] w-full flex-col gap-0 p-0 sm:max-w-3xl dark:bg-[#222121]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold">{isEdit ? 'Edit reservation' : 'Add reservation'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex max-h-[calc(90vh-9rem)] flex-col gap-5 overflow-y-auto px-6 py-5">
            {/* ---------- Organization ---------- */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">Organization</h3>
              {renderSelect(
                'venueId',
                'Organization *',
                'Which venue this reservation is booked at.',
                venues.map((venue) => ({ value: venue.id, label: `${venue.name} · ${venue.address}` }))
              )}
            </div>

            {/* ---------- Guest ---------- */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">Guest</h3>

              <div>
                <RHFTextField name="guestName" label="Full name *" placeholder="First and last name" />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Free entry (phone / walk-in) or a Pleis user’s full name.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <RHFTextField name="pleisId" label="Pleis ID" placeholder="PID (optional)" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Populated automatically when the guest books via the app.</p>
                </div>

                <div>
                  <RHFTextField name="phoneNumber" label="Phone number" placeholder="+385 91 000 0000" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">For phone reservations or direct contact.</p>
                </div>
              </div>

              <button
                type="button"
                aria-expanded={showUserInfo}
                onClick={() => setShowUserInfo((current) => !current)}
                className="flex w-full cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {showUserInfo ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                {showUserInfo ? 'Hide user info' : 'Show user info'}
              </button>

              {showUserInfo &&
                (guestProfile ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-1 dark:border-gray-700 dark:bg-[#1a1a1a]">
                    <div className="grid gap-x-8 border-b border-dashed border-gray-300 py-2.5 sm:grid-cols-2 dark:border-gray-700">
                      <ProfileField label="Full name" value={guestProfile.fullName} />
                      <ProfileField label="E-mail" value={guestProfile.email} />
                    </div>
                    <div className="grid gap-x-8 py-2.5 sm:grid-cols-2">
                      <ProfileField label="Loyalty status" value={guestProfile.loyaltyTier} />
                      <ProfileField
                        label="Reservations (made / used)"
                        value={`${guestProfile.reservationsMade} / ${guestProfile.reservationsUsed}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400">
                    No linked Pleis account — this is a phone or walk-in reservation.
                  </div>
                ))}
            </div>

            {/* ---------- Reservation details ---------- */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">Reservation details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {renderSelect(
                  'reservationTypeId',
                  'Reservation type',
                  '',
                  reservationTypes.map((type) => ({ value: type.id, label: type.name }))
                )}
                <RHFTextField name="seats" type="number" min={1} label="Number of persons" placeholder="e.g. 4" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <RHFTextField name="quantity" type="number" min={1} label="Quantity (tables)" placeholder="1" />

                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn('h-10 w-full cursor-pointer justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(parseISO(field.value), 'dd/MM/yyyy') : 'Pick a date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="dark:bg-secondary w-auto p-0">
                          <Calendar
                            mode="single"
                            weekStartsOn={1}
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              // Kept as an ISO string so it round-trips to the API unchanged.
                              field.onChange(format(date, 'yyyy-MM-dd'));
                              setDatePickerOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Time24hInput title="Start time" value={field.value || ''} onChange={field.onChange} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time (internal)</FormLabel>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time + average slot duration. Not shown to the guest.</p>
                    <FormControl>
                      <Time24hInput
                        title="End time"
                        value={field.value || ''}
                        onChange={(next) => {
                          endTimeOverriddenRef.current = true;
                          field.onChange(next);
                        }}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {renderSelect(
                'conditionId',
                'Condition',
                'Shown when the reservation type has a condition (what the guest selected / paid).',
                conditions.map((condition) => ({ value: condition.id, label: condition.label }))
              )}
            </div>

            {/* ---------- Occasion & status ---------- */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">Occasion &amp; status</h3>

              {renderSelect('occasion', 'Occasion', 'Managed in Reservation Preferences → Occasions.', [
                { value: NO_OCCASION_VALUE, label: '— None —' },
                ...OCCASION_OPTIONS.map((occasion) => ({ value: occasion, label: occasion })),
              ])}

              <FormField
                control={control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Note submitted by the guest through the reservation form.</p>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Guest’s note (e.g. window seat, allergies, arrival details)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {renderSelect('status', 'Status', '', RESERVATION_STATUS_OPTIONS)}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            {isEdit && onDelete ? (
              <Button
                type="button"
                variant="outline"
                onClick={onDelete}
                disabled={isSubmitting}
                className="cursor-pointer border-red-200 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400"
              >
                Delete reservation
              </Button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer font-semibold">
                Cancel
              </Button>
              {isSubmitting ? (
                <Button type="button" disabled className="cursor-not-allowed font-semibold">
                  <ButtonLoading title="Saving" />
                </Button>
              ) : (
                <Button type="submit" className="cursor-pointer font-semibold">
                  Save
                </Button>
              )}
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
