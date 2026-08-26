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
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { cn } from '@/lib/utils';
import { useGetOccasionsQuery } from '@/store/Reducer/occasions-api';
import type { ApiReservationType } from '@/store/Reducer/reservation-types-api';
import { useGetReservationTypesQuery } from '@/store/Reducer/reservation-types-api';
import type { ApiReservationCondition, ApiUserReservationStatus, UserReservationBody } from '@/store/Reducer/user-reservations-api';
import {
  USER_RESERVATION_STATUSES,
  useCreateUserReservationMutation,
  useUpdateUserReservationV2Mutation,
} from '@/store/Reducer/user-reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as Yup from 'yup';
import {
  CONDITION_TYPE_LABELS,
  NO_OCCASION_VALUE,
  SELECT_ITEM_CLASS,
  SELECT_TRIGGER_CLASS,
  USER_RESERVATION_STATUS_OPTIONS,
  deriveEndTime,
  formatDuration,
  fromIsoTime,
  toStatusOption,
} from '../constants';
import { Reservation } from '../types';
import { useGuestLookup } from '../use-guest-lookup';
import type { ReservationTimeRules } from '../use-reservation-time-rules';
import { useReservationTimeRules } from '../use-reservation-time-rules';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const DEFAULT_PHONE_CODE = '+385';

const CREATE_DEFAULT_STATUS: ApiUserReservationStatus = 'needsConfirmation';

interface FormLimits {
  maxPartySize?: number;
  availableTables?: number;
  availableCapacity?: number;
  conditionType: ApiReservationCondition;
  occasionRequired: boolean;
}

const NO_LIMITS: FormLimits = { conditionType: 'free', occasionRequired: false };

const readLimits = (type?: ApiReservationType): FormLimits =>
  type
    ? {
        maxPartySize: type.maxPartySize,
        availableTables: type.availableTables,
        availableCapacity: type.availableCapacity,
        conditionType: type.conditionType ?? 'free',
        occasionRequired: type.occasionRequired ?? false,
      }
    : NO_LIMITS;

interface ReservationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  reservationType: string;
  partySize: number;
  numberOfTables: number;
  date: string;
  startTime: string;
  endTime: string;
  amount?: number;
  occasion: string;
  notes: string;
  status: ApiUserReservationStatus;
}

const emptyToUndefined = (value: unknown, original: unknown) =>
  original === '' || original === null ? undefined : value;

const EMPTY_NUMBER = '' as unknown as number;

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

const BOUNDED_FIELDS = ['partySize', 'numberOfTables', 'amount', 'occasion'] as const;

const makeSchema = (getLimits: () => FormLimits, getRules: () => ReservationTimeRules | null) =>
  Yup.object().shape({
    firstName: Yup.string().trim().required('First name is required').max(40, 'First name must be 40 characters or fewer').default(''),
    lastName: Yup.string().trim().required('Last name is required').max(40, 'Last name must be 40 characters or fewer').default(''),
    email: Yup.string().trim().email('Enter a valid email address').required('Email is required').default(''),
    phoneCode: Yup.string().trim().default(''),
    phone: Yup.string().trim().required('Phone number is required').default(''),

    reservationType: Yup.string().required('Reservation type is required').default(''),

    partySize: Yup.number()
      .transform(emptyToUndefined)
      .typeError('Number of persons must be a number')
      .integer('Number of persons must be a whole number')
      .min(1, 'At least 1 person is required')
      .required('Number of persons is required')
      .test('max-party-size', '', function (value) {
        const { maxPartySize } = getLimits();
        if (value === undefined || maxPartySize === undefined || value <= maxPartySize) return true;

        return this.createError({
          message: `This reservation type allows a maximum of ${maxPartySize} ${maxPartySize === 1 ? 'person' : 'people'} per booking`,
        });
      }),

    numberOfTables: Yup.number()
      .transform(emptyToUndefined)
      .typeError('Quantity must be a number')
      .integer('Quantity must be a whole number')
      .min(1, 'At least 1 table is required')
      .required('Quantity is required')
      .test('available-tables', '', function (value) {
        const { availableTables } = getLimits();
        if (value === undefined || availableTables === undefined || value <= availableTables) return true;

        return this.createError({
          message: availableTables === 0 ? 'No tables of this type are available' : `Only ${plural(availableTables, 'table')} left for this reservation type`,
        });
      }),

    date: Yup.string().required('Date is required').default(''),

    startTime: Yup.string()
      .default('')
      .test('start-time', '', function (value) {
        const message = getRules()?.checkStartTime(value ?? '');
        return message ? this.createError({ message }) : true;
      }),

    endTime: Yup.string()
      .default('')
      .test('end-time', '', function (value) {
        const message = getRules()?.checkEndTime(this.parent.startTime ?? '', value ?? '');
        return message ? this.createError({ message }) : true;
      }),

    amount: Yup.number()
      .transform(emptyToUndefined)
      .typeError('Amount must be a number')
      .min(0, 'Amount cannot be negative')
      .test('amount-required', 'Amount is required for a minimum-spend reservation type', (value) => {
        if (getLimits().conditionType !== 'minimumSpend') return true;
        return value !== undefined && !Number.isNaN(value);
      }),

    occasion: Yup.string()
      .default('')
      .test('occasion-required', 'This reservation type requires an occasion', (value) => !getLimits().occasionRequired || Boolean(value)),

    notes: Yup.string().default(''),
    status: Yup.mixed<ApiUserReservationStatus>().oneOf(USER_RESERVATION_STATUSES).required(),
  });

