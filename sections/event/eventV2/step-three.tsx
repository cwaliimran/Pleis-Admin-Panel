'use client';

import ButtonLoading from '@/components/common/button-loading';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
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
  // router,
  setStep,
  handleSkipTicketing,
}) => {
  const { formState } = methods;
  const isLoading = loading || isAddingEvent || isUpdatingEvent;

  // Watch all feature toggles
  const timeslotEnabled = watch('ticketing.timingSlots.enabled') || false;
  const repeatableEnabled = watch('ticketing.repeatable.isRepeatable') || false;
  const resaleProtection = watch('ticketing.resaleProtection') || 'none';
  const earlyBirdEnabled = watch('ticketing.timeSensitivePricing.earlyBird.enabled') || false;
  const lastMinuteEnabled = watch('ticketing.timeSensitivePricing.lastMinute.enabled') || false;
  const fasttrackEnabled = watch('ticketing.fastTrackEntry.enabled') || false;
  const reservationEnabled = watch('ticketing.requiresReservation.enabled') || false;
  const transferEnabled = watch('ticketing.transferFee') !== undefined && watch('ticketing.transferFee') !== null;
  const baseQuantity = watch('ticketing.quantity') || 0;
  const publishType = watch('ticketing.publishSettings.publishType') || 'instant';

  // Time slot config state
  const [showTimeSlotModal, setShowTimeSlotModal] = React.useState(false);
  const [timeSlotConfig, setTimeSlotConfig] = React.useState<any>(null);

  const handleTimeSlotSave = (config: any) => {
    setTimeSlotConfig(config);
    setValue('ticketing.timingSlots.dateTimeSlots', config, { shouldDirty: true });
  };

  // Get event data for time slot constraints
  const fromDate = watch('fromDate');
  const endDate = watch('endDate');
  const eventData = React.useMemo(() => {
    if (!fromDate || !endDate) return null;
    return {
      schedule: {
        type: 'oneTime',
        startDateTime: fromDate,
        endDateTime: endDate,
      },
    };
  }, [fromDate, endDate]);

  const handlePublish = () => {
    // Validate required ticketing fields
    const type = watch('ticketing.title');
    const quantity = watch('ticketing.quantity');
    const price = watch('ticketing.price');
    const tax = watch('ticketing.taxPercentage');

    if (!type || !price || tax === undefined || tax === null) {
      alert('Please fill in all required ticketing fields (Type, Price, Tax)');
      return;
    }

    if (!timeslotEnabled && (!quantity || quantity < 1)) {
      alert('Please enter a valid quantity');
      return;
    }

    if (timeslotEnabled && (!timeSlotConfig || timeSlotConfig.length === 0)) {
      alert('Please configure time slots');
      return;
    }

    // Submit form normally (onSubmit will include ticketing)
    methods.handleSubmit(methods.getValues())();
  };

  return (
    <>
      <div>
        <div className="mt-4 flex flex-col gap-6">
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
                    setValue('ticketing.repeatable.visits', 0, { shouldDirty: true });
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

// 'use client';

// import ButtonLoading from '@/components/common/button-loading';
// import { RHFSelectField, RHFTextField } from '@/components/rhf';
// import { Button } from '@/components/ui/button';
// import { AlertCircle, Calendar } from 'lucide-react';
// import * as React from 'react';
// import TimeSlotConfigModal from './timelotConfig';
// import type { StepThreeProps } from './types';

// // Reusable Components
// const FeatureSection: React.FC<{
//   children: React.ReactNode;
//   className?: string;
// }> = ({ children, className = '' }) => <div className={`mb-4 overflow-hidden rounded-lg border ${className}`}>{children}</div>;

// const FeatureSectionHeader: React.FC<{ title: string }> = ({ title }) => (
//   <div className="dark:bg-secondary bg-gray-50 p-3">
//     <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
//   </div>
// );

// const FeatureSectionContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <div className="dark:bg-secondary border-t bg-white p-4">{children}</div>
// );

// const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
//   <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
//     {icon}
//     {title}
//   </h3>
// );

// const ToggleSwitch: React.FC<{
//   value: boolean;
//   onChange: (value: boolean) => void;
//   label: string;
//   disabled?: boolean;
// }> = ({ value, onChange, label, disabled = false }) => (
//   <div className="dark:bg-secondary flex items-center justify-between rounded-lg bg-gray-50 p-3">
//     <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
//     <button
//       title="Toggle Switch"
//       type="button"
//       onClick={() => onChange(!value)}
//       disabled={disabled}
//       className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
//         value ? 'bg-blue-600' : 'bg-gray-300'
//       } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
//     >
//       <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6 transform' : ''}`} />
//     </button>
//   </div>
// );

// const StepThree: React.FC<StepThreeProps> = ({
//   methods,
//   watch,
//   setValue,
//   loading,
//   isAddingEvent,
//   isUpdatingEvent,
//   // router,
//   setStep,
//   eventData,
//   onSubmitWithTicketing,
// }) => {
//   const { formState } = methods;
//   const isLoading = loading || isAddingEvent || isUpdatingEvent;

//   // Watch feature toggles
//   const timeslotEnabled = watch('features.timeslot');
//   const repeatableEnabled = watch('features.repeatable');
//   const resaleProtection = watch('features.resale') || 'none';
//   const earlyBirdEnabled = watch('features.earlyBirdEnabled');
//   const lastMinuteEnabled = watch('features.lastMinuteEnabled');
//   const fasttrackEnabled = watch('features.fasttrack');
//   const reservationEnabled = watch('features.reservation');
//   const transferEnabled = watch('features.transfer');
//   const baseQuantity = watch('quantity');
//   const publishType = watch('publishSettings.publishType') || 'instant';

//   const [showTimeSlotModal, setShowTimeSlotModal] = React.useState(false);
//   const [timeSlotConfig, setTimeSlotConfig] = React.useState<any>(null);

//   const handleTimeSlotSave = (config: any) => {
//     setTimeSlotConfig(config);
//     setValue('features.timeSlotConfig', config, { shouldDirty: true });
//   };

//   // Selected event from Step 1 & 2 data
//   const selectedEvent = React.useMemo(() => {
//     const fromDate = watch('fromDate');
//     const fromTime = watch('fromTime');
//     const endDate = watch('endDate');
//     const endTime = watch('endTime');

//     if (!fromDate || !endDate || !fromTime || !endTime) return null;

//     return {
//       _id: eventData?._id || 'temp-id',
//       schedule: {
//         type: 'oneTime',
//         startDateTime: `${fromDate.toISOString().split('T')[0]} ${fromTime}`,
//         endDateTime: `${endDate.toISOString().split('T')[0]} ${endTime}`,
//       },
//     };
//   }, [watch, eventData]);

//   const handleSkip = async () => {
//     await onSubmitWithTicketing(true);
//   };

//   const handlePublish = async () => {
//     await onSubmitWithTicketing(false);
//   };

//   return (
//     <>
//       <div>
//         <div className="mt-4 flex flex-col gap-6">
//           {/* Required Fields Section */}
//           <div className="dark:bg-secondary mb-3">
//             <SectionHeader title="Required Fields" icon={<AlertCircle className="text-blue-600" size={20} />} />
//             <div className="grid gap-4 md:grid-cols-2">
//               <RHFTextField
//                 name="type"
//                 label="Ticket Type"
//                 placeholder="e.g., General Admission, VIP Pass"
//                 className={`${formState.errors.type ? 'border-red-400 focus:border-red-400' : ''}`}
//                 disabled={isLoading}
//               />

//               <RHFTextField
//                 name="quantity"
//                 label="Quantity"
//                 type="number"
//                 placeholder={timeslotEnabled ? 'Managed by time slots' : 'Enter quantity'}
//                 min="1"
//                 className={`${formState.errors.quantity ? 'border-red-400 focus:border-red-400' : ''}`}
//                 disabled={isLoading || timeslotEnabled}
//               />

//               <RHFTextField
//                 name="price"
//                 label="Price (€)"
//                 type="number"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 className={`${formState.errors.price ? 'border-red-400 focus:border-red-400' : ''}`}
//                 disabled={isLoading}
//               />

//               <RHFSelectField
//                 name="tax"
//                 label="Tax Percentage"
//                 placeholder="Select tax rate"
//                 options={[
//                   { label: '0%', value: '0' },
//                   { label: '5%', value: '5' },
//                   { label: '13%', value: '13' },
//                   { label: '25%', value: '25' },
//                 ]}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Publishing Options */}
//           <div>
//             <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">Publishing Options</h3>

//             <FeatureSection>
//               <div className="dark:bg-secondary bg-gray-50 p-3">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">Publish Settings</span>
//               </div>
//               <div className="dark:bg-secondary border-t bg-white p-4">
//                 <div className="space-y-3">
//                   <label className="flex cursor-pointer items-start gap-3">
//                     <input
//                       type="radio"
//                       value="instant"
//                       checked={publishType === 'instant'}
//                       onChange={(e) =>
//                         setValue('publishSettings.publishType', e.target.value as 'instant', {
//                           shouldDirty: true,
//                         })
//                       }
//                       disabled={isLoading}
//                       className="mt-1 h-4 w-4 text-blue-600"
//                     />
//                     <div className="flex-1">
//                       <span className="text-sm font-medium">Instant Publish</span>
//                       <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
//                         Becomes immediately visible and available to users in the app once created and saved.
//                       </p>
//                     </div>
//                   </label>

//                   <div>
//                     <label className="flex cursor-pointer items-start gap-3">
//                       <input
//                         type="radio"
//                         value="scheduled"
//                         checked={publishType === 'scheduled'}
//                         onChange={(e) =>
//                           setValue('publishSettings.publishType', e.target.value as 'scheduled', {
//                             shouldDirty: true,
//                           })
//                         }
//                         disabled={isLoading}
//                         className="mt-1 h-4 w-4 text-blue-600"
//                       />
//                       <div className="flex-1">
//                         <span className="text-sm font-medium">Scheduled Publish</span>
//                         <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
//                           Set a specific date and time when the ticket should automatically go live. The system will automatically update its status
//                           at the scheduled moment.
//                         </p>
//                       </div>
//                     </label>

//                     {publishType === 'scheduled' && (
//                       <div className="mt-3 ml-7">
//                         <RHFTextField
//                           name="publishSettings.scheduledDate"
//                           label="Schedule Date & Time"
//                           type="datetime-local"
//                           disabled={isLoading}
//                           required={publishType === 'scheduled'}
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <label className="flex cursor-pointer items-start gap-3">
//                     <input
//                       type="radio"
//                       value="manual"
//                       checked={publishType === 'manual'}
//                       onChange={(e) =>
//                         setValue('publishSettings.publishType', e.target.value as 'manual', {
//                           shouldDirty: true,
//                         })
//                       }
//                       disabled={isLoading}
//                       className="mt-1 h-4 w-4 text-blue-600"
//                     />
//                     <div className="flex-1">
//                       <span className="text-sm font-medium">Manual Publish</span>
//                       <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
//                         Tickets remain hidden until you explicitly switch their status to Published using the admin panel.
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </FeatureSection>
//           </div>

//           {/* Optional Features */}
//           <div>
//             <SectionHeader title="Optional Features" />

//             {/* Timeslot Feature */}
//             <FeatureSection>
//               <ToggleSwitch
//                 value={!!timeslotEnabled}
//                 onChange={(val) =>
//                   setValue('features.timeslot', val, {
//                     shouldDirty: true,
//                   })
//                 }
//                 label="Time Slot Ticketing"
//                 disabled={isLoading}
//               />
//               {timeslotEnabled && (
//                 <FeatureSectionContent>
//                   <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
//                     <Calendar className="mr-1 inline" size={14} />
//                     Divide event into bookable time windows. Manage via time slot configuration.
//                   </p>
//                   <button type="button" onClick={() => setShowTimeSlotModal(true)} className="cursor-pointer text-sm text-blue-600 hover:underline">
//                     Configure Time Slots →
//                   </button>
//                   {timeSlotConfig && Array.isArray(timeSlotConfig) && timeSlotConfig.length > 0 && (
//                     <div className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
//                       <p className="text-sm text-green-700 dark:text-green-300">
//                         ✓ Time slots configured: {timeSlotConfig.reduce((total: number, dts: any) => total + dts.timeSlots.length, 0)} slots across{' '}
//                         {timeSlotConfig.length} date{timeSlotConfig.length > 1 ? 's' : ''}
//                       </p>
//                     </div>
//                   )}
//                 </FeatureSectionContent>
//               )}
//             </FeatureSection>

//             {/* Repeatable Feature */}
//             <FeatureSection>
//               <ToggleSwitch
//                 value={!!repeatableEnabled}
//                 onChange={(val) =>
//                   setValue('features.repeatable', val, {
//                     shouldDirty: true,
//                   })
//                 }
//                 label="Repeatable Tickets"
//                 disabled={isLoading}
//               />
//               {repeatableEnabled && (
//                 <FeatureSectionContent>
//                   <RHFTextField
//                     name="features.repeatableVisits"
//                     label="Number of visits per ticket"
//                     type="number"
//                     min="1"
//                     max="99"
//                     placeholder="1"
//                     className="w-32"
//                     disabled={isLoading}
//                   />
//                   {timeslotEnabled && <p className="mt-2 text-xs text-amber-600">⚠ With timeslots enabled, users must select multiple slots</p>}
//                 </FeatureSectionContent>
//               )}
//             </FeatureSection>

//             {/* Resale Protection Feature */}
//             <FeatureSection>
//               <FeatureSectionHeader title="Resale Protection" />
//               <FeatureSectionContent>
//                 <div className="space-y-2">
//                   {[
//                     { value: 'none', label: 'None' },
//                     { value: 'name', label: 'Name + Surname' },
//                     {
//                       value: 'full',
//                       label: 'Name + Surname + PID/Date of Birth',
//                     },
//                   ].map((option) => (
//                     <label key={option.value} className="flex cursor-pointer items-center gap-2">
//                       <input
//                         type="radio"
//                         value={option.value}
//                         checked={resaleProtection === option.value}
//                         onChange={(e) =>
//                           setValue('features.resale', e.target.value, {
//                             shouldDirty: true,
//                           })
//                         }
//                         disabled={isLoading}
//                         className="h-4 w-4 text-blue-600"
//                       />
//                       <span className="text-sm">{option.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </FeatureSectionContent>
//             </FeatureSection>

//             {/* Transfer Fee Feature */}
//             <FeatureSection>
//               <ToggleSwitch
//                 value={!!transferEnabled}
//                 onChange={(val) =>
//                   setValue('features.transfer', val, {
//                     shouldDirty: true,
//                   })
//                 }
//                 label="Transfer Fee"
//                 disabled={isLoading}
//               />
//               {transferEnabled && (
//                 <FeatureSectionContent>
//                   <RHFTextField
//                     name="features.transferFee"
//                     label="Transfer Fee (€)"
//                     type="number"
//                     placeholder="Enter Transfer Fee"
//                     step="0.01"
//                     min="0"
//                     disabled={isLoading}
//                   />
//                 </FeatureSectionContent>
//               )}
//             </FeatureSection>

//             {/* Time Sensitive Pricing Feature */}
//             <FeatureSection>
//               <FeatureSectionHeader title="Time Sensitive Pricing" />
//               <FeatureSectionContent>
//                 <div className="space-y-3">
//                   {/* Early Bird Option */}
//                   <div>
//                     <label className="flex cursor-pointer items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={earlyBirdEnabled || false}
//                         onChange={(e) => {
//                           const checked = e.target.checked;
//                           setValue('features.earlyBirdEnabled', checked, {
//                             shouldDirty: true,
//                           });
//                           if (!checked) {
//                             setValue('features.earlyBirdDate', '', {
//                               shouldDirty: true,
//                             });
//                             setValue('features.earlyBirdPrice', '', {
//                               shouldDirty: true,
//                             });
//                           }
//                         }}
//                         disabled={isLoading}
//                         className="h-4 w-4 rounded text-blue-600"
//                       />
//                       <span className="text-sm font-medium">Early Bird Pricing</span>
//                     </label>

//                     {earlyBirdEnabled && (
//                       <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
//                         <RHFTextField
//                           name="features.earlyBirdDate"
//                           label="End Date/Time"
//                           type="datetime-local"
//                           disabled={isLoading}
//                           required={earlyBirdEnabled}
//                         />
//                         <RHFTextField
//                           name="features.earlyBirdPrice"
//                           label="Discounted Price (€)"
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           placeholder="0.00"
//                           disabled={isLoading}
//                           required={earlyBirdEnabled}
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* Last Minute Option */}
//                   <div>
//                     <label className="flex cursor-pointer items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={lastMinuteEnabled || false}
//                         onChange={(e) => {
//                           const checked = e.target.checked;
//                           setValue('features.lastMinuteEnabled', checked, {
//                             shouldDirty: true,
//                           });
//                           if (!checked) {
//                             setValue('features.lastMinuteDate', '', {
//                               shouldDirty: true,
//                             });
//                             setValue('features.lastMinutePrice', '', {
//                               shouldDirty: true,
//                             });
//                           }
//                         }}
//                         disabled={isLoading}
//                         className="h-4 w-4 rounded text-blue-600"
//                       />
//                       <span className="text-sm font-medium">Last Minute Pricing</span>
//                     </label>

//                     {lastMinuteEnabled && (
//                       <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
//                         <RHFTextField
//                           name="features.lastMinuteDate"
//                           label="Start Date/Time"
//                           type="datetime-local"
//                           disabled={isLoading}
//                           required={lastMinuteEnabled}
//                         />
//                         <RHFTextField
//                           name="features.lastMinutePrice"
//                           label="Discounted Price (€)"
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           placeholder="0.00"
//                           disabled={isLoading}
//                           required={lastMinuteEnabled}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </FeatureSectionContent>
//             </FeatureSection>

//             {/* Fast Track Feature */}
//             <FeatureSection>
//               <ToggleSwitch
//                 value={!!fasttrackEnabled}
//                 onChange={(val) =>
//                   setValue('features.fasttrack', val, {
//                     shouldDirty: true,
//                   })
//                 }
//                 label="Fast Track Entry"
//                 disabled={isLoading}
//               />
//               {fasttrackEnabled && (
//                 <FeatureSectionContent>
//                   <div className="space-y-3">
//                     <RHFTextField
//                       name="features.fasttrackQuantity"
//                       label={`Fast Track Quantity (≤ ${baseQuantity || 'base quantity'})`}
//                       type="number"
//                       min="1"
//                       max={baseQuantity || 999}
//                       placeholder="1"
//                       disabled={isLoading}
//                     />
//                     <RHFTextField
//                       name="features.fasttrackPrice"
//                       label="Extra Price (€)"
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       placeholder="0.00"
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </FeatureSectionContent>
//               )}
//             </FeatureSection>

//             {/* Reservation Feature */}
//             <FeatureSection>
//               <ToggleSwitch
//                 value={!!reservationEnabled}
//                 onChange={(val) =>
//                   setValue('features.reservation', val, {
//                     shouldDirty: true,
//                   })
//                 }
//                 label="Requires Reservation"
//                 disabled={isLoading}
//               />
//               {reservationEnabled && (
//                 <FeatureSectionContent>
//                   <RHFSelectField
//                     name="features.reservationType"
//                     label="Reservation Type"
//                     placeholder="Select type"
//                     options={[
//                       { label: 'Any Reservation', value: 'any' },
//                       { label: 'Table Only', value: 'table' },
//                       { label: 'VIP Only', value: 'vip' },
//                       { label: 'Booth Only', value: 'booth' },
//                     ]}
//                     disabled={isLoading}
//                   />
//                 </FeatureSectionContent>
//               )}
//             </FeatureSection>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setStep(2)}
//               className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
//               disabled={isLoading}
//             >
//               Back
//             </Button>

//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleSkip}
//               className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
//               disabled={isLoading}
//             >
//               {isLoading ? <ButtonLoading title="Skipping" /> : 'Skip'}
//             </Button>

//             <Button
//               type="button"
//               onClick={handlePublish}
//               className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
//               disabled={isLoading}
//             >
//               {isLoading ? <ButtonLoading title="Publishing" /> : 'Publish'}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <TimeSlotConfigModal
//         open={showTimeSlotModal}
//         onClose={() => setShowTimeSlotModal(false)}
//         onSave={handleTimeSlotSave}
//         totalQuantity={baseQuantity}
//         eventData={selectedEvent}
//         initialConfig={timeSlotConfig}
//       />
//     </>
//   );
// };

// export default StepThree;

// // 'use client';

// // import ButtonLoading from '@/components/common/button-loading';
// // import { RHFSelectField, RHFTextField } from '@/components/rhf';
// // import { Button } from '@/components/ui/button';
// // import { AlertCircle, Calendar } from 'lucide-react';
// // import * as React from 'react';
// // import type { StepThreeProps } from './types';

// // // Reusable Components
// // const FeatureSection: React.FC<{
// //   children: React.ReactNode;
// //   className?: string;
// // }> = ({ children, className = '' }) => <div className={`mb-4 overflow-hidden rounded-lg border ${className}`}>{children}</div>;

// // const FeatureSectionHeader: React.FC<{ title: string }> = ({ title }) => (
// //   <div className="dark:bg-secondary bg-gray-50 p-3">
// //     <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
// //   </div>
// // );

// // const FeatureSectionContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
// //   <div className="dark:bg-secondary border-t bg-white p-4">{children}</div>
// // );

// // const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
// //   <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
// //     {icon}
// //     {title}
// //   </h3>
// // );

// // const ToggleSwitch: React.FC<{
// //   value: boolean;
// //   onChange: (value: boolean) => void;
// //   label: string;
// //   disabled?: boolean;
// // }> = ({ value, onChange, label, disabled = false }) => (
// //   <div className="dark:bg-secondary flex items-center justify-between rounded-lg bg-gray-50 p-3">
// //     <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
// //     <button
// //       title="Toggle Switch"
// //       type="button"
// //       onClick={() => onChange(!value)}
// //       disabled={disabled}
// //       className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
// //         value ? 'bg-blue-600' : 'bg-gray-300'
// //       } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
// //     >
// //       <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6 transform' : ''}`} />
// //     </button>
// //   </div>
// // );

// // const StepThree: React.FC<StepThreeProps> = ({ methods, watch, setValue, loading, isAddingEvent, isUpdatingEvent, router, setStep }) => {
// //   const { formState } = methods;
// //   const isLoading = loading || isAddingEvent || isUpdatingEvent;

// //   // Watch feature toggles
// //   const timeslotEnabled = watch('features.timeslot');
// //   const repeatableEnabled = watch('features.repeatable');
// //   const resaleProtection = watch('features.resale') || 'none';
// //   const earlyBirdEnabled = watch('features.earlyBirdEnabled');
// //   const lastMinuteEnabled = watch('features.lastMinuteEnabled');
// //   const fasttrackEnabled = watch('features.fasttrack');
// //   const reservationEnabled = watch('features.reservation');
// //   const transferEnabled = watch('features.transfer');
// //   const baseQuantity = watch('quantity');

// //   return (
// //     <div>
// //       <div className="mt-4 flex flex-col gap-6">
// //         {/* Required Fields Section */}
// //         <div className="dark:bg-secondary mb-3">
// //           <SectionHeader title="Required Fields" icon={<AlertCircle className="text-blue-600" size={20} />} />
// //           <div className="grid gap-4 md:grid-cols-2">
// //             <RHFTextField
// //               name="type"
// //               label="Ticket Type"
// //               placeholder="e.g., General Admission, VIP Pass"
// //               className={`${formState.errors.type ? 'border-red-400 focus:border-red-400' : ''}`}
// //               disabled={isLoading}
// //             />

// //             <RHFTextField
// //               name="quantity"
// //               label="Quantity"
// //               type="number"
// //               placeholder="Enter quantity"
// //               min="1"
// //               className={`${formState.errors.quantity ? 'border-red-400 focus:border-red-400' : ''}`}
// //               disabled={isLoading}
// //             />

// //             <RHFTextField
// //               name="price"
// //               label="Price (€)"
// //               type="number"
// //               placeholder="0.00"
// //               step="0.01"
// //               min="0"
// //               className={`${formState.errors.price ? 'border-red-400 focus:border-red-400' : ''}`}
// //               disabled={isLoading}
// //             />

// //             <RHFSelectField
// //               name="tax"
// //               label="Tax Percentage"
// //               placeholder="Select tax rate"
// //               options={[
// //                 { label: '0%', value: '0' },
// //                 { label: '5%', value: '5' },
// //                 { label: '13%', value: '13' },
// //                 { label: '25%', value: '25' },
// //               ]}
// //               disabled={isLoading}
// //             />
// //           </div>
// //         </div>

// //         {/* Optional Features */}
// //         <div>
// //           <SectionHeader title="Optional Features" />

// //           {/* Timeslot Feature */}
// //           <FeatureSection>
// //             <ToggleSwitch
// //               value={timeslotEnabled}
// //               onChange={(val) =>
// //                 setValue('features.timeslot', val, {
// //                   shouldDirty: true,
// //                 })
// //               }
// //               label="Time Slot Ticketing"
// //               disabled={isLoading}
// //             />
// //             {timeslotEnabled && (
// //               <FeatureSectionContent>
// //                 <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
// //                   <Calendar className="mr-1 inline" size={14} />
// //                   Divide event into bookable time windows. Manage via calendar view.
// //                 </p>
// //                 <button type="button" className="text-sm text-blue-600 hover:underline">
// //                   Configure Time Slots →
// //                 </button>
// //               </FeatureSectionContent>
// //             )}
// //           </FeatureSection>

// //           {/* Repeatable Feature */}
// //           <FeatureSection>
// //             <ToggleSwitch
// //               value={repeatableEnabled}
// //               onChange={(val) =>
// //                 setValue('features.repeatable', val, {
// //                   shouldDirty: true,
// //                 })
// //               }
// //               label="Repeatable Tickets"
// //               disabled={isLoading}
// //             />
// //             {repeatableEnabled && (
// //               <FeatureSectionContent>
// //                 <RHFTextField
// //                   name="number"
// //                   label="Number of visits per ticket"
// //                   type="number"
// //                   min="1"
// //                   max="99"
// //                   placeholder="1"
// //                   className="w-32"
// //                   disabled={isLoading}
// //                 />
// //                 {timeslotEnabled && <p className="mt-2 text-xs text-amber-600">⚠ With timeslots enabled, users must select multiple slots</p>}
// //               </FeatureSectionContent>
// //             )}
// //           </FeatureSection>

// //           {/* Resale Protection Feature */}
// //           <FeatureSection>
// //             <FeatureSectionHeader title="Resale Protection" />
// //             <FeatureSectionContent>
// //               <div className="space-y-2">
// //                 {[
// //                   { value: 'none', label: 'None' },
// //                   { value: 'name', label: 'Name + Surname' },
// //                   {
// //                     value: 'full',
// //                     label: 'Name + Surname + PID/Date of Birth',
// //                   },
// //                 ].map((option) => (
// //                   <label key={option.value} className="flex cursor-pointer items-center gap-2">
// //                     <input
// //                       type="radio"
// //                       value={option.value}
// //                       checked={resaleProtection === option.value}
// //                       onChange={(e) =>
// //                         setValue('features.resale', e.target.value, {
// //                           shouldDirty: true,
// //                         })
// //                       }
// //                       disabled={isLoading}
// //                       className="h-4 w-4 text-blue-600"
// //                     />
// //                     <span className="text-sm">{option.label}</span>
// //                   </label>
// //                 ))}
// //               </div>
// //             </FeatureSectionContent>
// //           </FeatureSection>

// //           {/* Time Sensitive Pricing Feature */}
// //           <FeatureSection>
// //             <FeatureSectionHeader title="Time Sensitive Pricing" />
// //             <FeatureSectionContent>
// //               <div className="space-y-3">
// //                 {/* Early Bird Option */}
// //                 <div>
// //                   <label className="flex cursor-pointer items-center gap-2">
// //                     <input
// //                       type="checkbox"
// //                       checked={earlyBirdEnabled || false}
// //                       onChange={(e) => {
// //                         const checked = e.target.checked;
// //                         setValue('features.earlyBirdEnabled', checked, {
// //                           shouldDirty: true,
// //                         });
// //                         if (!checked) {
// //                           setValue('features.earlyBirdDate', '', {
// //                             shouldDirty: true,
// //                           });
// //                           setValue('features.earlyBirdPrice', '', {
// //                             shouldDirty: true,
// //                           });
// //                         }
// //                       }}
// //                       disabled={isLoading}
// //                       className="h-4 w-4 rounded text-blue-600"
// //                     />
// //                     <span className="text-sm font-medium">Early Bird Pricing</span>
// //                   </label>

// //                   {earlyBirdEnabled && (
// //                     <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
// //                       <RHFTextField
// //                         name="features.earlyBirdDate"
// //                         label="End Date/Time"
// //                         type="datetime-local"
// //                         disabled={isLoading}
// //                         required={earlyBirdEnabled}
// //                       />
// //                       <RHFTextField
// //                         name="features.earlyBirdPrice"
// //                         label="Discounted Price (€)"
// //                         type="number"
// //                         step="0.01"
// //                         min="0"
// //                         placeholder="0.00"
// //                         disabled={isLoading}
// //                         required={earlyBirdEnabled}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Last Minute Option */}
// //                 <div>
// //                   <label className="flex cursor-pointer items-center gap-2">
// //                     <input
// //                       type="checkbox"
// //                       checked={lastMinuteEnabled || false}
// //                       onChange={(e) => {
// //                         const checked = e.target.checked;
// //                         setValue('features.lastMinuteEnabled', checked, {
// //                           shouldDirty: true,
// //                         });
// //                         if (!checked) {
// //                           setValue('features.lastMinuteDate', '', {
// //                             shouldDirty: true,
// //                           });
// //                           setValue('features.lastMinutePrice', '', {
// //                             shouldDirty: true,
// //                           });
// //                         }
// //                       }}
// //                       disabled={isLoading}
// //                       className="h-4 w-4 rounded text-blue-600"
// //                     />
// //                     <span className="text-sm font-medium">Last Minute Pricing</span>
// //                   </label>

// //                   {lastMinuteEnabled && (
// //                     <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
// //                       <RHFTextField
// //                         name="features.lastMinuteDate"
// //                         label="Start Date/Time"
// //                         type="datetime-local"
// //                         disabled={isLoading}
// //                         required={lastMinuteEnabled}
// //                       />
// //                       <RHFTextField
// //                         name="features.lastMinutePrice"
// //                         label="Discounted Price (€)"
// //                         type="number"
// //                         step="0.01"
// //                         min="0"
// //                         placeholder="0.00"
// //                         disabled={isLoading}
// //                         required={lastMinuteEnabled}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </FeatureSectionContent>
// //           </FeatureSection>

// //           {/* Fast Track Feature */}
// //           <FeatureSection>
// //             <ToggleSwitch
// //               value={fasttrackEnabled}
// //               onChange={(val) =>
// //                 setValue('features.fasttrack', val, {
// //                   shouldDirty: true,
// //                 })
// //               }
// //               label="Fast Track Entry"
// //               disabled={isLoading}
// //             />
// //             {fasttrackEnabled && (
// //               <FeatureSectionContent>
// //                 <div className="space-y-3">
// //                   <RHFTextField
// //                     name="features.fasttrackQuantity"
// //                     label={`Fast Track Quantity (≤ ${baseQuantity || 'base quantity'})`}
// //                     type="number"
// //                     min="1"
// //                     max={baseQuantity || 999}
// //                     placeholder="1"
// //                     disabled={isLoading}
// //                   />
// //                   <RHFTextField
// //                     name="features.fasttrackPrice"
// //                     label="Extra Price (€)"
// //                     type="number"
// //                     step="0.01"
// //                     min="0"
// //                     placeholder="0.00"
// //                     disabled={isLoading}
// //                   />
// //                 </div>
// //               </FeatureSectionContent>
// //             )}
// //           </FeatureSection>

// //           {/* Reservation Feature */}
// //           <FeatureSection>
// //             <ToggleSwitch
// //               value={reservationEnabled}
// //               onChange={(val) =>
// //                 setValue('features.reservation', val, {
// //                   shouldDirty: true,
// //                 })
// //               }
// //               label="Requires Reservation"
// //               disabled={isLoading}
// //             />
// //             {reservationEnabled && (
// //               <FeatureSectionContent>
// //                 <RHFSelectField
// //                   name="features.reservationType"
// //                   label="Reservation Type"
// //                   placeholder="Select type"
// //                   options={[
// //                     { label: 'Any Reservation', value: 'any' },
// //                     { label: 'Table Only', value: 'table' },
// //                     { label: 'VIP Only', value: 'vip' },
// //                     { label: 'Booth Only', value: 'booth' },
// //                   ]}
// //                   disabled={isLoading}
// //                 />
// //               </FeatureSectionContent>
// //             )}
// //           </FeatureSection>

// //           {/* Transfer Feature */}
// //           <FeatureSection>
// //             <ToggleSwitch
// //               value={transferEnabled}
// //               onChange={(val) =>
// //                 setValue('features.transfer', val, {
// //                   shouldDirty: true,
// //                 })
// //               }
// //               label="Transfer Fee"
// //               disabled={isLoading}
// //             />
// //             {transferEnabled && (
// //               <FeatureSectionContent>
// //                 <RHFTextField
// //                   name="ticketing.transferPrice"
// //                   label="Transfer Fee (€)"
// //                   type="number"
// //                   placeholder="Enter Transfer Fee"
// //                   step="0.01"
// //                   min="0"
// //                   disabled={isLoading}
// //                 />
// //               </FeatureSectionContent>
// //             )}
// //           </FeatureSection>
// //         </div>

// //         {/* Action Buttons */}
// //         <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={() => setStep(2)}
// //             className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
// //             disabled={isLoading}
// //           >
// //             Back
// //           </Button>

// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={() => router.push('/organizer/events/1')}
// //             className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
// //             disabled={isLoading}
// //           >
// //             Skip
// //           </Button>

// //           {isLoading ? (
// //             <Button
// //               type="button"
// //               disabled
// //               className="bg-primary hover:bg-primary cursor-not-allowed rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
// //             >
// //               <ButtonLoading title="Publishing" />
// //             </Button>
// //           ) : (
// //             <Button type="submit" className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]">
// //               Publish
// //             </Button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StepThree;
