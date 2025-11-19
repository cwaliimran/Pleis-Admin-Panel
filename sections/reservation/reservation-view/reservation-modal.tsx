'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
import { useAddReservationMutation, useUpdateReservationMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Info, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// Import types and utilities
import { ReservationFormValues, ReservationModalProps, EventData, EventDateRange, DateTimeSlot, ValidationErrors } from './types';

import { convertTimeFormat } from '@/utils/format-time';

import { parseEventDateTime, formatDateForInput, isDateInRange, isTimeInEventRange, validateNoOverlap, sortTimeSlots, timeToMinutes } from './utils';

// ============================================
// CONSTANTS (inline as requested)
// ============================================
const RESERVATION_TYPE_OPTIONS = [
  { value: 'regular', label: 'Regular' },
  { value: 'vip', label: 'VIP' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'private', label: 'Private' },
  { value: 'bar', label: 'Bar' },
  { value: 'window', label: 'Window' },
];

const CONDITION_OPTIONS = [
  { label: 'Fixed Price - User pays full amount', value: 'fixedPrice' },
  { label: 'Minimum Spend on Location', value: 'minimumSpendOnLocation' },
  { label: 'Prepay Option - Deducted from ordering', value: 'prepayOption' },
  { label: 'No Condition - Free reservation', value: 'noCondition' },
  { label: 'Ticket Requirement', value: 'ticketRequirement' },
  { label: 'Custom Text Condition', value: 'customText' },
];

const TICKET_TYPE_OPTIONS = [
  { label: 'VIP Event Pass', value: 'vipEventPass' },
  { label: 'General Admission', value: 'generalAdmission' },
  { label: 'Premium Access', value: 'premiumAccess' },
];

const TAX_OPTIONS = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '13', label: '13%' },
  { value: '25', label: '25%' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// ============================================
// SCHEMA VALIDATION
// ============================================
const schema = Yup.object().shape({
  reservationType: Yup.string().required('Reservation type is required'),
  availableReservations: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Number of available reservations is required')
    .min(1, 'Must be at least 1'),
  maxCapacityPerReservation: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Max capacity is required')
    .min(1, 'Must be at least 1'),
  conditionType: Yup.string().required('Condition type is required'),
  amount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .when('conditionType', {
      is: (val: string) => ['fixedPrice', 'minimumSpendOnLocation', 'prepayOption'].includes(val),
      then: (schema) => schema.required('Amount is required for this condition').min(1, 'Must be at least 1'),
      otherwise: (schema) => schema.nullable(),
    }),
  customText: Yup.string().when('conditionType', {
    is: (val: string) => val === 'customText' || val === 'minimumSpendOnLocation',
    then: (schema) => schema.required('Custom text is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ticketType: Yup.string().when('conditionType', {
    is: 'ticketRequirement',
    then: (schema) => schema.required('Ticket type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  taxPercentage: Yup.string().required('Tax percentage is required'),
  needsConfirmation: Yup.boolean().required('Confirmation requirement is mandatory').oneOf([true], 'Needs confirmation must be enabled'),
  optionalEventId: Yup.string().notRequired(),
  timingSlotsEnabled: Yup.boolean(),
  status: Yup.string().oneOf(['active', 'inactive'] as const),
}) as Yup.ObjectSchema<ReservationFormValues>;

const defaultValues: ReservationFormValues = {
  reservationType: '',
  availableReservations: 0,
  maxCapacityPerReservation: 0,
  conditionType: 'fixedPrice',
  amount: null,
  customText: '',
  ticketType: '',
  taxPercentage: '25',
  needsConfirmation: true,
  optionalEventId: '',
  timingSlotsEnabled: false,
  status: 'active',
};

// ============================================
// MAIN COMPONENT
// ============================================
const ReservationModal = ({ open, onClose, isEdit = false, selectedData, organizationId }: ReservationModalProps) => {
  const [addReservation, { isLoading: addLoading }] = useAddReservationMutation();
  const [updateReservation, { isLoading: updateLoading }] = useUpdateReservationMutation();

  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const { data: eventData, isLoading: isLoadingEvents } = useGetEventsByOrganizationQuery(
    { organization: organizationId },
    { skip: !organizationId }
  );

  const methods = useForm<ReservationFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, watch, setValue } = methods;

  const conditionType = watch('conditionType');
  const timingSlotsEnabled = watch('timingSlotsEnabled');
  const selectedEventId = watch('optionalEventId');

  const eventOptions = useMemo(() => {
    if (!eventData || !Array.isArray(eventData)) return [];
    return eventData.map((event: EventData) => ({
      value: event._id.toString(),
      label: event.basicInfo?.title || 'No Title',
    }));
  }, [eventData]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId || !eventData || !Array.isArray(eventData)) return null;
    return eventData.find((event: EventData) => event._id === selectedEventId) || null;
  }, [selectedEventId, eventData]);

  const eventDateRange = useMemo((): EventDateRange | null => {
    if (!selectedEvent) return null;

    const startDate = parseEventDateTime(selectedEvent.schedule.startDateTime);
    const endDate = parseEventDateTime(selectedEvent.schedule.endDateTime);

    if (!startDate || !endDate) return null;

    const startTime24 = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
    const endTime24 = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    const startTime12 = convertTimeFormat(startTime24, false);
    const endTime12 = convertTimeFormat(endTime24, false);

    return {
      startDate,
      endDate,
      minDate: formatDateForInput(startDate),
      maxDate: formatDateForInput(endDate),
      startTime: startTime12,
      endTime: endTime12,
      startTimeMinutes: timeToMinutes(startTime12),
      endTimeMinutes: timeToMinutes(endTime12),
    };
  }, [selectedEvent]);

  // ============================================
  // TIMING SLOTS VALIDATION
  // ============================================
  const validateTimingSlots = (): boolean => {
    if (!timingSlotsEnabled || !selectedEvent || !eventDateRange) return true;

    const errors: ValidationErrors = {};
    let isValid = true;

    // Check for duplicate dates
    const dateCount = new Map<string, number>();
    dateTimeSlots.forEach((slot) => {
      if (slot.date) {
        dateCount.set(slot.date, (dateCount.get(slot.date) || 0) + 1);
      }
    });

    dateTimeSlots.forEach((dateSlot, dateIndex) => {
      if (!dateSlot.date) {
        errors[`date-${dateIndex}`] = 'Date is required';
        isValid = false;
        return;
      }

      // Check for duplicate dates
      if (dateCount.get(dateSlot.date)! > 1) {
        errors[`date-${dateIndex}`] = 'This date is already added. Each date can only be added once.';
        isValid = false;
      }

      if (!isDateInRange(dateSlot.date, eventDateRange.startDate, eventDateRange.endDate)) {
        errors[`date-${dateIndex}`] = `Date must be between ${eventDateRange.minDate} and ${eventDateRange.maxDate}`;
        isValid = false;
      }

      if (dateSlot.timeSlots.length === 0) {
        errors[`date-${dateIndex}-slots`] = 'At least one time slot is required';
        isValid = false;
        return;
      }

      dateSlot.timeSlots.forEach((timeSlot, timeIndex) => {
        if (!timeSlot.startTime || !timeSlot.endTime) {
          errors[`time-${dateIndex}-${timeIndex}`] = 'Both start and end times are required';
          isValid = false;
          return;
        }

        const startMinutes = timeToMinutes(timeSlot.startTime);
        const endMinutes = timeToMinutes(timeSlot.endTime);

        if (startMinutes >= endMinutes) {
          errors[`time-${dateIndex}-${timeIndex}-order`] = 'Start time must be before end time';
          isValid = false;
        }

        const startValidation = isTimeInEventRange(timeSlot.startTime, dateSlot.date, eventDateRange);
        if (!startValidation.valid && startValidation.reason) {
          errors[`time-${dateIndex}-${timeIndex}-start`] = startValidation.reason;
          isValid = false;
        }

        const endValidation = isTimeInEventRange(timeSlot.endTime, dateSlot.date, eventDateRange);
        if (!endValidation.valid && endValidation.reason) {
          errors[`time-${dateIndex}-${timeIndex}-end`] = endValidation.reason;
          isValid = false;
        }
      });

      const overlapCheck = validateNoOverlap(dateSlot.timeSlots);
      if (!overlapCheck.valid && overlapCheck.overlappingIndices) {
        const [i, j] = overlapCheck.overlappingIndices;
        errors[`time-${dateIndex}-overlap`] = 'Time slots cannot overlap';
        errors[`time-${dateIndex}-${i}-overlap`] = `Overlaps with slot ${j + 1}`;
        errors[`time-${dateIndex}-${j}-overlap`] = `Overlaps with slot ${i + 1}`;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // ============================================
  // TIMING SLOTS MANAGEMENT
  // ============================================
  const addDateSlot = () => {
    setDateTimeSlots([...dateTimeSlots, { date: '', timeSlots: [{ startTime: '', endTime: '' }] }]);
  };

  const removeDateSlot = (dateIndex: number) => {
    setDateTimeSlots(dateTimeSlots.filter((_, i) => i !== dateIndex));
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`date-${dateIndex}`) || key.startsWith(`time-${dateIndex}`)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const addTimeSlot = (dateIndex: number) => {
    const updated = [...dateTimeSlots];
    updated[dateIndex].timeSlots.push({ startTime: '', endTime: '' });
    setDateTimeSlots(updated);
  };

  const removeTimeSlot = (dateIndex: number, timeIndex: number) => {
    const updated = [...dateTimeSlots];
    updated[dateIndex].timeSlots = updated[dateIndex].timeSlots.filter((_, i) => i !== timeIndex);
    setDateTimeSlots(updated);

    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.includes(`time-${dateIndex}-${timeIndex}`)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const updateDateSlot = (dateIndex: number, field: string, value: string) => {
    const updated = [...dateTimeSlots];
    (updated[dateIndex] as any)[field] = value;
    setDateTimeSlots(updated);

    const newErrors = { ...validationErrors };
    delete newErrors[`date-${dateIndex}`];

    // Check for duplicate dates in real-time
    if (field === 'date' && value) {
      const duplicateIndex = updated.findIndex((slot, idx) => idx !== dateIndex && slot.date === value);
      if (duplicateIndex !== -1) {
        newErrors[`date-${dateIndex}`] = 'This date is already added. Each date can only be added once.';
        newErrors[`date-${duplicateIndex}`] = 'This date is already added. Each date can only be added once.';
      } else {
        // Clear duplicate error from other slot if it was fixed
        updated.forEach((_, idx) => {
          delete newErrors[`date-${idx}`];
        });
      }
    }

    setValidationErrors(newErrors);
  };

  const updateTimeSlot = (dateIndex: number, timeIndex: number, field: string, value: string) => {
    const updated = [...dateTimeSlots];
    (updated[dateIndex].timeSlots[timeIndex] as any)[field] = value;
    setDateTimeSlots(updated);

    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.includes(`time-${dateIndex}-${timeIndex}`)) {
        delete newErrors[key];
      }
    });

    if (selectedEvent && eventDateRange && updated[dateIndex].date) {
      const timeSlot = updated[dateIndex].timeSlots[timeIndex];

      if (timeSlot.startTime) {
        const startValidation = isTimeInEventRange(timeSlot.startTime, updated[dateIndex].date, eventDateRange);
        if (!startValidation.valid && startValidation.reason) {
          newErrors[`time-${dateIndex}-${timeIndex}-start`] = startValidation.reason;
        }
      }

      if (timeSlot.endTime) {
        const endValidation = isTimeInEventRange(timeSlot.endTime, updated[dateIndex].date, eventDateRange);
        if (!endValidation.valid && endValidation.reason) {
          newErrors[`time-${dateIndex}-${timeIndex}-end`] = endValidation.reason;
        }
      }

      if (timeSlot.startTime && timeSlot.endTime) {
        const startMinutes = timeToMinutes(timeSlot.startTime);
        const endMinutes = timeToMinutes(timeSlot.endTime);

        if (startMinutes >= endMinutes) {
          newErrors[`time-${dateIndex}-${timeIndex}-order`] = 'Start time must be before end time';
        }

        const overlapCheck = validateNoOverlap(updated[dateIndex].timeSlots);
        if (!overlapCheck.valid && overlapCheck.overlappingIndices) {
          const [i, j] = overlapCheck.overlappingIndices;
          newErrors[`time-${dateIndex}-overlap`] = 'Time slots cannot overlap';
          newErrors[`time-${dateIndex}-${i}-overlap`] = `Overlaps with slot ${j + 1}`;
          newErrors[`time-${dateIndex}-${j}-overlap`] = `Overlaps with slot ${i + 1}`;
        } else {
          delete newErrors[`time-${dateIndex}-overlap`];
          updated[dateIndex].timeSlots.forEach((_, idx) => {
            delete newErrors[`time-${dateIndex}-${idx}-overlap`];
          });
        }
      }
    }

    setValidationErrors(newErrors);
  };

  useEffect(() => {
    if (selectedEventId && timingSlotsEnabled) {
      setDateTimeSlots([]);
      setValidationErrors({});
    }
  }, [selectedEventId, timingSlotsEnabled]);

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mappedData: ReservationFormValues = {
        reservationType: selectedData?.reservationType || '',
        availableReservations: selectedData?.availableReservations || 0,
        maxCapacityPerReservation: selectedData?.maxCapacityPerReservation || 0,
        conditionType: selectedData?.conditionType || 'fixedPrice',
        amount: selectedData?.amount || null,
        customText: selectedData?.customText || '',
        ticketType: selectedData?.ticketType || '',
        taxPercentage: selectedData?.taxPercentage?.toString() || '25',
        needsConfirmation: selectedData?.needsConfirmation ?? true,
        optionalEventId: selectedData?.optionalEventId?._id || selectedData?.optionalEventId || '',
        timingSlotsEnabled: selectedData?.timingSlots?.enabled || false,
        status: selectedData?.status || 'active',
      };

      if (selectedData?.timingSlots?.dateTimeSlots) {
        setDateTimeSlots(selectedData.timingSlots.dateTimeSlots);
      }

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
      setDateTimeSlots([]);
      setValidationErrors({});
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: ReservationFormValues) => {
    try {
      if (!formData.needsConfirmation) {
        showError('Needs confirmation must be enabled for all reservations');
        return;
      }

      if (formData.timingSlotsEnabled) {
        if (dateTimeSlots.length === 0) {
          showError('Please add at least one date with time slots');
          return;
        }

        for (const dateSlot of dateTimeSlots) {
          if (!dateSlot.date) {
            showError('All date slots must have a date selected');
            return;
          }
          if (dateSlot.timeSlots.length === 0) {
            showError('Each date must have at least one time slot');
            return;
          }
          for (const timeSlot of dateSlot.timeSlots) {
            if (!timeSlot.startTime || !timeSlot.endTime) {
              showError('All time slots must have start and end times');
              return;
            }
          }
        }

        if (selectedEvent) {
          // CRITICAL: Final strict validation before submit
          if (!validateTimingSlots()) {
            showError('Please fix all validation errors before submitting');
            return;
          }

          // ADDITIONAL STRICT CHECK: Validate ALL slots are within event time range
          if (eventDateRange) {
            for (const dateSlot of dateTimeSlots) {
              for (const timeSlot of dateSlot.timeSlots) {
                // Validate start time
                const startValidation = isTimeInEventRange(timeSlot.startTime, dateSlot.date, eventDateRange);
                if (!startValidation.valid) {
                  showError(`Invalid start time on ${dateSlot.date}: ${startValidation.reason || 'Time is outside event range'}`);
                  return;
                }

                // Validate end time
                const endValidation = isTimeInEventRange(timeSlot.endTime, dateSlot.date, eventDateRange);
                if (!endValidation.valid) {
                  showError(`Invalid end time on ${dateSlot.date}: ${endValidation.reason || 'Time is outside event range'}`);
                  return;
                }

                // Validate start < end
                const startMinutes = timeToMinutes(timeSlot.startTime);
                const endMinutes = timeToMinutes(timeSlot.endTime);
                if (startMinutes >= endMinutes) {
                  showError(`Start time must be before end time on ${dateSlot.date}`);
                  return;
                }
              }
            }
          }
        }
      }

      const payload: any = {
        reservationType: formData.reservationType,
        availableReservations: Number(formData.availableReservations),
        maxCapacityPerReservation: Number(formData.maxCapacityPerReservation),
        organizationId: organizationId,
        conditionType: formData.conditionType,
        taxPercentage: formData.taxPercentage,
        needsConfirmation: formData.needsConfirmation,
      };

      switch (formData.conditionType) {
        case 'fixedPrice':
        case 'prepayOption':
          payload.amount = Number(formData.amount);
          break;
        case 'minimumSpendOnLocation':
          payload.amount = Number(formData.amount);
          payload.customText = formData.customText;
          break;
        case 'ticketRequirement':
          payload.ticketType = formData.ticketType;
          break;
        case 'customText':
          payload.customText = formData.customText;
          break;
      }

      if (formData.optionalEventId) {
        payload.optionalEventId = formData.optionalEventId;
      }

      const formattedDateTimeSlots = dateTimeSlots.map((dateSlot) => ({
        date: dateSlot.date,
        timeSlots: sortTimeSlots(dateSlot.timeSlots).map((timeSlot) => ({
          startTime: convertTimeFormat(timeSlot.startTime, false),
          endTime: convertTimeFormat(timeSlot.endTime, false),
        })),
      }));

      payload.timingSlots = {
        enabled: formData.timingSlotsEnabled,
        dateTimeSlots: formData.timingSlotsEnabled ? formattedDateTimeSlots : [],
      };

      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      console.log('payload', payload);

      const response = isEdit ? await updateReservation(payload).unwrap() : await addReservation(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Reservation updated successfully' : 'Reservation created successfully'));

      methods.reset(defaultValues);
      setDateTimeSlots([]);
      setValidationErrors({});
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setDateTimeSlots([]);
    setValidationErrors({});
    onClose();
  };

  const renderConditionFields = () => {
    switch (conditionType) {
      case 'fixedPrice':
        return (
          <div className="col-span-2">
            <RHFTextField name="amount" label="Fixed Price (€)" type="number" placeholder="150" min="1" />
          </div>
        );

      case 'minimumSpendOnLocation':
        return (
          <div className="col-span-2 space-y-4">
            <RHFTextField name="amount" label="Minimum Spend Amount (€)" type="number" placeholder="100" min="1" />
            <RHFTextField
              name="customText"
              label="Custom Requirement Text"
              placeholder="e.g., Purchase at least two bottle packs"
              multiline
              rows={2}
            />
            <p className="text-xs text-gray-500">Not automatically tracked, communicated to guest</p>
          </div>
        );

      case 'prepayOption':
        return (
          <div className="col-span-2">
            <RHFTextField name="amount" label="Prepay Amount (€)" type="number" placeholder="80" min="1" />
            <p className="mt-2 text-xs text-gray-500">Will be deducted from in-app ordering during event</p>
          </div>
        );

      case 'ticketRequirement':
        return (
          <div className="col-span-2">
            <RHFCustomDropdown
              name="ticketType"
              label="Required Ticket Type"
              placeholder="Select required ticket"
              options={TICKET_TYPE_OPTIONS}
              showNone={false}
            />
            <p className="mt-2 text-xs text-gray-500">User must own or purchase this ticket type</p>
          </div>
        );

      case 'customText':
        return (
          <div className="col-span-2">
            <RHFTextField name="customText" label="Custom Condition Text" placeholder="Enter custom condition requirements..." multiline rows={3} />
          </div>
        );

      default:
        return null;
    }
  };

  const isLoading = addLoading || updateLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-y-auto md:max-w-[750px]"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Reservation' : 'Create New Reservation'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-4 flex w-full flex-col gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <RHFSelectField name="reservationType" label="Reservation Type" placeholder="Select Type" options={RESERVATION_TYPE_OPTIONS} />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <RHFTextField name="availableReservations" label="Available Reservations" type="number" placeholder="5" min="1" />
                      <p className="mt-1 text-xs text-gray-500">How many of this type exist</p>
                    </div>

                    <div>
                      <RHFTextField name="maxCapacityPerReservation" label="Max Capacity" type="number" placeholder="8" min="1" />
                      <p className="mt-1 text-xs text-gray-500">Max people per reservation</p>
                    </div>
                  </div>
                </div>

                {/* Reservation Condition */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reservation Condition</h3>

                  <RHFCustomDropdown
                    name="conditionType"
                    label="Condition Type"
                    placeholder="Select condition"
                    options={CONDITION_OPTIONS}
                    showNone={false}
                  />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">{renderConditionFields()}</div>
                </div>

                {/* Event Link */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Link</h3>

                  {isLoadingEvents ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <RHFCustomDropdown
                        name="optionalEventId"
                        label="Optional Event Link"
                        placeholder="No linked event"
                        options={eventOptions}
                        isLoading={isLoadingEvents}
                        showNone={true}
                      />
                      <p className="text-xs text-gray-500">Shows on event page and in checkout</p>

                      {selectedEvent && eventDateRange && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                          <div className="flex gap-2">
                            <Info size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="text-xs text-blue-900 dark:text-blue-300">
                              <strong>Event Schedule:</strong> {selectedEvent.basicInfo.title}
                              <br />
                              <span>
                                From: {selectedEvent.schedule.startDateTime}
                                <br />
                                To: {selectedEvent.schedule.endDateTime}
                                <br />
                                <strong className="text-blue-700 dark:text-blue-200">
                                  Time Range: {eventDateRange.startTime} - {eventDateRange.endTime}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Timing Slots */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Timing Slots</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="timingSlotsEnabled"
                        checked={timingSlotsEnabled}
                        onCheckedChange={(checked) => {
                          setValue('timingSlotsEnabled', !!checked, { shouldDirty: true });
                          if (!checked) {
                            setDateTimeSlots([]);
                            setValidationErrors({});
                          }
                        }}
                      />
                      <Label htmlFor="timingSlotsEnabled" className="cursor-pointer text-sm">
                        Enable Timing Slots
                      </Label>
                    </div>
                  </div>

                  {timingSlotsEnabled && (
                    <>
                      {selectedEvent && eventDateRange && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                          <div className="flex gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-400" />
                            <div className="text-xs text-orange-900 dark:text-orange-300">
                              <strong>Important:</strong> All timing slots must be within the event schedule.
                              <br />
                              <strong>Allowed dates:</strong> {eventDateRange.minDate} to {eventDateRange.maxDate}
                              <br />
                              <strong>Allowed times:</strong> {eventDateRange.startTime} to {eventDateRange.endTime}
                              <br />
                              <strong className="text-red-700 dark:text-red-400">Time slots cannot overlap! Each date can only be added once!</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 rounded-lg border p-4">
                        {dateTimeSlots.map((dateSlot, dateIndex) => (
                          <div key={dateIndex} className="space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Date #{dateIndex + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDateSlot(dateIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>

                            <div>
                              <input
                                title="Select Date"
                                type="date"
                                value={dateSlot.date}
                                onChange={(e) => updateDateSlot(dateIndex, 'date', e.target.value)}
                                min={eventDateRange?.minDate}
                                max={eventDateRange?.maxDate}
                                className="w-full rounded-md border p-2 dark:bg-gray-700"
                              />
                              {validationErrors[`date-${dateIndex}`] && (
                                <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors[`date-${dateIndex}`]}</p>
                              )}
                            </div>

                            {validationErrors[`time-${dateIndex}-overlap`] && (
                              <div className="rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                                <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                                  ⚠️ {validationErrors[`time-${dateIndex}-overlap`]}
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              {dateSlot.timeSlots.map((timeSlot, timeIndex) => (
                                <div key={timeIndex} className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-1 items-center gap-2">
                                      <input
                                        type="time"
                                        title="Start time"
                                        value={timeSlot.startTime}
                                        onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'startTime', e.target.value)}
                                        className="flex-1 rounded-md border p-2 dark:bg-gray-700"
                                      />
                                      <span className="text-sm">to</span>
                                      <input
                                        type="time"
                                        title="End time"
                                        value={timeSlot.endTime}
                                        onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'endTime', e.target.value)}
                                        className="flex-1 rounded-md border p-2 dark:bg-gray-700"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                                      className="text-red-600"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                  <div className="ml-1 space-y-1">
                                    {timeSlot.startTime && timeSlot.endTime && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Selected: {convertTimeFormat(timeSlot.startTime, false)} - {convertTimeFormat(timeSlot.endTime, false)}
                                      </p>
                                    )}
                                    {Object.keys(validationErrors)
                                      .filter((key) => key.includes(`time-${dateIndex}-${timeIndex}`))
                                      .map((key) => (
                                        <p key={key} className="text-xs font-semibold text-red-600">
                                          • {validationErrors[key]}
                                        </p>
                                      ))}
                                  </div>
                                </div>
                              ))}
                              <Button type="button" variant="outline" size="sm" onClick={() => addTimeSlot(dateIndex)} className="w-full">
                                <Plus size={16} className="mr-2" />
                                Add Time Slot
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addDateSlot} className="w-full" disabled={selectedEvent && !eventDateRange}>
                          <Plus size={16} className="mr-2" />
                          Add Date
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Additional Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Settings</h3>

                  <RHFSelectField name="taxPercentage" label="Tax Percentage" placeholder="Select Tax %" options={TAX_OPTIONS} />

                  <div className="flex items-start gap-3 rounded-lg border-2 border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
                    <Checkbox
                      id="needsConfirmation"
                      checked={watch('needsConfirmation')}
                      onCheckedChange={(checked) => setValue('needsConfirmation', !!checked, { shouldDirty: true, shouldValidate: true })}
                      className="border-red-500 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
                    />
                    <div className="flex-1">
                      <Label htmlFor="needsConfirmation" className="cursor-pointer font-semibold text-red-900 dark:text-red-100">
                        Needs Confirmation <span className="text-red-600">*</span>
                      </Label>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        Reservation requests must be manually approved before payment. This is required for all reservations.
                      </p>
                      {formState.errors.needsConfirmation && (
                        <p className="mt-2 text-xs font-semibold text-red-700 dark:text-red-400">⚠️ {formState.errors.needsConfirmation.message}</p>
                      )}
                    </div>
                  </div>

                  {isEdit && <RHFSelectField name="status" label="Status" placeholder="Select Status" options={STATUS_OPTIONS} />}
                </div>

                {/* Info Box */}
                <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <Info size={20} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>Note:</strong> Users will receive reservation codes based on their entry count at reservation.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
                    disabled={isEdit ? !formState.isDirty : false}
                  >
                    {isEdit ? 'Update Reservation' : 'Create Reservation'}
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

export default ReservationModal;

// 'use client';

// import ButtonLoading from '@/components/common/button-loading';
// import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
// import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
// import { useAddReservationMutation, useUpdateReservationMutation } from '@/store/Reducer/reservations-api';
// import { getErrorMessage } from '@/utils/api';
// import { showError, showSuccess } from '@/utils/toast';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { AlertCircle, Info, Plus, Trash2 } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';

// // Import types and utilities
// import { DateTimeSlot, EventData, EventDateRange, ReservationFormValues, ReservationModalProps, ValidationErrors } from './types';

// import {
//   convertTo12HourFormat,
//   formatDateForInput,
//   isDateInRange,
//   isTimeInEventRange,
//   parseEventDateTime,
//   sortTimeSlots,
//   timeToMinutes,
//   validateNoOverlap,
// } from './utils';

// // ============================================
// // CONSTANTS (inline as requested)
// // ============================================
// const RESERVATION_TYPE_OPTIONS = [
//   { value: 'regular', label: 'Regular' },
//   { value: 'vip', label: 'VIP' },
//   { value: 'outdoor', label: 'Outdoor' },
//   { value: 'private', label: 'Private' },
//   { value: 'bar', label: 'Bar' },
//   { value: 'window', label: 'Window' },
// ];

// const CONDITION_OPTIONS = [
//   { label: 'Fixed Price - User pays full amount', value: 'fixedPrice' },
//   { label: 'Minimum Spend on Location', value: 'minimumSpendOnLocation' },
//   { label: 'Prepay Option - Deducted from ordering', value: 'prepayOption' },
//   { label: 'No Condition - Free reservation', value: 'noCondition' },
//   { label: 'Ticket Requirement', value: 'ticketRequirement' },
//   { label: 'Custom Text Condition', value: 'customText' },
// ];

// const TICKET_TYPE_OPTIONS = [
//   { label: 'VIP Event Pass', value: 'vipEventPass' },
//   { label: 'General Admission', value: 'generalAdmission' },
//   { label: 'Premium Access', value: 'premiumAccess' },
// ];

// const TAX_OPTIONS = [
//   { value: '0', label: '0%' },
//   { value: '5', label: '5%' },
//   { value: '13', label: '13%' },
//   { value: '25', label: '25%' },
// ];

// const STATUS_OPTIONS = [
//   { value: 'active', label: 'Active' },
//   { value: 'inactive', label: 'Inactive' },
// ];

// // ============================================
// // SCHEMA VALIDATION
// // ============================================
// const schema = Yup.object().shape({
//   reservationType: Yup.string().required('Reservation type is required'),
//   availableReservations: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
//     .required('Number of available reservations is required')
//     .min(1, 'Must be at least 1'),
//   maxCapacityPerReservation: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
//     .required('Max capacity is required')
//     .min(1, 'Must be at least 1'),
//   conditionType: Yup.string().required('Condition type is required'),
//   amount: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? null : value))
//     .nullable()
//     .when('conditionType', {
//       is: (val: string) => ['fixedPrice', 'minimumSpendOnLocation', 'prepayOption'].includes(val),
//       then: (schema) => schema.required('Amount is required for this condition').min(1, 'Must be at least 1'),
//       otherwise: (schema) => schema.nullable(),
//     }),
//   customText: Yup.string().when('conditionType', {
//     is: (val: string) => val === 'customText' || val === 'minimumSpendOnLocation',
//     then: (schema) => schema.required('Custom text is required'),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   ticketType: Yup.string().when('conditionType', {
//     is: 'ticketRequirement',
//     then: (schema) => schema.required('Ticket type is required'),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   taxPercentage: Yup.string().required('Tax percentage is required'),
//   needsConfirmation: Yup.boolean().required('Confirmation requirement is mandatory').oneOf([true], 'Needs confirmation must be enabled'),
//   optionalEventId: Yup.string().notRequired(),
//   timingSlotsEnabled: Yup.boolean(),
//   status: Yup.string().oneOf(['active', 'inactive'] as const),
// }) as Yup.ObjectSchema<ReservationFormValues>;

// const defaultValues: ReservationFormValues = {
//   reservationType: '',
//   availableReservations: 0,
//   maxCapacityPerReservation: 0,
//   conditionType: 'fixedPrice',
//   amount: null,
//   customText: '',
//   ticketType: '',
//   taxPercentage: '25',
//   needsConfirmation: true,
//   optionalEventId: '',
//   timingSlotsEnabled: false,
//   status: 'active',
// };

// // ============================================
// // MAIN COMPONENT
// // ============================================
// const ReservationModal = ({ open, onClose, isEdit = false, selectedData, organizationId }: ReservationModalProps) => {
//   const [addReservation, { isLoading: addLoading }] = useAddReservationMutation();
//   const [updateReservation, { isLoading: updateLoading }] = useUpdateReservationMutation();

//   const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([]);
//   const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

//   const { data: eventData, isLoading: isLoadingEvents } = useGetEventsByOrganizationQuery(
//     { organization: organizationId },
//     { skip: !organizationId }
//   );

//   const methods = useForm<ReservationFormValues>({
//     resolver: yupResolver(schema),
//     defaultValues,
//     mode: 'onChange',
//   });

//   const { reset, formState, watch, setValue } = methods;

//   const conditionType = watch('conditionType');
//   const timingSlotsEnabled = watch('timingSlotsEnabled');
//   const selectedEventId = watch('optionalEventId');

//   const eventOptions = useMemo(() => {
//     if (!eventData || !Array.isArray(eventData)) return [];
//     return eventData.map((event: EventData) => ({
//       value: event._id.toString(),
//       label: event.basicInfo?.title || 'No Title',
//     }));
//   }, [eventData]);

//   const selectedEvent = useMemo(() => {
//     if (!selectedEventId || !eventData || !Array.isArray(eventData)) return null;
//     return eventData.find((event: EventData) => event._id === selectedEventId) || null;
//   }, [selectedEventId, eventData]);

//   const eventDateRange = useMemo((): EventDateRange | null => {
//     if (!selectedEvent) return null;

//     const startDate = parseEventDateTime(selectedEvent.schedule.startDateTime);
//     const endDate = parseEventDateTime(selectedEvent.schedule.endDateTime);

//     if (!startDate || !endDate) return null;

//     const startTime12 = convertTo12HourFormat(`${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`);
//     const endTime12 = convertTo12HourFormat(`${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`);

//     return {
//       startDate,
//       endDate,
//       minDate: formatDateForInput(startDate),
//       maxDate: formatDateForInput(endDate),
//       startTime: startTime12,
//       endTime: endTime12,
//       startTimeMinutes: timeToMinutes(startTime12),
//       endTimeMinutes: timeToMinutes(endTime12),
//     };
//   }, [selectedEvent]);

//   // ============================================
//   // TIMING SLOTS VALIDATION
//   // ============================================
//   const validateTimingSlots = (): boolean => {
//     if (!timingSlotsEnabled || !selectedEvent || !eventDateRange) return true;

//     const errors: ValidationErrors = {};
//     let isValid = true;

//     // Check for duplicate dates
//     const dateCount = new Map<string, number>();
//     dateTimeSlots.forEach((slot) => {
//       if (slot.date) {
//         dateCount.set(slot.date, (dateCount.get(slot.date) || 0) + 1);
//       }
//     });

//     dateTimeSlots.forEach((dateSlot, dateIndex) => {
//       if (!dateSlot.date) {
//         errors[`date-${dateIndex}`] = 'Date is required';
//         isValid = false;
//         return;
//       }

//       // Check for duplicate dates
//       if (dateCount.get(dateSlot.date)! > 1) {
//         errors[`date-${dateIndex}`] = 'This date is already added. Each date can only be added once.';
//         isValid = false;
//       }

//       if (!isDateInRange(dateSlot.date, eventDateRange.startDate, eventDateRange.endDate)) {
//         errors[`date-${dateIndex}`] = `Date must be between ${eventDateRange.minDate} and ${eventDateRange.maxDate}`;
//         isValid = false;
//       }

//       if (dateSlot.timeSlots.length === 0) {
//         errors[`date-${dateIndex}-slots`] = 'At least one time slot is required';
//         isValid = false;
//         return;
//       }

//       dateSlot.timeSlots.forEach((timeSlot, timeIndex) => {
//         if (!timeSlot.startTime || !timeSlot.endTime) {
//           errors[`time-${dateIndex}-${timeIndex}`] = 'Both start and end times are required';
//           isValid = false;
//           return;
//         }

//         const startMinutes = timeToMinutes(timeSlot.startTime);
//         const endMinutes = timeToMinutes(timeSlot.endTime);

//         if (startMinutes >= endMinutes) {
//           errors[`time-${dateIndex}-${timeIndex}-order`] = 'Start time must be before end time';
//           isValid = false;
//         }

//         const startValidation = isTimeInEventRange(timeSlot.startTime, dateSlot.date, eventDateRange);
//         if (!startValidation.valid && startValidation.reason) {
//           errors[`time-${dateIndex}-${timeIndex}-start`] = startValidation.reason;
//           isValid = false;
//         }

//         const endValidation = isTimeInEventRange(timeSlot.endTime, dateSlot.date, eventDateRange);
//         if (!endValidation.valid && endValidation.reason) {
//           errors[`time-${dateIndex}-${timeIndex}-end`] = endValidation.reason;
//           isValid = false;
//         }
//       });

//       const overlapCheck = validateNoOverlap(dateSlot.timeSlots);
//       if (!overlapCheck.valid && overlapCheck.overlappingIndices) {
//         const [i, j] = overlapCheck.overlappingIndices;
//         errors[`time-${dateIndex}-overlap`] = 'Time slots cannot overlap';
//         errors[`time-${dateIndex}-${i}-overlap`] = `Overlaps with slot ${j + 1}`;
//         errors[`time-${dateIndex}-${j}-overlap`] = `Overlaps with slot ${i + 1}`;
//         isValid = false;
//       }
//     });

//     setValidationErrors(errors);
//     return isValid;
//   };

//   // ============================================
//   // TIMING SLOTS MANAGEMENT
//   // ============================================
//   const addDateSlot = () => {
//     setDateTimeSlots([...dateTimeSlots, { date: eventDateRange?.minDate || '', timeSlots: [{ startTime: '', endTime: '' }] }]);
//   };

//   const removeDateSlot = (dateIndex: number) => {
//     setDateTimeSlots(dateTimeSlots.filter((_, i) => i !== dateIndex));
//     const newErrors = { ...validationErrors };
//     Object.keys(newErrors).forEach((key) => {
//       if (key.startsWith(`date-${dateIndex}`) || key.startsWith(`time-${dateIndex}`)) {
//         delete newErrors[key];
//       }
//     });
//     setValidationErrors(newErrors);
//   };

//   const addTimeSlot = (dateIndex: number) => {
//     const updated = [...dateTimeSlots];
//     updated[dateIndex].timeSlots.push({ startTime: '', endTime: '' });
//     setDateTimeSlots(updated);
//   };

//   const removeTimeSlot = (dateIndex: number, timeIndex: number) => {
//     const updated = [...dateTimeSlots];
//     updated[dateIndex].timeSlots = updated[dateIndex].timeSlots.filter((_, i) => i !== timeIndex);
//     setDateTimeSlots(updated);

//     const newErrors = { ...validationErrors };
//     Object.keys(newErrors).forEach((key) => {
//       if (key.includes(`time-${dateIndex}-${timeIndex}`)) {
//         delete newErrors[key];
//       }
//     });
//     setValidationErrors(newErrors);
//   };

//   const updateDateSlot = (dateIndex: number, field: string, value: string) => {
//     const updated = [...dateTimeSlots];
//     (updated[dateIndex] as any)[field] = value;
//     setDateTimeSlots(updated);

//     const newErrors = { ...validationErrors };
//     delete newErrors[`date-${dateIndex}`];

//     // Check for duplicate dates in real-time
//     if (field === 'date' && value) {
//       const duplicateIndex = updated.findIndex((slot, idx) => idx !== dateIndex && slot.date === value);
//       if (duplicateIndex !== -1) {
//         newErrors[`date-${dateIndex}`] = 'This date is already added. Each date can only be added once.';
//         newErrors[`date-${duplicateIndex}`] = 'This date is already added. Each date can only be added once.';
//       } else {
//         // Clear duplicate error from other slot if it was fixed
//         updated.forEach((_, idx) => {
//           delete newErrors[`date-${idx}`];
//         });
//       }
//     }

//     setValidationErrors(newErrors);
//   };

//   const updateTimeSlot = (dateIndex: number, timeIndex: number, field: string, value: string) => {
//     const updated = [...dateTimeSlots];
//     (updated[dateIndex].timeSlots[timeIndex] as any)[field] = value;
//     setDateTimeSlots(updated);

//     const newErrors = { ...validationErrors };
//     Object.keys(newErrors).forEach((key) => {
//       if (key.includes(`time-${dateIndex}-${timeIndex}`)) {
//         delete newErrors[key];
//       }
//     });

//     if (selectedEvent && eventDateRange && updated[dateIndex].date) {
//       const timeSlot = updated[dateIndex].timeSlots[timeIndex];

//       if (timeSlot.startTime) {
//         const startValidation = isTimeInEventRange(timeSlot.startTime, updated[dateIndex].date, eventDateRange);
//         if (!startValidation.valid && startValidation.reason) {
//           newErrors[`time-${dateIndex}-${timeIndex}-start`] = startValidation.reason;
//         }
//       }

//       if (timeSlot.endTime) {
//         const endValidation = isTimeInEventRange(timeSlot.endTime, updated[dateIndex].date, eventDateRange);
//         if (!endValidation.valid && endValidation.reason) {
//           newErrors[`time-${dateIndex}-${timeIndex}-end`] = endValidation.reason;
//         }
//       }

//       if (timeSlot.startTime && timeSlot.endTime) {
//         const startMinutes = timeToMinutes(timeSlot.startTime);
//         const endMinutes = timeToMinutes(timeSlot.endTime);

//         if (startMinutes >= endMinutes) {
//           newErrors[`time-${dateIndex}-${timeIndex}-order`] = 'Start time must be before end time';
//         }

//         const overlapCheck = validateNoOverlap(updated[dateIndex].timeSlots);
//         if (!overlapCheck.valid && overlapCheck.overlappingIndices) {
//           const [i, j] = overlapCheck.overlappingIndices;
//           newErrors[`time-${dateIndex}-overlap`] = 'Time slots cannot overlap';
//           newErrors[`time-${dateIndex}-${i}-overlap`] = `Overlaps with slot ${j + 1}`;
//           newErrors[`time-${dateIndex}-${j}-overlap`] = `Overlaps with slot ${i + 1}`;
//         } else {
//           delete newErrors[`time-${dateIndex}-overlap`];
//           updated[dateIndex].timeSlots.forEach((_, idx) => {
//             delete newErrors[`time-${dateIndex}-${idx}-overlap`];
//           });
//         }
//       }
//     }

//     setValidationErrors(newErrors);
//   };

//   useEffect(() => {
//     if (selectedEventId && timingSlotsEnabled) {
//       setDateTimeSlots([]);
//       setValidationErrors({});
//     }
//   }, [selectedEventId, timingSlotsEnabled]);

//   useEffect(() => {
//     if (open && isEdit && selectedData) {
//       const mappedData: ReservationFormValues = {
//         reservationType: selectedData?.reservationType || '',
//         availableReservations: selectedData?.availableReservations || 0,
//         maxCapacityPerReservation: selectedData?.maxCapacityPerReservation || 0,
//         conditionType: selectedData?.conditionType || 'fixedPrice',
//         amount: selectedData?.amount || null,
//         customText: selectedData?.customText || '',
//         ticketType: selectedData?.ticketType || '',
//         taxPercentage: selectedData?.taxPercentage?.toString() || '25',
//         needsConfirmation: selectedData?.needsConfirmation ?? true,
//         optionalEventId: selectedData?.optionalEventId?._id || selectedData?.optionalEventId || '',
//         timingSlotsEnabled: selectedData?.timingSlots?.enabled || false,
//         status: selectedData?.status || 'active',
//       };

//       if (selectedData?.timingSlots?.dateTimeSlots) {
//         setDateTimeSlots(selectedData.timingSlots.dateTimeSlots);
//       }

//       reset(mappedData);
//     } else if (open && !isEdit) {
//       reset(defaultValues);
//       setDateTimeSlots([]);
//       setValidationErrors({});
//     }
//   }, [open, isEdit, selectedData, reset]);

//   const handleSubmit = async (formData: ReservationFormValues) => {
//     try {
//       if (!formData.needsConfirmation) {
//         showError('Needs confirmation must be enabled for all reservations');
//         return;
//       }

//       if (formData.timingSlotsEnabled) {
//         if (dateTimeSlots.length === 0) {
//           showError('Please add at least one date with time slots');
//           return;
//         }

//         for (const dateSlot of dateTimeSlots) {
//           if (!dateSlot.date) {
//             showError('All date slots must have a date selected');
//             return;
//           }
//           if (dateSlot.timeSlots.length === 0) {
//             showError('Each date must have at least one time slot');
//             return;
//           }
//           for (const timeSlot of dateSlot.timeSlots) {
//             if (!timeSlot.startTime || !timeSlot.endTime) {
//               showError('All time slots must have start and end times');
//               return;
//             }
//           }
//         }

//         if (selectedEvent && !validateTimingSlots()) {
//           showError('Please fix all validation errors before submitting');
//           return;
//         }
//       }

//       const payload: any = {
//         reservationType: formData.reservationType,
//         availableReservations: Number(formData.availableReservations),
//         maxCapacityPerReservation: Number(formData.maxCapacityPerReservation),
//         organizationId: organizationId,
//         conditionType: formData.conditionType,
//         taxPercentage: formData.taxPercentage,
//         needsConfirmation: formData.needsConfirmation,
//         status: formData.status,
//       };

//       switch (formData.conditionType) {
//         case 'fixedPrice':
//         case 'prepayOption':
//           payload.amount = Number(formData.amount);
//           break;
//         case 'minimumSpendOnLocation':
//           payload.amount = Number(formData.amount);
//           payload.customText = formData.customText;
//           break;
//         case 'ticketRequirement':
//           payload.ticketType = formData.ticketType;
//           break;
//         case 'customText':
//           payload.customText = formData.customText;
//           break;
//       }

//       if (formData.optionalEventId) {
//         payload.optionalEventId = formData.optionalEventId;
//       }

//       const formattedDateTimeSlots = dateTimeSlots.map((dateSlot) => ({
//         date: dateSlot.date,
//         timeSlots: sortTimeSlots(dateSlot.timeSlots).map((timeSlot) => ({
//           startTime: convertTo12HourFormat(timeSlot.startTime),
//           endTime: convertTo12HourFormat(timeSlot.endTime),
//         })),
//       }));

//       payload.timingSlots = {
//         enabled: formData.timingSlotsEnabled,
//         dateTimeSlots: formData.timingSlotsEnabled ? formattedDateTimeSlots : [],
//       };

//       if (isEdit && selectedData) {
//         payload.status = formData.status;
//         payload.id = selectedData._id;
//       }

//       console.log('payload', payload);

//       const response = isEdit ? await updateReservation(payload).unwrap() : await addReservation(payload).unwrap();

//       if (!response) {
//         showError('No response from server. Please try again later.');
//         return;
//       }

//       if (response?.error) {
//         showError(getErrorMessage(response.error));
//         return;
//       }

//       showSuccess(response?.message || (isEdit ? 'Reservation updated successfully' : 'Reservation created successfully'));

//       methods.reset(defaultValues);
//       setDateTimeSlots([]);
//       setValidationErrors({});
//       onClose();
//     } catch (error) {
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);
//     }
//   };

//   const handleClose = () => {
//     reset(defaultValues);
//     setDateTimeSlots([]);
//     setValidationErrors({});
//     onClose();
//   };

//   const renderConditionFields = () => {
//     switch (conditionType) {
//       case 'fixedPrice':
//         return (
//           <div className="col-span-2">
//             <RHFTextField name="amount" label="Fixed Price (€)" type="number" placeholder="150" min="1" />
//           </div>
//         );

//       case 'minimumSpendOnLocation':
//         return (
//           <div className="col-span-2 space-y-4">
//             <RHFTextField name="amount" label="Minimum Spend Amount (€)" type="number" placeholder="100" min="1" />
//             <RHFTextField
//               name="customText"
//               label="Custom Requirement Text"
//               placeholder="e.g., Purchase at least two bottle packs"
//               multiline
//               rows={2}
//             />
//             <p className="text-xs text-gray-500">Not automatically tracked, communicated to guest</p>
//           </div>
//         );

//       case 'prepayOption':
//         return (
//           <div className="col-span-2">
//             <RHFTextField name="amount" label="Prepay Amount (€)" type="number" placeholder="80" min="1" />
//             <p className="mt-2 text-xs text-gray-500">Will be deducted from in-app ordering during event</p>
//           </div>
//         );

//       case 'ticketRequirement':
//         return (
//           <div className="col-span-2">
//             <RHFCustomDropdown
//               name="ticketType"
//               label="Required Ticket Type"
//               placeholder="Select required ticket"
//               options={TICKET_TYPE_OPTIONS}
//               showNone={false}
//             />
//             <p className="mt-2 text-xs text-gray-500">User must own or purchase this ticket type</p>
//           </div>
//         );

//       case 'customText':
//         return (
//           <div className="col-span-2">
//             <RHFTextField name="customText" label="Custom Condition Text" placeholder="Enter custom condition requirements..." multiline rows={3} />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const isLoading = addLoading || updateLoading;

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0">
//         <DialogContent
//           aria-describedby={undefined}
//           className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-y-auto md:max-w-[750px]"
//         >
//           <DialogHeader>
//             <DialogTitle>{isEdit ? 'Edit Reservation' : 'Create New Reservation'}</DialogTitle>
//           </DialogHeader>

//           <div className="w-full">
//             <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
//               <div className="mt-4 flex w-full flex-col gap-6">
//                 {/* Basic Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Basic Information</h3>

//                   <RHFSelectField name="reservationType" label="Reservation Type" placeholder="Select Type" options={RESERVATION_TYPE_OPTIONS} />

//                   <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
//                     <div>
//                       <RHFTextField name="availableReservations" label="Available Reservations" type="number" placeholder="5" min="1" />
//                       <p className="mt-1 text-xs text-gray-500">How many of this type exist</p>
//                     </div>

//                     <div>
//                       <RHFTextField name="maxCapacityPerReservation" label="Max Capacity" type="number" placeholder="8" min="1" />
//                       <p className="mt-1 text-xs text-gray-500">Max people per reservation</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Reservation Condition */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Reservation Condition</h3>

//                   <RHFCustomDropdown
//                     name="conditionType"
//                     label="Condition Type"
//                     placeholder="Select condition"
//                     options={CONDITION_OPTIONS}
//                     showNone={false}
//                   />

//                   <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">{renderConditionFields()}</div>
//                 </div>

//                 {/* Event Link */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Event Link</h3>

//                   {isLoadingEvents ? (
//                     <div className="space-y-2">
//                       <Skeleton className="h-3 w-32" />
//                       <Skeleton className="h-10 w-full" />
//                     </div>
//                   ) : (
//                     <>
//                       <RHFCustomDropdown
//                         name="optionalEventId"
//                         label="Optional Event Link"
//                         placeholder="No linked event"
//                         options={eventOptions}
//                         isLoading={isLoadingEvents}
//                         showNone={true}
//                       />
//                       <p className="text-xs text-gray-500">Shows on event page and in checkout</p>

//                       {selectedEvent && eventDateRange && (
//                         <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
//                           <div className="flex gap-2">
//                             <Info size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                             <div className="text-xs text-blue-900 dark:text-blue-300">
//                               <strong>Event Schedule:</strong> {selectedEvent.basicInfo.title}
//                               <br />
//                               <span>
//                                 From: {selectedEvent.schedule.startDateTime}
//                                 <br />
//                                 To: {selectedEvent.schedule.endDateTime}
//                                 <br />
//                                 <strong className="text-blue-700 dark:text-blue-200">
//                                   Time Range: {eventDateRange.startTime} - {eventDateRange.endTime}
//                                 </strong>
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Timing Slots */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold">Timing Slots</h3>
//                     <div className="flex items-center gap-2">
//                       <Checkbox
//                         id="timingSlotsEnabled"
//                         checked={timingSlotsEnabled}
//                         onCheckedChange={(checked) => {
//                           setValue('timingSlotsEnabled', !!checked, { shouldDirty: true });
//                           if (!checked) {
//                             setDateTimeSlots([]);
//                             setValidationErrors({});
//                           }
//                         }}
//                       />
//                       <Label htmlFor="timingSlotsEnabled" className="cursor-pointer text-sm">
//                         Enable Timing Slots
//                       </Label>
//                     </div>
//                   </div>

//                   {timingSlotsEnabled && (
//                     <>
//                       {selectedEvent && eventDateRange && (
//                         <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
//                           <div className="flex gap-2">
//                             <AlertCircle size={16} className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-400" />
//                             <div className="text-xs text-orange-900 dark:text-orange-300">
//                               <strong>Important:</strong> All timing slots must be within the event schedule.
//                               <br />
//                               <strong>Allowed dates:</strong> {eventDateRange.minDate} to {eventDateRange.maxDate}
//                               <br />
//                               <strong>Allowed times:</strong> {eventDateRange.startTime} to {eventDateRange.endTime}
//                               <br />
//                               <strong className="text-red-700 dark:text-red-400">Time slots cannot overlap! Each date can only be added once!</strong>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="space-y-4 rounded-lg border p-4">
//                         {dateTimeSlots.map((dateSlot, dateIndex) => (
//                           <div key={dateIndex} className="space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
//                             <div className="flex items-center justify-between">
//                               <h4 className="font-medium">Date #{dateIndex + 1}</h4>
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeDateSlot(dateIndex)}
//                                 className="text-red-600 hover:text-red-700"
//                               >
//                                 <Trash2 size={16} />
//                               </Button>
//                             </div>

//                             <div>
//                               <input
//                                 type="date"
//                                 title="Select Date"
//                                 value={dateSlot.date}
//                                 onChange={(e) => updateDateSlot(dateIndex, 'date', e.target.value)}
//                                 min={eventDateRange?.minDate}
//                                 max={eventDateRange?.maxDate}
//                                 className="w-full rounded-md border p-2 dark:bg-gray-700"
//                               />
//                               {validationErrors[`date-${dateIndex}`] && (
//                                 <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors[`date-${dateIndex}`]}</p>
//                               )}
//                             </div>

//                             {validationErrors[`time-${dateIndex}-overlap`] && (
//                               <div className="rounded-md bg-red-50 p-2 dark:bg-red-900/20">
//                                 <p className="text-xs font-semibold text-red-700 dark:text-red-400">
//                                   ⚠️ {validationErrors[`time-${dateIndex}-overlap`]}
//                                 </p>
//                               </div>
//                             )}

//                             <div className="space-y-2">
//                               {dateSlot.timeSlots.map((timeSlot, timeIndex) => (
//                                 <div key={timeIndex} className="space-y-1">
//                                   <div className="flex items-center gap-2">
//                                     <div className="flex flex-1 items-center gap-2">
//                                       <input
//                                         type="time"
//                                         title="Start time"
//                                         value={timeSlot.startTime}
//                                         onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'startTime', e.target.value)}
//                                         className="flex-1 rounded-md border p-2 dark:bg-gray-700"
//                                       />
//                                       <span className="text-sm">to</span>
//                                       <input
//                                         type="time"
//                                         title="End time"
//                                         value={timeSlot.endTime}
//                                         onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'endTime', e.target.value)}
//                                         className="flex-1 rounded-md border p-2 dark:bg-gray-700"
//                                       />
//                                     </div>
//                                     <Button
//                                       type="button"
//                                       variant="ghost"
//                                       size="sm"
//                                       onClick={() => removeTimeSlot(dateIndex, timeIndex)}
//                                       className="text-red-600"
//                                     >
//                                       <Trash2 size={16} />
//                                     </Button>
//                                   </div>
//                                   <div className="ml-1 space-y-1">
//                                     {timeSlot.startTime && timeSlot.endTime && (
//                                       <p className="text-xs text-gray-600 dark:text-gray-400">
//                                         Selected: {convertTo12HourFormat(timeSlot.startTime)} - {convertTo12HourFormat(timeSlot.endTime)}
//                                       </p>
//                                     )}
//                                     {Object.keys(validationErrors)
//                                       .filter((key) => key.includes(`time-${dateIndex}-${timeIndex}`))
//                                       .map((key) => (
//                                         <p key={key} className="text-xs font-semibold text-red-600">
//                                           • {validationErrors[key]}
//                                         </p>
//                                       ))}
//                                   </div>
//                                 </div>
//                               ))}
//                               <Button type="button" variant="outline" size="sm" onClick={() => addTimeSlot(dateIndex)} className="w-full">
//                                 <Plus size={16} className="mr-2" />
//                                 Add Time Slot
//                               </Button>
//                             </div>
//                           </div>
//                         ))}

//                         <Button type="button" variant="outline" onClick={addDateSlot} className="w-full" disabled={selectedEvent && !eventDateRange}>
//                           <Plus size={16} className="mr-2" />
//                           Add Date
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Additional Settings */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Additional Settings</h3>

//                   <RHFSelectField name="taxPercentage" label="Tax Percentage" placeholder="Select Tax %" options={TAX_OPTIONS} />

//                   <div className="flex items-start gap-3 rounded-lg border-2 border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
//                     <Checkbox
//                       id="needsConfirmation"
//                       checked={watch('needsConfirmation')}
//                       onCheckedChange={(checked) => setValue('needsConfirmation', !!checked, { shouldDirty: true, shouldValidate: true })}
//                       className="border-red-500 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
//                     />
//                     <div className="flex-1">
//                       <Label htmlFor="needsConfirmation" className="cursor-pointer font-semibold text-red-900 dark:text-red-100">
//                         Needs Confirmation <span className="text-red-600">*</span>
//                       </Label>
//                       <p className="mt-1 text-sm text-red-700 dark:text-red-300">Reservation requests must be manually approved before payment.</p>
//                       {formState.errors.needsConfirmation && (
//                         <p className="mt-2 text-xs font-semibold text-red-700 dark:text-red-400">⚠️ {formState.errors.needsConfirmation.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   {isEdit && <RHFSelectField name="status" label="Status" placeholder="Select Status" options={STATUS_OPTIONS} />}
//                 </div>

//                 {/* Info Box */}
//                 <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
//                   <Info size={20} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                   <div className="text-sm text-blue-900 dark:text-blue-300">
//                     <strong>Note:</strong> Users will receive reservation codes based on their entry count at reservation.
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-6 flex items-center justify-center gap-3">
//                 <Button type="button" variant="outline" onClick={handleClose} className="px-6">
//                   Cancel
//                 </Button>

//                 {isLoading ? (
//                   <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
//                     <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
//                   </Button>
//                 ) : (
//                   <Button
//                     type="submit"
//                     className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
//                     disabled={isEdit ? !formState.isDirty : false}
//                   >
//                     {isEdit ? 'Update Reservation' : 'Create Reservation'}
//                   </Button>
//                 )}
//               </div>
//             </FormProvider>
//           </div>
//         </DialogContent>
//       </DialogOverlay>
//     </Dialog>
//   );
// };

// export default ReservationModal;
