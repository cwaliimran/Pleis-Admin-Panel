'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useAddTicketingMutation, useUpdateTicketingMutation } from '@/store/Reducer/ticketing-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, Calendar } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TimeSlotConfigModal from './timelotConfig';
import ToggleSwitch from './toogle';

interface TicketingModalProps {
  open: boolean;
  onClose: () => void;
  editMode?: boolean;
  selectedData?: any;
}

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

const defaultValues = {
  title: '',
  type: '',
  quantity: 0,
  price: 0,
  tax: '',
  event: '',
  status: 'active',
  publishSettings: {
    publishType: 'instant',
    scheduledDate: '',
  },
  features: {
    timeslot: false,
    timeSlotConfig: null,
    repeatable: false,
    resale: 'none',
    earlyBirdEnabled: false,
    earlyBirdDate: '',
    earlyBirdPrice: '',
    lastMinuteEnabled: false,
    lastMinuteDate: '',
    lastMinutePrice: '',
    fasttrack: false,
    fasttrackQuantity: '',
    fasttrackPrice: '',
    reservation: false,
    reservationType: '',
    transfer: false,
  },
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  type: Yup.string().required('Ticket type is required'),
  quantity: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : Number(originalValue)))
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1'),
  price: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : Number(originalValue)))
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0, 'Price cannot be negative'),

  tax: Yup.string().required('Tax percentage is required'),
  event: Yup.string().required('Event selection is required'),
  status: Yup.string().oneOf(['active', 'inactive']),
  publishSettings: Yup.object().shape({
    publishType: Yup.string().oneOf(['instant', 'scheduled', 'manual']).required('Publish type is required'),
    scheduledDate: Yup.string().when('publishType', {
      is: 'scheduled',
      then: (s) => s.required('Scheduled date is required for scheduled publish'),
    }),
  }),
  features: Yup.object().shape({
    timeslot: Yup.boolean(),
    timeSlotConfig: Yup.mixed().nullable(),
    repeatable: Yup.boolean(),
    resale: Yup.string().oneOf(['none', 'name', 'full']),
    earlyBirdEnabled: Yup.boolean(),
    earlyBirdDate: Yup.string().when('earlyBirdEnabled', {
      is: true,
      then: (s) => s.required('Early bird date required'),
    }),
    earlyBirdPrice: Yup.string().when('earlyBirdEnabled', {
      is: true,
      then: (s) => s.required('Early bird price required'),
    }),
    lastMinuteEnabled: Yup.boolean(),
    lastMinuteDate: Yup.string().when('lastMinuteEnabled', {
      is: true,
      then: (s) => s.required('Last minute date required'),
    }),
    lastMinutePrice: Yup.string().when('lastMinuteEnabled', {
      is: true,
      then: (s) => s.required('Last minute price required'),
    }),
    fasttrack: Yup.boolean(),
    fasttrackQuantity: Yup.string(),
    fasttrackPrice: Yup.string(),
    reservation: Yup.boolean(),
    reservationType: Yup.string(),
    transfer: Yup.boolean(),
  }),
});

