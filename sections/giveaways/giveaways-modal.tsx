'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAddGiveawayMutation,
  useGetOrganizerGiveawayEventsAdminSideQuery,
  useGetOrganizerGiveawayEventsQuery,
  useGetOrganizerGiveawayEventTicketsQuery,
  useUpdateGiveawayMutation,
} from '@/store/Reducer/giveaways-api';
import { useGetTicketingByEventQuery } from '@/store/Reducer/ticketing-api';
import { getErrorMessage } from '@/utils/api';
import { fDateTime, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TicketingModal from '../ticketing-view/ticketing-modal';

const toLocalDateTimeInput = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDatePart = (dateTime?: string | Date) => {
  if (!dateTime) return '';
  const normalized = dateTime instanceof Date ? toLocalDateTimeInput(dateTime) : dateTime;
  const [datePart] = normalized.split('T');
  return datePart || '';
};

const getTimePart = (dateTime?: string | Date) => {
  if (!dateTime) return '';
  const normalized = dateTime instanceof Date ? toLocalDateTimeInput(dateTime) : dateTime;
  const parts = normalized.split('T');
  const timePart = parts[1] || '';
  return timePart.slice(0, 5);
};

const updateSplitDateTime = (datePart: string, timePart: string) => {
  if (!datePart || !timePart) return '';
  return `${datePart}T${timePart}`;
};

const defaultValues = {
  title: '',
  event: '',
  ticket: '',
  numberOfWinners: '' as any,
  ticketsPerWinner: '' as any,
  ticketTypeOption: 'existing' as 'existing' | 'new',
  endDateTime: '',
  status: 'active' as 'active' | 'inactive',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required').trim().min(3, 'Title must be at least 3 characters'),
  event: Yup.string().required('Event is required'),
  ticket: Yup.string().when('ticketTypeOption', {
    is: 'existing',
    then: (schema) => schema.required('Please select a ticket type'),
    otherwise: (schema) => schema.default(''),
  }),
  numberOfWinners: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Number of winners is required')
    .min(1, 'Must be at least 1')
    .integer('Must be a whole number'),
  ticketsPerWinner: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Tickets per winner is required')
    .min(1, 'Must be at least 1')
    .integer('Must be a whole number'),
  ticketTypeOption: Yup.string()
    .oneOf(['existing', 'new'] as const)
    .required('Ticket type option is required'),
  // endDateTime: Yup.string().required('End date & time is required'),
  endDateTime: Yup.date()
  .required('End date is required')
  .min(new Date(), 'End date must be a future date')
  .typeError('Invalid End date')
  .default(null),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as any;

type GiveawayFormValues = Yup.InferType<typeof schema>;

type GiveawayModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  organizationId?: string | null;
  userType: 'organizer' | 'super-admin';
};

const GiveawayModal = ({ open, onClose, isEdit = false, selectedData, organizationId, userType }: GiveawayModalProps) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [endDatePart, setEndDatePart] = useState('');
  const [endTimePart, setEndTimePart] = useState('');
  const isInitializingEdit = useRef(false);

  const [addGiveaway, { isLoading: addGiveawayLoading }] = useAddGiveawayMutation();
  const [updateGiveaway, { isLoading: updateGiveawayLoading }] = useUpdateGiveawayMutation();

  const methods = useForm<GiveawayFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = methods;

  const ticketTypeOption = watch('ticketTypeOption');
  const selectedEventId = watch('event');
  const numberOfWinners = watch('numberOfWinners');
  const ticketsPerWinner = watch('ticketsPerWinner');

  // FETCH EVENTS BASED ON ORGANIZATION
  const { data: eventData, isLoading: isLoadingEvents } = useGetOrganizerGiveawayEventsAdminSideQuery(
    {
      organizationId: organizationId,
    },
    {
      skip: !organizationId,
    }
  );

  // FETCH TICKETS BASED ON SELECTED EVENT
  const {
    data: ticketData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
    refetch: refetchTickets,
  } = useGetTicketingByEventQuery(
    {
      eventId: selectedEventId || undefined,
    },
    {
      skip: !selectedEventId || !organizationId,
    }
  );

  // FETCH ORGANIZER EVENTS IF USER IS ORGANIZER
  const { data: organizerEventData, isLoading: isLoadingOrganizerEvents } = useGetOrganizerGiveawayEventsQuery(
    {},
    {
      skip: userType !== 'organizer',
    }
  );

  // FETCH TICKET TYPES BASED ON SELECTED EVENT
  const { data: organizerTicketData, isLoading: isTicketTypesLoading } = useGetOrganizerGiveawayEventTicketsQuery(
    {
      eventId: selectedEventId || undefined,
    },
    {
      skip: !selectedEventId || userType !== 'organizer',
    }
  );

  // OPTIONS MAPPING
  const eventOptions = (eventData?.data || [])?.map((v: any) => ({
    value: v?._id.toString(),
    label: v?.title || 'No Title',
  }));

  const organizationEventOptions = (organizerEventData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.title || 'No Title',
  }));

  const ticketTypeOptions =
    ticketData?.data?.map((ticket: any) => ({
      label: `${ticket?.title}`,
      value: ticket?._id,
    })) || [];

  const organizerTicketTypeOptions =
    organizerTicketData?.data?.map((ticket: any) => ({
      label: `${ticket?.title}`,
      value: ticket?._id,
    })) || [];

  // EDIT MODE DATA POPULATION
  useEffect(() => {
    if (isEdit && selectedData && open) {
      isInitializingEdit.current = true;

      const mappedValues: GiveawayFormValues = {
        title: selectedData?.title || '',
        event: selectedData?.event?._id || selectedData?.eventId || '',
        ticket: selectedData?.ticket?._id || selectedData?.ticketId || '',
        numberOfWinners: selectedData?.numberOfWinners || ('' as any),
        ticketsPerWinner: selectedData?.ticketsPerWinner || ('' as any),
        ticketTypeOption: 'existing',
        endDateTime: selectedData?.endDateTime ? parseDateTimeFromAPI(selectedData.endDateTime) : '',
        status: selectedData?.status || 'active',
      };

      reset(mappedValues);
      setEndDatePart(getDatePart(mappedValues.endDateTime));
      setEndTimePart(getTimePart(mappedValues.endDateTime));

      setTimeout(() => {
        isInitializingEdit.current = false;
      }, 100);
    } else if (open && !isEdit) {
      reset(defaultValues);
      setEndDatePart('');
      setEndTimePart('');
    }
  }, [isEdit, selectedData, open, reset]);

  // CLEAR TICKET WHEN EVENT CHANGES
  useEffect(() => {
    if (!isInitializingEdit.current && !isEdit) {
      setValue('ticket', '');
    }
  }, [selectedEventId, setValue, isEdit]);

  // CLEAR FIELDS WHEN TICKET TYPE OPTION CHANGES
  useEffect(() => {
    if (!isInitializingEdit.current) {
      if (ticketTypeOption === 'new') {
        setValue('ticket', '');
      }
    }
  }, [ticketTypeOption, setValue]);

  // CALCULATE TOTAL TICKETS
  const totalTickets =
    numberOfWinners && ticketsPerWinner && Number(numberOfWinners) > 0 && Number(ticketsPerWinner) > 0
      ? Number(numberOfWinners) * Number(ticketsPerWinner)
      : 0;

  // FORMAT DATETIME FOR API: "2025-12-30 05:00 PM"
  const formatDateTimeForAPI = (date: string | Date): string => {
    if (!date) return '';
    return fDateTime(date, formatStr.paramCase.dateTimeRev) || '';
  };

  // PARSE DATETIME FROM API: "2025-12-30 05:00 PM" to "2025-12-30T17:00"
  const parseDateTimeFromAPI = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error parsing datetime:', error);
      return '';
    }
  };

  // VALIDATION FUNCTION
  const validateGiveawayForm = (formData: GiveawayFormValues): { isValid: boolean; errorMessage?: string } => {
    // Validation: Organization is required
    if (userType !== 'organizer' && !organizationId) {
      return { isValid: false, errorMessage: 'Organization is required' };
    }

    // Validation: Ticket is required when using existing ticket type
    if (formData.ticketTypeOption === 'existing' && !formData.ticket) {
      return { isValid: false, errorMessage: 'Please select a ticket type' };
    }

    // Validation: End date must be valid and in the future
    const endDate = new Date(formData.endDateTime);
    const now = new Date();

    if (isNaN(endDate.getTime())) {
      return { isValid: false, errorMessage: 'Please provide a valid end date and time' };
    }

    if (endDate <= now) {
      return { isValid: false, errorMessage: 'End date must be in the future' };
    }

    // Validation: Number of winners must be positive
    if (Number(formData.numberOfWinners) <= 0) {
      return { isValid: false, errorMessage: 'Number of winners must be greater than 0' };
    }

    // Validation: Tickets per winner must be positive
    if (Number(formData.ticketsPerWinner) <= 0) {
      return { isValid: false, errorMessage: 'Tickets per winner must be greater than 0' };
    }

    // Validation: Title must not be empty after trim
    if (!formData.title || formData.title.trim().length === 0) {
      return { isValid: false, errorMessage: 'Title is required' };
    }

    return { isValid: true };
  };

  // SUBMIT HANDLER
  const handleSubmit = async (formData: GiveawayFormValues) => {
    try {
      const validation = validateGiveawayForm(formData);

      if (!validation.isValid) {
        showError(validation.errorMessage || 'Validation failed');
        return;
      }

      const payload: any = {
        title: formData.title.trim(),
        event: formData.event,
        ticket: formData.ticket,
        numberOfWinners: Number(formData.numberOfWinners),
        ticketsPerWinner: Number(formData.ticketsPerWinner),
        endDateTime: formatDateTimeForAPI(formData.endDateTime),
        // organization: organizationId,
        organization: userType === 'organizer' ? undefined : organizationId,
      };

      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      const response = isEdit && selectedData ? await updateGiveaway(payload).unwrap() : await addGiveaway(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Giveaway updated successfully' : 'Giveaway created successfully'));

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setEndDatePart('');
    setEndTimePart('');
    isInitializingEdit.current = false;
    onClose();
  };

  const handleEndDateTimeChange = (datePart: string, timePart: string) => {
    setEndDatePart(datePart);
    setEndTimePart(timePart);
    setValue('endDateTime', updateSplitDateTime(datePart, timePart), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAddTicket = () => {
    setShowTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    if (selectedEventId) {
      refetchTickets();
    }
  };

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const isLoading = addGiveawayLoading || updateGiveawayLoading;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
          >
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{isEdit ? 'Edit Giveaway' : 'Create Giveaway'}</DialogTitle>
              </div>
            </DialogHeader>

            <div className="w-full">
              <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
                <div className="mt-7 flex w-full flex-col gap-4">
                  <RHFTextField name="title" label="Title" placeholder="Enter giveaway title" />

                  {/* Event Selection */}
                  {isLoadingEvents || isLoadingOrganizerEvents ? (
                    <div className="w-full space-y-2">
                      <Skeleton className="ml-1 h-3 w-20" />
                      <Skeleton className="h-8" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="event"
                      label="Select Event"
                      placeholder="Choose an event..."
                      options={userType === 'organizer' ? organizationEventOptions : eventOptions}
                      isLoading={isLoadingEvents || isLoadingOrganizerEvents}
                      showNone={false}
                    />
                  )}

                  {/* Winners and Tickets */}
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField name="numberOfWinners" label="Number of Winners" placeholder="Enter number of winners" type="number" min="1" />

                    <RHFTextField name="ticketsPerWinner" label="Tickets per Winner" placeholder="Enter tickets per winner" type="number" min="1" />
                  </div>

                  {/* Total Tickets Preview */}
                  {totalTickets > 0 && (
                    <div className="bg-primary/10 border-primary/20 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-400">Total tickets to distribute:</span>
                        <span className="font-bold text-blue-700 dark:text-blue-400">{totalTickets} tickets</span>
                      </div>
                    </div>
                  )}

                  {/* Ticket Type Selection */}
                  <div>
                    <label className="mb-3 block text-sm font-medium">
                      Ticket Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {/* Existing Ticket Type */}
                      <label className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors dark:border-gray-700">
                        <input
                          type="radio"
                          name="ticketTypeOption"
                          value="existing"
                          checked={ticketTypeOption === 'existing'}
                          onChange={() => {
                            setValue('ticketTypeOption', 'existing' as any, { shouldDirty: true });
                          }}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <div className="mb-1 font-medium">Use Existing Ticket Type</div>
                          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">Select from your event&apos;s existing ticket types</div>
                          <div>
                            {isTicketsLoading || isTicketsFetching || isTicketTypesLoading ? (
                              <div className="mt-2 space-y-2">
                                <Skeleton className="h-8 w-full" />
                              </div>
                            ) : (
                              <RHFCustomDropdown
                                label=""
                                name="ticket"
                                placeholder={selectedEventId ? 'Select ticket type...' : 'Select event first'}
                                disabled={!selectedEventId || ticketTypeOption !== 'existing'}
                                options={userType === 'organizer' ? organizerTicketTypeOptions : ticketTypeOptions}
                                isLoading={userType === 'organizer' ? isTicketTypesLoading : isTicketsLoading || isTicketsFetching}
                                showNone={false}
                              />
                            )}
                          </div>
                        </div>
                      </label>

                      {/* New Ticket Type */}
                      <label className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors dark:border-gray-700">
                        <input
                          type="radio"
                          name="ticketTypeOption"
                          value="new"
                          checked={ticketTypeOption === 'new'}
                          onChange={() => {
                            setValue('ticketTypeOption', 'new' as any, { shouldDirty: true });
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="mb-1 font-medium">Create New Ticket Type</div>
                          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">Create a special ticket type just for this giveaway</div>
                          {ticketTypeOption === 'new' && (
                            <div className="mt-3 space-y-3">
                              <Button type="button" variant="outline" onClick={handleAddTicket} className="w-full">
                                Add Ticket
                              </Button>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* End Date & Time */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="giveaway-end-date" className="mb-1 block text-sm font-medium">
                        End Date
                      </label>
                      <input
                        id="giveaway-end-date"
                        type="date"
                        title="End date"
                        value={endDatePart}
                        onChange={(e) => handleEndDateTimeChange(e.target.value, endTimePart)}
                        className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-[#212121] dark:placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">End Time</label>
                      <Time24hInput
                        title="End time"
                        value={endTimePart}
                        onChange={(value) => handleEndDateTimeChange(endDatePart, value)}
                        placeholder="HH:mm"
                        className="w-full"
                      />
                    </div>
                  </div>
                  {errors.endDateTime?.message && <p className="-mt-2 text-xs text-red-500">{String(errors.endDateTime.message)}</p>}
                  <p className="text-muted-foreground -mt-2 text-xs">Winners will be automatically selected when the giveaway ends</p>

                  {/* Info Banner */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div className="flex-1">
                        <p className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-300">Automatic Winner Selection</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          When the giveaway ends, the system will randomly select winners from all entries and automatically issue tickets to their
                          accounts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status - Only in Edit Mode */}
                  {isEdit && <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <Button type="button" variant="outline" onClick={handleClose} className="cursor-pointer px-7">
                    Cancel
                  </Button>

                  {isLoading ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Giveaway' : 'Create Giveaway'}
                    </Button>
                  )}
                </div>
              </FormProvider>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      {/* Ticket Modal */}
      {showTicketModal && (
        <TicketingModal
          open={showTicketModal}
          onClose={handleCloseTicketModal}
          editMode={false}
          selectedData={null}
          selectedOrganization={organizationId}
        />
      )}
    </>
  );
};

export default GiveawayModal;
