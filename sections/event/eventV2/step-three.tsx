'use client';

import ButtonLoading from '@/components/common/button-loading';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { fDate, formatStr } from '@/utils/format-time';
import { showError } from '@/utils/toast';
import { AlertCircle, Calendar } from 'lucide-react';
import * as React from 'react';
import type { StepThreeProps } from './types';
import TimeSlotConfigModal from './timelotConfig';

// Reusable Components
const FeatureSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => <div className={`mb-4 overflow-hidden rounded-lg border ${className}`}>{children}</div>;

const FeatureSectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="dark:bg-secondary bg-gray-50 p-3">
    <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
  </div>
);

const FeatureSectionContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dark:bg-secondary border-t bg-white p-4">{children}</div>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
    {icon}
    {title}
  </h3>
);

const ToggleSwitch: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}> = ({ value, onChange, label, disabled = false }) => (
  <div className="dark:bg-secondary flex items-center justify-between rounded-lg bg-gray-50 p-3">
    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
    <button
      title="Toggle Switch"
      type="button"
      onClick={() => onChange(!value)}
      disabled={disabled}
      className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6 transform' : ''}`} />
    </button>
  </div>
);

const StepThree: React.FC<StepThreeProps> = ({
  methods,
  watch,
  setValue,
  loading,
  isAddingEvent,
  isUpdatingEvent,
  setStep,
  handleSkipTicketing,
  onSubmit,
}) => {
  const { formState } = methods;
  const isLoading = loading || isAddingEvent || isUpdatingEvent;

  // Watch all ticketing feature toggles
  const timeslotEnabled = watch('ticketing.timingSlots.enabled') || false;
  const repeatableEnabled = watch('ticketing.repeatable.isRepeatable') || false;
  const resaleProtection = watch('ticketing.resaleProtection') || 'none';
  const earlyBirdEnabled = watch('ticketing.timeSensitivePricing.earlyBird.enabled') || false;
  const lastMinuteEnabled = watch('ticketing.timeSensitivePricing.lastMinute.enabled') || false;
  const fasttrackEnabled = watch('ticketing.fastTrackEntry.enabled') || false;
  const reservationEnabled = watch('ticketing.requiresReservation.enabled') || false;
  const transferFee = watch('ticketing.transferFee');
  const transferEnabled = transferFee !== null && transferFee !== undefined;
  const baseQuantity = watch('ticketing.quantity') || 0;
  const publishType = watch('ticketing.publishSettings.publishType') || 'instant';

  // Time slot config state
  const [showTimeSlotModal, setShowTimeSlotModal] = React.useState(false);
  const [timeSlotConfig, setTimeSlotConfig] = React.useState<any>(null);

  // Update the handleTimeSlotSave function in step-three.tsx
  const handleTimeSlotSave = (config: any) => {
    // Validate time boundaries using form's fromTime and endTime (24-hour format)
    const validateTimeSlot = (slotStartTime: string, slotEndTime: string): boolean => {
      if (!fromTime || !endTime) return true;

      // Parse 24-hour format times from form
      const [eventStartHours, eventStartMinutes] = fromTime.split(':').map(Number);
      const [eventEndHours, eventEndMinutes] = endTime.split(':').map(Number);

      // Convert to minutes for comparison
      const eventStartTotalMinutes = eventStartHours * 60 + eventStartMinutes;
      const eventEndTotalMinutes = eventEndHours * 60 + eventEndMinutes;

      // Convert slot times (12-hour format) to minutes
      const convert12To24Minutes = (time12h: string): number | null => {
        if (!time12h || !time12h.includes(' ')) return null;

        const [time, periodRaw] = time12h.split(' ');
        const period = (periodRaw || '').toUpperCase();
        const [hoursStr, minutesStr] = time.split(':');
        let hours = Number(hoursStr);
        const minutes = Number(minutesStr);

        if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes < 0 || minutes > 59) {
          return null;
        }

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        if (hours < 0 || hours > 23) {
          return null;
        }

        return hours * 60 + minutes;
      };

      const slotStartMinutes = convert12To24Minutes(slotStartTime);
      const slotEndMinutes = convert12To24Minutes(slotEndTime);

      if (slotStartMinutes === null || slotEndMinutes === null) {
        return false;
      }

      // Check if slot times are within event boundaries
      if (slotStartMinutes < eventStartTotalMinutes || slotStartMinutes > eventEndTotalMinutes) {
        return false;
      }

      if (slotEndMinutes < eventStartTotalMinutes || slotEndMinutes > eventEndTotalMinutes) {
        return false;
      }

      if (slotEndMinutes <= slotStartMinutes) {
        return false;
      }

      return true;
    };

    // Validate all time slots before saving
    for (const dateSlot of config) {
      for (const slot of dateSlot.timeSlots) {
        if (!validateTimeSlot(slot.startTime, slot.endTime)) {
          showError(`Time slot ${slot.startTime} - ${slot.endTime} is outside event time range (${fromTime} - ${endTime})`);
          return;
        }
      }
    }

    // Convert 12-hour format back to 24-hour format for internal state
    const configWith24HourFormat = config.map((dateSlot: any) => ({
      date: dateSlot.date,
      timeSlots: dateSlot.timeSlots.map((slot: any) => {
        const convert12To24Hour = (time12h: string): string => {
          if (!time12h || !time12h.includes(' ')) return '';

          const [time, periodRaw] = time12h.split(' ');
          const period = (periodRaw || '').toUpperCase();
          const [hoursStr, minutesStr] = time.split(':');
          let hours = Number(hoursStr);
          const minutes = Number(minutesStr);

          if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes < 0 || minutes > 59) return '';

          if (period === 'PM' && hours !== 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }

          if (hours < 0 || hours > 23) return '';

          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };

        return {
          id: slot.id || `slot-${Date.now()}-${Math.random()}`,
          startTime: convert12To24Hour(slot.startTime),
          endTime: convert12To24Hour(slot.endTime),
          quantity: parseInt(slot.quantity) || 0,
        };
      }),
    }));

    setTimeSlotConfig(configWith24HourFormat);
    setValue('ticketing.timingSlots.dateTimeSlots', config, { shouldDirty: true });
  };

  // Convert 12-hour format back to 24-hour format for internal state
  // const handleTimeSlotSave = (config: any) => {
  //   // Get event time boundaries for validation
  //   const getEventTimeBoundaries = () => {
  //     if (!fromTime || !endTime) {
  //       return { startMinutes: 0, endMinutes: 1440 };
  //     }

  //     try {
  //       // Parse 24-hour format time from form (e.g., "13:00")
  //       const parseTime24Hour = (time24: string) => {
  //         const [hoursStr, minutesStr] = time24.split(':');
  //         const hours = parseInt(hoursStr, 10);
  //         const minutes = parseInt(minutesStr, 10);

  //         if (isNaN(hours) || isNaN(minutes)) return null;

  //         return hours * 60 + minutes;
  //       };

  //       const startMinutes = parseTime24Hour(fromTime);
  //       const endMinutes = parseTime24Hour(endTime);

  //       if (startMinutes === null || endMinutes === null) {
  //         console.warn('Failed to parse event times');
  //         return { startMinutes: 0, endMinutes: 1440 };
  //       }

  //       return { startMinutes, endMinutes };
  //     } catch (error) {
  //       console.warn('Error parsing event times:', error);
  //       return { startMinutes: 0, endMinutes: 1440 };
  //     }
  //   };

  //   const { startMinutes: eventStartMinutes, endMinutes: eventEndMinutes } = getEventTimeBoundaries();

  //   const timeToMinutes = (time: string): number => {
  //     const [hours, minutes] = time.split(':').map(Number);
  //     return hours * 60 + minutes;
  //   };

  //   const convert12To24Hour = (time12h: string): string => {
  //     const [time, period] = time12h.split(' ');
  //     const [hoursStr, minutesStr] = time.split(':');
  //     let hours = Number(hoursStr);
  //     const minutes = Number(minutesStr);

  //     if (period === 'PM' && hours !== 12) {
  //       hours += 12;
  //     } else if (period === 'AM' && hours === 12) {
  //       hours = 0;
  //     }

  //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  //   };

  //   // Validate all time slots are within event boundaries
  //   for (const dateSlot of config) {
  //     for (const slot of dateSlot.timeSlots) {
  //       const startTime24 = convert12To24Hour(slot.startTime);
  //       const endTime24 = convert12To24Hour(slot.endTime);

  //       const startMinutes = timeToMinutes(startTime24);
  //       const endMinutes = timeToMinutes(endTime24);

  //       if (startMinutes < eventStartMinutes || startMinutes > eventEndMinutes) {
  //         showError(`Time slot start time ${slot.startTime} is outside event time range`);
  //         return;
  //       }

  //       if (endMinutes < eventStartMinutes || endMinutes > eventEndMinutes) {
  //         showError(`Time slot end time ${slot.endTime} is outside event time range`);
  //         return;
  //       }

  //       if (endMinutes <= startMinutes) {
  //         showError('End time must be after start time for all slots');
  //         return;
  //       }
  //     }
  //   }

  //   const configWith24HourFormat = config.map((dateSlot: any) => ({
  //     date: dateSlot.date,
  //     timeSlots: dateSlot.timeSlots.map((slot: any) => ({
  //       id: slot.id || `slot-${Date.now()}-${Math.random()}`,
  //       startTime: convert12To24Hour(slot.startTime),
  //       endTime: convert12To24Hour(slot.endTime),
  //       quantity: parseInt(slot.quantity) || 0,
  //     })),
  //   }));

  //   setTimeSlotConfig(configWith24HourFormat);
  //   setValue('ticketing.timingSlots.dateTimeSlots', config, { shouldDirty: true });
  // };

  // Get event data for time slot constraints
  const fromDate = watch('fromDate');
  const fromTime = watch('fromTime');
  const endDate = watch('endDate');
  const endTime = watch('endTime');

  // const eventData = React.useMemo(() => {
  //   if (!fromDate || !endDate || !fromTime || !endTime) return null;

  //   const startDateTime = `${fDate(fromDate, formatStr.paramCase.db)} ${fromTime}`;
  //   const endDateTime = `${fDate(endDate, formatStr.paramCase.db)} ${endTime}`;

  //   return {
  //     _id: 'temp',
  //     schedule: {
  //       type: 'oneTime',
  //       startDateTime,
  //       endDateTime,
  //     },
  //   };
  // }, [fromDate, endDate, fromTime, endTime]);

  const eventData = React.useMemo(() => {
    if (!fromDate || !endDate || !fromTime || !endTime) return null;

    // Convert 24-hour time to 12-hour format for the modal
    const convertTo12Hour = (time24: string): string => {
      const [hours, minutes] = time24.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const startDateTime = `${fDate(fromDate, formatStr.paramCase.db)} ${convertTo12Hour(fromTime)}`;
    const endDateTime = `${fDate(endDate, formatStr.paramCase.db)} ${convertTo12Hour(endTime)}`;

    return {
      _id: 'temp',
      schedule: {
        type: 'oneTime',
        startDateTime,
        endDateTime,
      },
    };
  }, [fromDate, endDate, fromTime, endTime]);

  const validateTicketingFields = (): boolean => {
    const ticketing = watch('ticketing');

    if (!ticketing.title || ticketing.title.trim() === '') {
      showError('Please enter a ticket type');
      return false;
    }

    if (ticketing.price === undefined || ticketing.price === null || ticketing.price < 0) {
      showError('Please enter a valid price');
      return false;
    }

    if (ticketing.taxPercentage === undefined || ticketing.taxPercentage === null) {
      showError('Please select a tax percentage');
      return false;
    }

    if (timeslotEnabled) {
      if (!timeSlotConfig || timeSlotConfig.length === 0) {
        showError('Please configure time slots');
        return false;
      }
    } else {
      if (!ticketing.quantity || ticketing.quantity < 1) {
        showError('Please enter a valid quantity');
        return false;
      }
    }

    // Validate early bird pricing
    if (earlyBirdEnabled) {
      if (!ticketing.timeSensitivePricing.earlyBird.endDate) {
        showError('Please set early bird end date');
        return false;
      }
      const earlyBirdPrice = Number(ticketing.timeSensitivePricing.earlyBird.discountedPrice);
      if (isNaN(earlyBirdPrice) || earlyBirdPrice < 0) {
        showError('Please set a valid early bird discounted price');
        return false;
      }
    }

    // Validate last minute pricing
    if (lastMinuteEnabled) {
      if (!ticketing.timeSensitivePricing.lastMinute.startDate) {
        showError('Please set last minute start date');
        return false;
      }
      const lastMinutePrice = Number(ticketing.timeSensitivePricing.lastMinute.discountedPrice);
      if (isNaN(lastMinutePrice) || lastMinutePrice < 0) {
        showError('Please set a valid last minute discounted price');
        return false;
      }
    }

    // Validate fast track
    if (fasttrackEnabled) {
      const fasttrackQty = Number(ticketing.fastTrackEntry.quantity);
      const fasttrackPrice = Number(ticketing.fastTrackEntry.extraPrice);

      if (isNaN(fasttrackQty) || fasttrackQty < 1) {
        showError('Please set a valid fast track quantity');
        return false;
      }
      if (isNaN(fasttrackPrice) || fasttrackPrice < 0) {
        showError('Please set a valid fast track extra price');
        return false;
      }
      if (fasttrackQty > baseQuantity) {
        showError(`Fast track quantity cannot exceed base quantity (${baseQuantity})`);
        return false;
      }
    }

    // Validate repeatable
    if (repeatableEnabled) {
      const visits = Number(ticketing.repeatable.visits);
      if (isNaN(visits) || visits < 1) {
        showError('Please set a valid number of visits for repeatable ticket');
        return false;
      }
    }

    // Validate reservation
    if (reservationEnabled) {
      if (!ticketing.requiresReservation.type) {
        showError('Please select a reservation type');
        return false;
      }
    }

    // Validate transfer fee
    if (transferEnabled) {
      const transferFeeValue = Number(ticketing.transferFee);
      if (isNaN(transferFeeValue) || transferFeeValue < 0) {
        showError('Please set a valid transfer fee');
        return false;
      }
    }

    // Validate scheduled publish
    if (publishType === 'scheduled') {
      if (!ticketing.publishSettings.scheduledDate) {
        showError('Please set scheduled publish date and time');
        return false;
      }
    }

    return true;
  };

  // const validateTicketingFields = (): boolean => {
  //   const ticketing = watch('ticketing');

  //   if (!ticketing.title || ticketing.title.trim() === '') {
  //     showError('Please enter a ticket type');
  //     return false;
  //   }

  //   if (ticketing.price === undefined || ticketing.price === null || ticketing.price < 0) {
  //     showError('Please enter a valid price');
  //     return false;
  //   }

  //   if (ticketing.taxPercentage === undefined || ticketing.taxPercentage === null) {
  //     showError('Please select a tax percentage');
  //     return false;
  //   }

  //   if (timeslotEnabled) {
  //     if (!timeSlotConfig || timeSlotConfig.length === 0) {
  //       showError('Please configure time slots');
  //       return false;
  //     }
  //   } else {
  //     if (!ticketing.quantity || ticketing.quantity < 1) {
  //       showError('Please enter a valid quantity');
  //       return false;
  //     }
  //   }

  //   // Validate early bird pricing
  //   if (earlyBirdEnabled) {
  //     if (!ticketing.timeSensitivePricing.earlyBird.endDate) {
  //       showError('Please set early bird end date');
  //       return false;
  //     }
  //     if (ticketing.timeSensitivePricing.earlyBird.discountedPrice === undefined || ticketing.timeSensitivePricing.earlyBird.discountedPrice < 0) {
  //       showError('Please set early bird discounted price');
  //       return false;
  //     }
  //   }

  //   // Validate last minute pricing
  //   if (lastMinuteEnabled) {
  //     if (!ticketing.timeSensitivePricing.lastMinute.startDate) {
  //       showError('Please set last minute start date');
  //       return false;
  //     }
  //     if (ticketing.timeSensitivePricing.lastMinute.discountedPrice === undefined || ticketing.timeSensitivePricing.lastMinute.discountedPrice < 0) {
  //       showError('Please set last minute discounted price');
  //       return false;
  //     }
  //   }

  //   // Validate fast track
  //   if (fasttrackEnabled) {
  //     if (!ticketing.fastTrackEntry.quantity || ticketing.fastTrackEntry.quantity < 1) {
  //       showError('Please set fast track quantity');
  //       return false;
  //     }
  //     if (ticketing.fastTrackEntry.extraPrice === undefined || ticketing.fastTrackEntry.extraPrice < 0) {
  //       showError('Please set fast track extra price');
  //       return false;
  //     }
  //     if (ticketing.fastTrackEntry.quantity > baseQuantity) {
  //       showError(`Fast track quantity cannot exceed base quantity (${baseQuantity})`);
  //       return false;
  //     }
  //   }

  //   // Validate repeatable
  //   if (repeatableEnabled) {
  //     if (!ticketing.repeatable.visits || ticketing.repeatable.visits < 1) {
  //       showError('Please set number of visits for repeatable ticket');
  //       return false;
  //     }
  //   }

  //   // Validate reservation
  //   if (reservationEnabled) {
  //     if (!ticketing.requiresReservation.type) {
  //       showError('Please select a reservation type');
  //       return false;
  //     }
  //   }

  //   // Validate transfer fee
  //   if (transferEnabled) {
  //     if (ticketing.transferFee === undefined || ticketing.transferFee === null || ticketing.transferFee < 0) {
  //       showError('Please set a valid transfer fee');
  //       return false;
  //     }
  //   }

  //   // Validate scheduled publish
  //   if (publishType === 'scheduled') {
  //     if (!ticketing.publishSettings.scheduledDate) {
  //       showError('Please set scheduled publish date and time');
  //       return false;
  //     }
  //   }

  //   return true;
  // };

  // const handlePublish = async () => {
  //   if (!validateTicketingFields()) {
  //     return;
  //   }

  //   // Submit form
  //   await methods.handleSubmit(methods.getValues())();
  // };

  const handlePublish = () => {
    if (!validateTicketingFields()) {
      return;
    }

    // Submit form using react-hook-form's handleSubmit
    methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <div>
        <div className="mt-4 flex flex-col gap-6">
          {/* Required Fields Section */}
          <div className="dark:bg-secondary mb-3">
            <SectionHeader title="Required Fields" icon={<AlertCircle className="text-blue-600" size={20} />} />
            <div className="grid gap-4 md:grid-cols-2">
              <RHFTextField
                name="ticketing.title"
                label="Ticket Type"
                placeholder="e.g., General Admission, VIP Pass"
                className={`${formState.errors.ticketing?.title ? 'border-red-400 focus:border-red-400' : ''}`}
                disabled={isLoading}
              />

              <RHFTextField
                name="ticketing.quantity"
                label="Quantity"
                type="number"
                placeholder={timeslotEnabled ? 'Managed by time slots' : 'Enter quantity'}
                min="1"
                className={`${formState.errors.ticketing?.quantity ? 'border-red-400 focus:border-red-400' : ''}`}
                disabled={isLoading || timeslotEnabled}
              />

              <RHFTextField
                name="ticketing.price"
                label="Price (€)"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`${formState.errors.ticketing?.price ? 'border-red-400 focus:border-red-400' : ''}`}
                disabled={isLoading}
              />

              <RHFSelectField
                name="ticketing.taxPercentage"
                label="Tax Percentage"
                placeholder="Select tax rate"
                options={[
                  { label: '0%', value: '0' },
                  { label: '5%', value: '5' },
                  { label: '13%', value: '13' },
                  { label: '25%', value: '25' },
                ]}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Publishing Options */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">Publishing Options</h3>

            <FeatureSection>
              <div className="dark:bg-secondary bg-gray-50 p-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Publish Settings</span>
              </div>
              <div className="dark:bg-secondary border-t bg-white p-4">
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      value="instant"
                      checked={publishType === 'instant'}
                      onChange={(e) =>
                        setValue('ticketing.publishSettings.publishType', e.target.value as 'instant', {
                          shouldDirty: true,
                        })
                      }
                      disabled={isLoading}
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Instant Publish</span>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        Becomes immediately visible and available to users in the app once created and saved.
                      </p>
                    </div>
                  </label>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        value="scheduled"
                        checked={publishType === 'scheduled'}
                        onChange={(e) =>
                          setValue('ticketing.publishSettings.publishType', e.target.value as 'scheduled', {
                            shouldDirty: true,
                          })
                        }
                        disabled={isLoading}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Scheduled Publish</span>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Set a specific date and time when the ticket should automatically go live.
                        </p>
                      </div>
                    </label>

                    {publishType === 'scheduled' && (
                      <div className="mt-3 ml-7">
                        <RHFTextField
                          name="ticketing.publishSettings.scheduledDate"
                          label="Schedule Date & Time"
                          type="datetime-local"
                          disabled={isLoading}
                          required={publishType === 'scheduled'}
                        />
                      </div>
                    )}
                  </div>

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      value="manual"
                      checked={publishType === 'manual'}
                      onChange={(e) =>
                        setValue('ticketing.publishSettings.publishType', e.target.value as 'manual', {
                          shouldDirty: true,
                        })
                      }
                      disabled={isLoading}
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Manual Publish</span>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        Tickets remain hidden until you explicitly switch their status to Published using the admin panel.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </FeatureSection>
          </div>

          {/* Optional Features */}
          <div>
            <SectionHeader title="Optional Features" />

            {/* Timeslot Feature */}
            <FeatureSection>
              <ToggleSwitch
                value={timeslotEnabled}
                onChange={(val) => {
                  setValue('ticketing.timingSlots.enabled', val, {
                    shouldDirty: true,
                  });
                  if (!val) {
                    setValue('ticketing.timingSlots.dateTimeSlots', [], { shouldDirty: true });
                    setTimeSlotConfig(null);
                  }
                }}
                label="Time Slot Ticketing"
                disabled={isLoading}
              />
              {timeslotEnabled && (
                <FeatureSectionContent>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-1 inline" size={14} />
                    Divide event into bookable time windows. Manage via time slot configuration.
                  </p>
                  <button type="button" onClick={() => setShowTimeSlotModal(true)} className="cursor-pointer text-sm text-blue-600 hover:underline">
                    Configure Time Slots →
                  </button>
                  {timeSlotConfig && Array.isArray(timeSlotConfig) && timeSlotConfig.length > 0 && (
                    <div className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✓ Time slots configured: {timeSlotConfig.reduce((total: number, dts: any) => total + dts.timeSlots.length, 0)} slots across{' '}
                        {timeSlotConfig.length} date{timeSlotConfig.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </FeatureSectionContent>
              )}
            </FeatureSection>

            {/* Repeatable Feature */}
            <FeatureSection>
              <ToggleSwitch
                value={repeatableEnabled}
                onChange={(val) => {
                  setValue('ticketing.repeatable.isRepeatable', val, {
                    shouldDirty: true,
                  });
                  if (!val) {
                    setValue('ticketing.repeatable.visits', 1, { shouldDirty: true });
                  }
                }}
                label="Repeatable Tickets"
                disabled={isLoading}
              />
              {repeatableEnabled && (
                <FeatureSectionContent>
                  <RHFTextField
                    name="ticketing.repeatable.visits"
                    label="Number of visits per ticket"
                    type="number"
                    min="1"
                    max="99"
                    placeholder="1"
                    className="w-32"
                    disabled={isLoading}
                  />
                  {timeslotEnabled && <p className="mt-2 text-xs text-amber-600">⚠ With timeslots enabled, users must select multiple slots</p>}
                </FeatureSectionContent>
              )}
            </FeatureSection>

            {/* Resale Protection Feature */}
            <FeatureSection>
              <FeatureSectionHeader title="Resale Protection" />
              <FeatureSectionContent>
                <div className="space-y-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'nameSurname', label: 'Name + Surname' },
                    {
                      value: 'nameSurnamePid',
                      label: 'Name + Surname + PID/Date of Birth',
                    },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value={option.value}
                        checked={resaleProtection === option.value}
                        onChange={(e) =>
                          setValue('ticketing.resaleProtection', e.target.value, {
                            shouldDirty: true,
                          })
                        }
                        disabled={isLoading}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </FeatureSectionContent>
            </FeatureSection>

            {/* Transfer Fee Feature */}
            <FeatureSection>
              <ToggleSwitch
                value={transferEnabled}
                onChange={(val) => {
                  if (val) {
                    setValue('ticketing.transferFee', 0, {
                      shouldDirty: true,
                    });
                  } else {
                    setValue('ticketing.transferFee', null, {
                      shouldDirty: true,
                    });
                  }
                }}
                label="Transfer Fee"
                disabled={isLoading}
              />
              {transferEnabled && (
                <FeatureSectionContent>
                  <RHFTextField
                    name="ticketing.transferFee"
                    label="Transfer Fee (€)"
                    type="number"
                    placeholder="Enter Transfer Fee"
                    step="0.01"
                    min="0"
                    disabled={isLoading}
                  />
                </FeatureSectionContent>
              )}
            </FeatureSection>

            {/* Time Sensitive Pricing Feature */}
            <FeatureSection>
              <FeatureSectionHeader title="Time Sensitive Pricing" />
              <FeatureSectionContent>
                <div className="space-y-3">
                  {/* Early Bird Option */}
                  <div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={earlyBirdEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue('ticketing.timeSensitivePricing.earlyBird.enabled', checked, {
                            shouldDirty: true,
                          });
                          if (!checked) {
                            setValue('ticketing.timeSensitivePricing.earlyBird.endDate', '', {
                              shouldDirty: true,
                            });
                            setValue('ticketing.timeSensitivePricing.earlyBird.discountedPrice', 0, {
                              shouldDirty: true,
                            });
                          }
                        }}
                        disabled={isLoading}
                        className="h-4 w-4 rounded text-blue-600"
                      />
                      <span className="text-sm font-medium">Early Bird Pricing</span>
                    </label>

                    {earlyBirdEnabled && (
                      <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
                        <RHFTextField
                          name="ticketing.timeSensitivePricing.earlyBird.endDate"
                          label="End Date/Time"
                          type="datetime-local"
                          disabled={isLoading}
                          required={earlyBirdEnabled}
                        />
                        <RHFTextField
                          name="ticketing.timeSensitivePricing.earlyBird.discountedPrice"
                          label="Discounted Price (€)"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          disabled={isLoading}
                          required={earlyBirdEnabled}
                        />
                      </div>
                    )}
                  </div>

                  {/* Last Minute Option */}
                  <div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={lastMinuteEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue('ticketing.timeSensitivePricing.lastMinute.enabled', checked, {
                            shouldDirty: true,
                          });
                          if (!checked) {
                            setValue('ticketing.timeSensitivePricing.lastMinute.startDate', '', {
                              shouldDirty: true,
                            });
                            setValue('ticketing.timeSensitivePricing.lastMinute.discountedPrice', 0, {
                              shouldDirty: true,
                            });
                          }
                        }}
                        disabled={isLoading}
                        className="h-4 w-4 rounded text-blue-600"
                      />
                      <span className="text-sm font-medium">Last Minute Pricing</span>
                    </label>

                    {lastMinuteEnabled && (
                      <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
                        <RHFTextField
                          name="ticketing.timeSensitivePricing.lastMinute.startDate"
                          label="Start Date/Time"
                          type="datetime-local"
                          disabled={isLoading}
                          required={lastMinuteEnabled}
                        />
                        <RHFTextField
                          name="ticketing.timeSensitivePricing.lastMinute.discountedPrice"
                          label="Discounted Price (€)"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          disabled={isLoading}
                          required={lastMinuteEnabled}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </FeatureSectionContent>
            </FeatureSection>

            {/* Fast Track Feature */}
            <FeatureSection>
              <ToggleSwitch
                value={fasttrackEnabled}
                onChange={(val) => {
                  setValue('ticketing.fastTrackEntry.enabled', val, {
                    shouldDirty: true,
                  });
                  if (!val) {
                    setValue('ticketing.fastTrackEntry.quantity', 0, { shouldDirty: true });
                    setValue('ticketing.fastTrackEntry.extraPrice', 0, { shouldDirty: true });
                  }
                }}
                label="Fast Track Entry"
                disabled={isLoading}
              />
              {fasttrackEnabled && (
                <FeatureSectionContent>
                  <div className="space-y-3">
                    <RHFTextField
                      name="ticketing.fastTrackEntry.quantity"
                      label={`Fast Track Quantity (≤ ${baseQuantity || 'base quantity'})`}
                      type="number"
                      min="1"
                      max={baseQuantity || 999}
                      placeholder="1"
                      disabled={isLoading}
                    />
                    <RHFTextField
                      name="ticketing.fastTrackEntry.extraPrice"
                      label="Extra Price (€)"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                  </div>
                </FeatureSectionContent>
              )}
            </FeatureSection>

            {/* Reservation Feature */}
            <FeatureSection>
              <ToggleSwitch
                value={reservationEnabled}
                onChange={(val) => {
                  setValue('ticketing.requiresReservation.enabled', val, {
                    shouldDirty: true,
                  });
                  if (!val) {
                    setValue('ticketing.requiresReservation.type', '', { shouldDirty: true });
                  }
                }}
                label="Requires Reservation"
                disabled={isLoading}
              />
              {reservationEnabled && (
                <FeatureSectionContent>
                  <RHFSelectField
                    name="ticketing.requiresReservation.type"
                    label="Reservation Type"
                    placeholder="Select type"
                    options={[
                      { label: 'Any Reservation', value: 'any' },
                      { label: 'Table Only', value: 'table' },
                      { label: 'VIP Only', value: 'vip' },
                      { label: 'Booth Only', value: 'booth' },
                    ]}
                    disabled={isLoading}
                  />
                </FeatureSectionContent>
              )}
            </FeatureSection>
          </div>

          {/* Action Buttons */}
          <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
              disabled={isLoading}
            >
              Back
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleSkipTicketing}
              className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
              disabled={isLoading}
            >
              Skip
            </Button>

            {isLoading ? (
              <Button
                type="button"
                disabled
                className="bg-primary hover:bg-primary cursor-not-allowed rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
              >
                <ButtonLoading title="Publishing" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handlePublish}
                className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
              >
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      <TimeSlotConfigModal
        open={showTimeSlotModal}
        onClose={() => setShowTimeSlotModal(false)}
        onSave={handleTimeSlotSave}
        totalQuantity={baseQuantity}
        eventData={eventData}
        initialConfig={timeSlotConfig}
      />
    </>
  );
};

export default StepThree;