const TicketingModal: React.FC<TicketingModalProps> = ({ open, onClose, editMode, selectedData }) => {
  const [addTicketing, { isLoading: addTicketingLoading }] = useAddTicketingMutation();
  const [updateTicketing, { isLoading: updateTicketingLoading }] = useUpdateTicketingMutation();

  const handleClose = () => {
    onClose();
  };

  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, formState, watch, setValue } = methods;
  const isDirty = formState.isDirty;

  const timeslotEnabled = watch('features.timeslot');
  const repeatableEnabled = watch('features.repeatable');
  const resaleProtection = watch('features.resale');
  const earlyBirdEnabled = watch('features.earlyBirdEnabled');
  const lastMinuteEnabled = watch('features.lastMinuteEnabled');
  const fasttrackEnabled = watch('features.fasttrack');
  const reservationEnabled = watch('features.reservation');
  const transferEnabled = watch('features.transfer');
  const baseQuantity = watch('quantity');
  const publishType = watch('publishSettings.publishType');

  const [showTimeSlotModal, setShowTimeSlotModal] = React.useState(false);
  const [timeSlotConfig, setTimeSlotConfig] = React.useState<any>(null);

  const handleTimeSlotSave = (config: any) => {
    setTimeSlotConfig(config);
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

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload: any = {
        title: formData?.title,
      };

      if (editMode && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response = editMode && selectedData ? await updateTicketing(payload).unwrap() : await addTicketing(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (editMode ? 'Menu List updated successfully' : 'Menu List created successfully'));

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogOverlay className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/50">
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:!max-w-[700px]"
          >
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-bold">{editMode ? 'Edit Ticket' : 'Create New Ticket'}</DialogTitle>
            </DialogHeader>

            <div className="w-full">
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <div className="mt-4 flex flex-col gap-6">
                  {/* Required Fields Section */}
                  <div className="dark:bg-secondary mb-3">
                    <SectionHeader title="Required Fields" icon={<AlertCircle className="text-blue-600" size={20} />} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <RHFTextField
                        name="type"
                        label="Ticket Type"
                        placeholder="e.g., General Admission, VIP Pass"
                        className={`${formState.errors.type ? 'border-red-400 focus:border-red-400' : ''}`}
                        disabled={isLoading}
                      />

                      <RHFTextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        placeholder="Enter quantity"
                        min="1"
                        className={`${formState.errors.quantity ? 'border-red-400 focus:border-red-400' : ''}`}
                        disabled={isLoading}
                      />

                      <RHFTextField
                        name="price"
                        label="Price (€)"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`${formState.errors.price ? 'border-red-400 focus:border-red-400' : ''}`}
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

                  {/* Publishing Options Section */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">Publishing Options</h3>

                    <FeatureSection>
                      <div className="dark:bg-secondary bg-gray-50 p-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Publish Settings</span>
                      </div>
                      <div className="dark:bg-secondary border-t bg-white p-4">
                        <div className="space-y-3">
                          {/* Instant Publish Option */}
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="radio"
                              value="instant"
                              checked={publishType === 'instant'}
                              onChange={(e) =>
                                setValue('publishSettings.publishType', e.target.value as 'instant', {
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

                          {/* Scheduled Publish Option */}
                          <div>
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                type="radio"
                                value="scheduled"
                                checked={publishType === 'scheduled'}
                                onChange={(e) =>
                                  setValue('publishSettings.publishType', e.target.value as 'scheduled', {
                                    shouldDirty: true,
                                  })
                                }
                                disabled={isLoading}
                                className="mt-1 h-4 w-4 text-blue-600"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium">Scheduled Publish</span>
                                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                  Set a specific date and time when the ticket should automatically go live. The system will automatically update its
                                  status at the scheduled moment.
                                </p>
                              </div>
                            </label>

                            {publishType === 'scheduled' && (
                              <div className="mt-3 ml-7">
                                <RHFTextField
                                  name="publishSettings.scheduledDate"
                                  label="Schedule Date & Time"
                                  type="datetime-local"
                                  disabled={isLoading}
                                  required={publishType === 'scheduled'}
                                />
                              </div>
                            )}
                          </div>

                          {/* Manual Publish Option */}
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="radio"
                              value="manual"
                              checked={publishType === 'manual'}
                              onChange={(e) =>
                                setValue('publishSettings.publishType', e.target.value as 'manual', {
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

                    <FeatureSection>
                      <ToggleSwitch
                        value={!!timeslotEnabled}
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
                            Divide event into bookable time windows. Manage via time slot configuration.
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
                                ✓ Time slots configured: {timeSlotConfig.timeSlots.length} slots on {timeSlotConfig.operatingDays.length} days
                              </p>
                            </div>
                          )}
                        </FeatureSectionContent>
                      )}
                    </FeatureSection>

                    {/* Repeatable Feature */}
                    <FeatureSection>
                      <ToggleSwitch
                        value={!!repeatableEnabled}
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
                            <p className="mt-2 text-xs text-amber-600">⚠ With timeslots enabled, users must select multiple slots</p>
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
                            <label key={option.value} className="flex cursor-pointer items-center gap-2">
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

                    {/* Transfer Feature */}
                    <FeatureSection>
                      <ToggleSwitch
                        value={!!transferEnabled}
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
                          <RHFTextField name="price" type="number" placeholder="Enter Transfer Fee" step="0.01" min="0" disabled={isLoading} />
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
                                checked={earlyBirdEnabled || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setValue('features.earlyBirdEnabled', checked, {
                                    shouldDirty: true,
                                  });
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
                              <span className="text-sm font-medium">Early Bird Pricing</span>
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
                                  setValue('features.lastMinuteEnabled', checked, {
                                    shouldDirty: true,
                                  });
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
                              <span className="text-sm font-medium">Last Minute Pricing</span>
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
                        value={!!fasttrackEnabled}
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
                        value={!!reservationEnabled}
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

                    <div>
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
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-2">
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="px-4 py-2">
                      Cancel
                    </Button>

                    {isLoading || addTicketingLoading || updateTicketingLoading ? (
                      <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                        <ButtonLoading title={editMode ? 'Updating' : 'Creating'} />
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
      <TimeSlotConfigModal open={showTimeSlotModal} onClose={() => setShowTimeSlotModal(false)} onSave={handleTimeSlotSave} />
    </>
  );
};

export default TicketingModal;