const ProfileField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="truncate text-right text-sm font-bold text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

interface ReservationFormModalProps {
  open: boolean;
  reservation?: Reservation | null;
  organizationId?: string;
  defaults: { date: string; time: string; reservationTypeId: string };
  onSuccess?: () => void;
  onClose: () => void;
}

export const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  open,
  reservation,
  organizationId,
  defaults,
  onSuccess,
  onClose,
}) => {
  const isEdit = Boolean(reservation);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { companyId } = useCompanySelectionState();

  const { data: typesResponse, isFetching: isLoadingTypes } = useGetReservationTypesQuery(
    { organization: organizationId as string, summary: true },
    { skip: !open || !organizationId, refetchOnMountOrArgChange: true }
  );

  const reservationTypes = useMemo(() => typesResponse?.data ?? [], [typesResponse]);

  const { data: occasions, isFetching: isLoadingOccasions } = useGetOccasionsQuery(
    { organization: organizationId as string },
    { skip: !open || !organizationId, refetchOnMountOrArgChange: true }
  );

  const occasionOptions = useMemo(
    () => (occasions ?? []).filter((occasion) => occasion.status !== 'inactive').map((occasion) => ({ value: occasion._id, label: occasion.name })),
    [occasions]
  );

  const [createUserReservation, { isLoading: isCreating }] = useCreateUserReservationMutation();
  const [updateUserReservation, { isLoading: isUpdating }] = useUpdateUserReservationV2Mutation();
  const isSubmitting = isCreating || isUpdating;

  const limitsRef = useRef<FormLimits>(NO_LIMITS);
  const rulesRef = useRef<ReservationTimeRules | null>(null);
  const schema = useMemo(() => makeSchema(() => limitsRef.current, () => rulesRef.current), []);

  const methods = useForm<ReservationFormValues>({
    resolver: yupResolver(schema) as Resolver<ReservationFormValues>,
    mode: 'onChange',
  });

  const { reset, control, watch, setValue, getValues, trigger, handleSubmit, formState } = methods;

  const reservationTypeId = watch('reservationType');
  const startTime = watch('startTime');
  const selectedDate = watch('date');
  const emailValue = watch('email');

  const timeRules = useReservationTimeRules({ organizationId, date: selectedDate, enabled: open });
  rulesRef.current = timeRules;

  const isTimeDisabled = !timeRules.slotsEnabled;

  const guestLookup = useGuestLookup({ email: emailValue || '', enabled: open });
  const guestProfile = guestLookup.match?.profile ?? null;

  const selectedType = useMemo(
    () => reservationTypes.find((type) => type._id === reservationTypeId),
    [reservationTypes, reservationTypeId]
  );

  const limits = useMemo(() => readLimits(selectedType), [selectedType]);
  limitsRef.current = limits;

  const endTimeOverriddenRef = useRef(false);
  const startTimeSeedRef = useRef(false);
  const prefilledEmailRef = useRef<string | null>(null);

  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  useEffect(() => {
    if (!open) return;

    const seed = defaultsRef.current;
    endTimeOverriddenRef.current = Boolean(reservation);
    startTimeSeedRef.current = !reservation;
    prefilledEmailRef.current = reservation?.email?.trim().toLowerCase() || null;
    setShowUserInfo(false);

    if (reservation) {
      const [fallbackFirst = '', ...fallbackRest] = reservation.guestName.trim().split(/\s+/);

      reset({
        firstName: reservation.firstName || fallbackFirst,
        lastName: reservation.lastName || fallbackRest.join(' '),
        email: reservation.email || '',
        phoneCode: reservation.phoneCode || DEFAULT_PHONE_CODE,
        phone: reservation.phoneNumber || '',
        reservationType: reservation.reservationTypeId,
        partySize: reservation.seats,
        numberOfTables: reservation.quantity,
        date: reservation.date,
        startTime: fromIsoTime(reservation.time),
        endTime: fromIsoTime(reservation.endTime),
        amount: reservation.amount ?? EMPTY_NUMBER,
        occasion: reservation.occasionId || '',
        notes: reservation.note || '',
        status: reservation.status,
      });
      return;
    }

    reset({
      firstName: '',
      lastName: '',
      email: '',
      phoneCode: DEFAULT_PHONE_CODE,
      phone: '',
      reservationType: '',
      partySize: EMPTY_NUMBER,
      numberOfTables: EMPTY_NUMBER,
      date: seed.date,
      startTime: seed.time,
      endTime: deriveEndTime(seed.time),
      amount: EMPTY_NUMBER,
      occasion: '',
      notes: '',
      status: CREATE_DEFAULT_STATUS,
    });
  }, [open, reservation, reset]);

  useEffect(() => {
    if (!open || reservation || reservationTypes.length === 0) return;
    if (getValues('reservationType')) return;

    const preferred = reservationTypes.find((type) => type._id === defaultsRef.current.reservationTypeId);
    setValue('reservationType', (preferred ?? reservationTypes[0])._id, { shouldValidate: true });
  }, [open, reservation, reservationTypes, getValues, setValue]);

  useEffect(() => {
    const match = guestLookup.match;
    if (!open || !match) return;
    if (prefilledEmailRef.current === match.email) return;

    prefilledEmailRef.current = match.email;

    if (match.firstName) setValue('firstName', match.firstName, { shouldValidate: true });
    if (match.lastName) setValue('lastName', match.lastName, { shouldValidate: true });
    if (match.phoneNumber) {
      setValue('phoneCode', match.phoneCode || DEFAULT_PHONE_CODE, { shouldValidate: true });
      setValue('phone', match.phoneNumber, { shouldValidate: true });
    }
  }, [open, guestLookup.match, setValue]);

  useEffect(() => {
    if (!open || !timeRules.isSettingKnown || timeRules.slotsEnabled) return;
    if (!getValues('startTime') && !getValues('endTime')) return;

    setValue('startTime', '', { shouldValidate: true });
    setValue('endTime', '', { shouldValidate: true });
  }, [open, timeRules.isSettingKnown, timeRules.slotsEnabled, getValues, setValue]);

  useEffect(() => {
    if (!open || !startTimeSeedRef.current) return;
    if (!timeRules.isReady || !timeRules.slotsEnabled || !timeRules.isOpenDay || !timeRules.isWindowUsable) return;

    const current = getValues('startTime');
    if (current && timeRules.isStartTimeAllowed(current)) return;

    endTimeOverriddenRef.current = false;
    setValue('startTime', timeRules.earliestStartTime, { shouldValidate: true });
  }, [open, timeRules, getValues, setValue]);

  useEffect(() => {
    if (!open || !timeRules.slotsEnabled) return;

    if (endTimeOverriddenRef.current || !TIME_PATTERN.test(startTime || '')) {
      if (getValues('endTime')) trigger('endTime');
      return;
    }

    setValue('endTime', deriveEndTime(startTime, timeRules.maxDurationMinutes), { shouldValidate: true });
  }, [open, startTime, timeRules.slotsEnabled, timeRules.maxDurationMinutes, getValues, setValue, trigger]);

  useEffect(() => {
    if (!open) return;
    if (!getValues('startTime') && !getValues('endTime')) return;

    trigger(['startTime', 'endTime']);
  }, [open, timeRules.signature, getValues, trigger]);

  const previousTypeRef = useRef('');

  useEffect(() => {
    if (!open) {
      previousTypeRef.current = '';
      return;
    }

    const previousType = previousTypeRef.current;
    previousTypeRef.current = reservationTypeId || '';

    if (!previousType || previousType === reservationTypeId) return;

    const filled = BOUNDED_FIELDS.filter((name) => {
      const value = getValues(name);
      return value !== undefined && value !== null && (value as unknown) !== '';
    });

    if (filled.length > 0) trigger(filled);
  }, [open, reservationTypeId, getValues, trigger]);


  const submit = handleSubmit(async (values) => {
    const body: UserReservationBody = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phoneNumber: { code: values.phoneCode || DEFAULT_PHONE_CODE, number: values.phone.trim() },
      reservationType: values.reservationType,
      partySize: Number(values.partySize),
      numberOfTables: Number(values.numberOfTables),
      timingSlots: {
        dateTimeSlots: [
          {
            date: values.date,
            timeSlots: [
              {
                startTime: timeRules.slotsEnabled ? values.startTime : '',
                endTime: timeRules.slotsEnabled ? values.endTime : '',
              },
            ],
          },
        ],
      },
      conditionType: limits.conditionType,
    };

    if (limits.conditionType === 'minimumSpend') body.amount = Number(values.amount);
    if (values.occasion) body.occasion = values.occasion;
    if (values.notes.trim()) body.notes = values.notes.trim();

    try {
      let message: string | undefined;

      if (reservation) {
        const response = await updateUserReservation({ id: reservation.id, ...body, status: values.status }).unwrap();
        message = response?.message || 'Reservation updated';
      } else {
        if (!organizationId) {
          showError('No organization selected.');
          return;
        }

        const response = await createUserReservation({
          organizationId,
          companyOrganizer: companyId ?? undefined,
          ...body,
        }).unwrap();
        message = response?.message || 'Reservation created';
      }

      showSuccess(message);
      onSuccess?.();
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  const renderSelect = (
    name: 'reservationType' | 'occasion' | 'status',
    label: string,
    description: string,
    options: { value: string; label: string }[],
    { isLoading = false, placeholder }: { isLoading?: boolean; placeholder?: string } = {}
  ) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>}
          <Select
            disabled={isLoading || options.length === 0}
            value={name === 'occasion' && !limits.occasionRequired ? field.value || NO_OCCASION_VALUE : field.value || ''}
            onValueChange={(next) => field.onChange(name === 'occasion' && next === NO_OCCASION_VALUE ? '' : next)}
          >
            <FormControl>
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder={isLoading ? 'Loading...' : placeholder || `Select ${label.toLowerCase()}...`} />
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

  const availabilityHint = useMemo(() => {
    if (!selectedType) return '';

    const parts: string[] = [];
    if (limits.maxPartySize !== undefined) parts.push(`Max ${limits.maxPartySize} per booking`);
    if (limits.availableTables !== undefined) parts.push(`${plural(limits.availableTables, 'table')} free`);
    if (limits.availableCapacity !== undefined) parts.push(`${plural(limits.availableCapacity, 'seat')} free`);

    return parts.join(' · ');
  }, [selectedType, limits]);

  const partySizePlaceholder = useMemo(() => {
    if (!selectedType || limits.maxPartySize === undefined) return 'e.g. 4';
    return `Max ${limits.maxPartySize} per booking`;
  }, [selectedType, limits]);

  const numberOfTablesPlaceholder = useMemo(() => {
    if (!selectedType || limits.availableTables === undefined) return 'e.g. 1';
    return `${plural(limits.availableTables, 'table')} free`;
  }, [selectedType, limits]);

  const typeOptions = useMemo(
    () => reservationTypes.map((type) => ({ value: type._id, label: type.name })),
    [reservationTypes]
  );

  const statusOptions = useMemo(() => {
    const current = reservation?.status;
    if (!current || USER_RESERVATION_STATUS_OPTIONS.some((option) => option.value === current)) {
      return USER_RESERVATION_STATUS_OPTIONS;
    }
    return [toStatusOption(current), ...USER_RESERVATION_STATUS_OPTIONS];
  }, [reservation]);

  const profileRows = useMemo(() => {
    if (!guestProfile) return [];

    const fields: { label: string; value: string }[] = [
      { label: 'Full name', value: guestProfile.fullName },
      { label: 'Email', value: guestProfile.email },
    ];

    if (guestProfile.phoneNumber) fields.push({ label: 'Phone number', value: guestProfile.phoneNumber });
    if (guestProfile.accountStatus) fields.push({ label: 'Account status', value: guestProfile.accountStatus });
    if (guestProfile.loyaltyTier) fields.push({ label: 'Loyalty status', value: guestProfile.loyaltyTier });

    if (guestProfile.reservationsMade !== undefined || guestProfile.reservationsUsed !== undefined) {
      fields.push({
        label: 'Reservations (made / used)',
        value: `${guestProfile.reservationsMade ?? 0} / ${guestProfile.reservationsUsed ?? 0}`,
      });
    }

    const rows: { label: string; value: string }[][] = [];
    for (let index = 0; index < fields.length; index += 2) rows.push(fields.slice(index, index + 2));

    return rows;
  }, [guestProfile]);

  const timeHint = useMemo(() => {
    if (timeRules.isLoading) return "Checking the organization's time slot settings...";

    if (!timeRules.slotsEnabled) {
      return 'Time slots are disabled in Reservation Preferences — this reservation is saved without a time.';
    }

    if (!timeRules.isOpenDay) return `The organization is closed on ${timeRules.dayLabel}.`;

    const maxLabel = `max ${formatDuration(timeRules.maxDurationMinutes)} per reservation`;

    if (!timeRules.isWindowUsable) return `No booking window is available on ${timeRules.dayLabel} · ${maxLabel}`;

    return `${timeRules.dayLabel} working hours ${timeRules.openTime} – ${timeRules.closeTime} · bookings from ${timeRules.earliestStartTime} to ${timeRules.latestStartTime} · ${maxLabel}`;
  }, [timeRules]);

  const isSaveDisabled = isSubmitting || isLoadingTypes || timeRules.isLoading || Object.keys(formState.errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent aria-describedby={undefined} className="flex max-h-[90vh] w-full flex-col gap-0 p-0 sm:max-w-3xl dark:bg-[#222121]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold">{isEdit ? 'Edit reservation' : 'Add reservation'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={submit}>
          <div className="flex max-h-[calc(90vh-9rem)] flex-col gap-5 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">Guest</h3>

              <div className="grid items-start gap-4 sm:grid-cols-2">
                <RHFTextField name="firstName" label="First name *" placeholder="First name" />
                <RHFTextField name="lastName" label="Last name *" placeholder="Last name" />
              </div>

              <div className="grid items-start gap-4 sm:grid-cols-2 mb-2">
                <div>
                  <RHFTextField name="email" type="email" label="Email *" placeholder="guest@email.com" />
                </div>

                <FormField
                  control={control}
                  name="phone"
                  render={({ field, fieldState }) => {
                    const code = watch('phoneCode') || '';
                    const displayValue = field.value && code ? `${code}${field.value}` : field.value || '';

                    return (
                      <FormItem>
                        <FormLabel>Phone number *</FormLabel>
                        <PhoneInput
                          value={displayValue}
                          country="hr"
                          onChange={(value, country: { dialCode?: string }) => {
                            const dialCode = country?.dialCode || '';
                            field.onChange(value.replace(dialCode, ''));
                            setValue('phoneCode', `+${dialCode}`, { shouldValidate: true, shouldDirty: true });
                          }}
                          placeholder="Phone number"
                          inputProps={{ 'aria-invalid': fieldState.invalid }}
                          containerClass="w-full"
                          dropdownStyle={{ zIndex: 9999, position: 'fixed', width: '16rem' }}
                          buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                          inputClass={cn(
                            'file:text-foreground placeholder:text-muted-foreground border-input !border-gray-100 dark:!border-gray-500 !shadow-sm flex !h-[40px] !w-full min-w-0 rounded-lg !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            fieldState.invalid && 'border-destructive ring-destructive/40'
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
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
                (guestLookup.isLooking ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400">
                    Looking up the Pleis account...
                  </div>
                ) : guestProfile ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-1 dark:border-gray-700 dark:bg-[#1a1a1a]">
                    {profileRows.map((row, index) => (
                      <div
                        key={row[0].label}
                        className={cn(
                          'grid gap-x-8 py-2.5 sm:grid-cols-2',
                          index < profileRows.length - 1 && 'border-b border-dashed border-gray-300 dark:border-gray-700'
                        )}
                      >
                        {row.map((field) => (
                          <ProfileField key={field.label} label={field.label} value={field.value} />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400">
                    No linked Pleis account — this is a phone or walk-in reservation.
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-200 pt-5 dark:border-gray-800">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">Reservation details</h3>

              <div className="grid items-start gap-4 sm:grid-cols-2">
                <div>
                  {renderSelect('reservationType', 'Reservation type *', '', typeOptions, {
                    isLoading: isLoadingTypes,
                    placeholder: reservationTypes.length === 0 && !isLoadingTypes ? 'No reservation types' : undefined,
                  })}
                  {availabilityHint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{availabilityHint}</p>}
                </div>

                <RHFTextField name="partySize" type="number" min={1} label="Number of persons *" placeholder={partySizePlaceholder} />
              </div>

              <div className="grid items-start gap-4 sm:grid-cols-3">
                <RHFTextField name="numberOfTables" type="number" min={1} label="Quantity (tables) *" placeholder={numberOfTablesPlaceholder} />

                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
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
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{timeRules.slotsEnabled ? 'Time *' : 'Time'}</FormLabel>
                      <FormControl>
                        <Time24hInput
                          title="Start time"
                          value={field.value || ''}
                          onChange={(next) => {
                            startTimeSeedRef.current = false;
                            field.onChange(next);
                          }}
                          disabled={isTimeDisabled}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="-mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{timeHint}</p>

              <FormField
                control={control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time (internal)</FormLabel>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Time + {formatDuration(timeRules.maxDurationMinutes)}. Not shown to the guest.
                    </p>
                    <FormControl>
                      <Time24hInput
                        title="End time"
                        value={field.value || ''}
                        onChange={(next) => {
                          endTimeOverriddenRef.current = true;
                          field.onChange(next);
                        }}
                        disabled={isTimeDisabled}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={cn('grid items-start gap-4', limits.conditionType === 'minimumSpend' && 'sm:grid-cols-2')}>
                <div>
                  <FormLabel>Condition</FormLabel>
                  <div className="mt-2 flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-200">
                    {selectedType ? CONDITION_TYPE_LABELS[limits.conditionType] : '—'}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">Set by the selected reservation type.</p>
                </div>

                {limits.conditionType === 'minimumSpend' && (
                  <div>
                    <RHFTextField name="amount" type="number" min={0} label="Amount *" placeholder="e.g. 50" />
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">Minimum spend the guest agreed to.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                {isEdit ? 'Occasion & status' : 'Occasion'}
              </h3>

              {renderSelect(
                'occasion',
                limits.occasionRequired ? 'Occasion *' : 'Occasion',
                'Managed in Reservation Preferences → Occasions.',
                [
                  ...(limits.occasionRequired ? [] : [{ value: NO_OCCASION_VALUE, label: '— None —' }]),
                  ...occasionOptions,
                ],
                { isLoading: isLoadingOccasions, placeholder: occasionOptions.length === 0 && !isLoadingOccasions ? 'No occasions' : undefined }
              )}

              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Note submitted by the guest through the reservation form.</p>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Guest's note (e.g. window seat, allergies, arrival details)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEdit && renderSelect('status', 'Status', '', statusOptions)}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer font-semibold">
                Cancel
              </Button>
              {isSubmitting ? (
                <Button type="button" disabled className="cursor-not-allowed font-semibold">
                  <ButtonLoading title="Saving" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSaveDisabled} className="cursor-pointer font-semibold disabled:cursor-not-allowed">
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
