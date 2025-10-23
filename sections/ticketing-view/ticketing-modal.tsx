'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Calendar } from 'lucide-react';
import * as React from 'react';
import TimeSlotConfigModal from './timelotConfig';
import { useGeteventsQuery } from '@/store/Reducer/events';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';

interface TicketingModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

// Reusable Components
const FeatureSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mb-4 overflow-hidden rounded-lg border ${className}`}>
    {children}
  </div>
);

const FeatureSectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="dark:bg-secondary bg-gray-50 p-3">
    <span className="font-medium text-gray-700 dark:text-gray-300">
      {title}
    </span>
  </div>
);

const FeatureSectionContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="dark:bg-secondary border-t bg-white p-4">{children}</div>;

const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({
  title,
  icon,
}) => (
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
    <span className="font-medium text-gray-700 dark:text-gray-300">
      {label}
    </span>
    <button
      title="Toggle Switch"
      type="button"
      onClick={() => onChange(!value)}
      disabled={disabled}
      className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <div
        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
          value ? 'translate-x-6 transform' : ''
        }`}
      />
    </button>
  </div>
);

// Main Modal Component
const TicketingModal: React.FC<TicketingModalProps> = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const { formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;

  // Watch feature toggles
  const timeslotEnabled = watch('features.timeslot');
  const repeatableEnabled = watch('features.repeatable');
  const resaleProtection = watch('features.resale') || 'none';
  const earlyBirdEnabled = watch('features.earlyBirdEnabled');
  const lastMinuteEnabled = watch('features.lastMinuteEnabled');
  const fasttrackEnabled = watch('features.fasttrack');
  const reservationEnabled = watch('features.reservation');
  const transferEnabled = watch('features.transfer');
  const baseQuantity = watch('quantity');

  const [showTimeSlotModal, setShowTimeSlotModal] = React.useState(false);
  const [timeSlotConfig, setTimeSlotConfig] = React.useState<any>(null);

  const handleTimeSlotSave = (config: any) => {
    setTimeSlotConfig(config);
    // You can also store this in form state if needed
    setValue('features.timeSlotConfig', config, { shouldDirty: true });
  };

  const { data: eventData, isLoading: isLoadingEvents } = useGeteventsQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const eventOptions = (eventData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.title || 'No Title',
  }));

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogOverlay className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/50">
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:!max-w-[700px]"
          >
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {editMode ? 'Edit Ticket' : 'Create New Ticket'}
              </DialogTitle>
            </DialogHeader>

            <div className="w-full">
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <div className="mt-4 flex flex-col gap-6">
                  {/* Required Fields Section */}
                  <div className="dark:bg-secondary mb-3">
                    <SectionHeader
                      title="Required Fields"
                      icon={<AlertCircle className="text-blue-600" size={20} />}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <RHFTextField
                        name="type"
                        label="Ticket Type"
                        placeholder="e.g., General Admission, VIP Pass"
                        className={`${
                          formState.errors.type
                            ? 'border-red-400 focus:border-red-400'
                            : ''
                        }`}
                        disabled={isLoading}
                      />

                      <RHFTextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        placeholder="Enter quantity"
                        min="1"
                        className={`${
                          formState.errors.quantity
                            ? 'border-red-400 focus:border-red-400'
                            : ''
                        }`}
                        disabled={isLoading}
                      />

                      <RHFTextField
                        name="price"
                        label="Price (€)"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`${
                          formState.errors.price
                            ? 'border-red-400 focus:border-red-400'
                            : ''
                        }`}
                        disabled={isLoading}
                      />

                      <RHFSelectField
                        name="tax"
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

                      <div className="col-span-2">
                        <RHFCustomDropdown
                          name="event"
                          label="Select Event"
                          placeholder="Select Event"
                          options={eventOptions}
                          isLoading={isLoadingEvents}
                          showNone={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Features */}
                  <div>
                    <SectionHeader title="Optional Features" />

                    {/* Timeslot Feature */}
                    {/* <FeatureSection>
                    <ToggleSwitch
                      value={timeslotEnabled}
                      onChange={(val) =>
                        setValue('features.timeslot', val, {
                          shouldDirty: true,
                        })
                      }
                      label="Time Slot Ticketing"
                      disabled={isLoading}
                    />
                    {timeslotEnabled && (
                      <FeatureSectionContent>
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="mr-1 inline" size={14} />
                          Divide event into bookable time windows. Manage via
                          calendar view.
                        </p>
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Configure Time Slots →
                        </button>
                      </FeatureSectionContent>
                    )}
                  </FeatureSection> */}

                    <FeatureSection>
                      <ToggleSwitch
                        value={timeslotEnabled}
                        onChange={(val) =>
                          setValue('features.timeslot', val, {
                            shouldDirty: true,
                          })
                        }
                        label="Time Slot Ticketing"
                        disabled={isLoading}
                      />
                      {timeslotEnabled && (
                        <FeatureSectionContent>
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="mr-1 inline" size={14} />
                            Divide event into bookable time windows. Manage via
                            time slot configuration.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowTimeSlotModal(true)}
                            className="cursor-pointer text-sm text-blue-600 hover:underline"
                          >
                            Configure Time Slots →
                          </button>
                          {timeSlotConfig && (
                            <div className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                              <p className="text-sm text-green-700 dark:text-green-300">
                                ✓ Time slots configured:{' '}
                                {timeSlotConfig.timeSlots.length} slots on{' '}
                                {timeSlotConfig.operatingDays.length} days
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
                        onChange={(val) =>
                          setValue('features.repeatable', val, {
                            shouldDirty: true,
                          })
                        }
                        label="Repeatable Tickets"
                        disabled={isLoading}
                      />
                      {repeatableEnabled && (
                        <FeatureSectionContent>
                          <RHFTextField
                            name="number"
                            label="Number of visits per ticket"
                            type="number"
                            min="1"
                            max="99"
                            placeholder="1"
                            className="w-32"
                            disabled={isLoading}
                          />
                          {timeslotEnabled && (
                            <p className="mt-2 text-xs text-amber-600">
                              ⚠ With timeslots enabled, users must select
                              multiple slots
                            </p>
                          )}
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
                            { value: 'name', label: 'Name + Surname' },
                            {
                              value: 'full',
                              label: 'Name + Surname + PID/Date of Birth',
                            },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex cursor-pointer items-center gap-2"
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={resaleProtection === option.value}
                                onChange={(e) =>
                                  setValue('features.resale', e.target.value, {
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
                                checked={earlyBirdEnabled || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setValue(
                                    'features.earlyBirdEnabled',
                                    checked,
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                  if (!checked) {
                                    setValue('features.earlyBirdDate', '', {
                                      shouldDirty: true,
                                    });
                                    setValue('features.earlyBirdPrice', '', {
                                      shouldDirty: true,
                                    });
                                  }
                                }}
                                disabled={isLoading}
                                className="h-4 w-4 rounded text-blue-600"
                              />
                              <span className="text-sm font-medium">
                                Early Bird Pricing
                              </span>
                            </label>

                            {earlyBirdEnabled && (
                              <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
                                <RHFTextField
                                  name="features.earlyBirdDate"
                                  label="End Date/Time"
                                  type="datetime-local"
                                  disabled={isLoading}
                                  required={earlyBirdEnabled}
                                />
                                <RHFTextField
                                  name="features.earlyBirdPrice"
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
                                checked={lastMinuteEnabled || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setValue(
                                    'features.lastMinuteEnabled',
                                    checked,
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                  if (!checked) {
                                    setValue('features.lastMinuteDate', '', {
                                      shouldDirty: true,
                                    });
                                    setValue('features.lastMinutePrice', '', {
                                      shouldDirty: true,
                                    });
                                  }
                                }}
                                disabled={isLoading}
                                className="h-4 w-4 rounded text-blue-600"
                              />
                              <span className="text-sm font-medium">
                                Last Minute Pricing
                              </span>
                            </label>

                            {lastMinuteEnabled && (
                              <div className="mt-3 ml-6 grid gap-3 md:grid-cols-2">
                                <RHFTextField
                                  name="features.lastMinuteDate"
                                  label="Start Date/Time"
                                  type="datetime-local"
                                  disabled={isLoading}
                                  required={lastMinuteEnabled}
                                />
                                <RHFTextField
                                  name="features.lastMinutePrice"
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
                        onChange={(val) =>
                          setValue('features.fasttrack', val, {
                            shouldDirty: true,
                          })
                        }
                        label="Fast Track Entry"
                        disabled={isLoading}
                      />
                      {fasttrackEnabled && (
                        <FeatureSectionContent>
                          <div className="space-y-3">
                            <RHFTextField
                              name="features.fasttrackQuantity"
                              label={`Fast Track Quantity (≤ ${baseQuantity || 'base quantity'})`}
                              type="number"
                              min="1"
                              max={baseQuantity || 999}
                              placeholder="1"
                              disabled={isLoading}
                            />
                            <RHFTextField
                              name="features.fasttrackPrice"
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
                        onChange={(val) =>
                          setValue('features.reservation', val, {
                            shouldDirty: true,
                          })
                        }
                        label="Requires Reservation"
                        disabled={isLoading}
                      />
                      {reservationEnabled && (
                        <FeatureSectionContent>
                          <RHFSelectField
                            name="features.reservationType"
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

                    {/* Transfer Feature */}
                    <FeatureSection>
                      <ToggleSwitch
                        value={transferEnabled}
                        onChange={(val) =>
                          setValue('features.transfer', val, {
                            shouldDirty: true,
                          })
                        }
                        label="Transfer Fee"
                        disabled={isLoading}
                      />
                      {transferEnabled && (
                        <FeatureSectionContent>
                          <RHFTextField
                            name="price"
                            type="number"
                            placeholder="Enter Transfer Fee"
                            step="0.01"
                            min="0"
                            disabled={isLoading}
                          />
                        </FeatureSectionContent>
                      )}
                    </FeatureSection>
                  </div>

                  {/* Status field for edit mode */}
                  {editMode && (
                    <RHFSelectField
                      name="status"
                      placeholder="Select Status"
                      label="Status"
                      options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                      ]}
                      disabled={isLoading}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 border-t pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="px-4 py-2"
                    >
                      Cancel
                    </Button>

                    {isLoading ? (
                      <Button
                        type="button"
                        disabled
                        className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                      >
                        <ButtonLoading
                          title={editMode ? 'Updating' : 'Creating'}
                        />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                        disabled={editMode ? !isDirty : false}
                      >
                        {editMode ? 'Update Ticket' : 'Create Ticket'}
                      </Button>
                    )}
                  </div>
                </div>
              </FormProvider>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      {/* Time Slot Configuration Modal */}
      <TimeSlotConfigModal
        open={showTimeSlotModal}
        onClose={() => setShowTimeSlotModal(false)}
        onSave={handleTimeSlotSave}
      />
    </>
  );
};

export default TicketingModal;
