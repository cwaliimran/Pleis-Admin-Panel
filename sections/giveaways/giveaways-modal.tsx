'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
import { useGetTicketingByEventQuery } from '@/store/Reducer/ticketing-api';
import { getErrorMessage } from '@/utils/api';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TicketingModal from '../ticketing-view/ticketing-modal';

const defaultValues = {
  event: '',
  winnerCount: '' as any,
  ticketQuantity: '' as any,
  ticketTypeOption: 'existing',
  existingTicketType: '',
  newTicketTypeName: '',
  endDate: '',
  status: 'active',
};

const schema = Yup.object().shape({
  event: Yup.string().required('Event is required'),
  winnerCount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Number of winners is required')
    .min(1, 'Must be at least 1'),
  ticketQuantity: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Tickets per winner is required')
    .min(1, 'Must be at least 1'),
  ticketTypeOption: Yup.string()
    .oneOf(['existing', 'new'] as const)
    .required('Ticket type option is required'),
  existingTicketType: Yup.string().when('ticketTypeOption', {
    is: 'existing',
    then: (schema) => schema.required('Please select a ticket type'),
    otherwise: (schema) => schema.default(''),
  }),
  newTicketTypeName: Yup.string().when('ticketTypeOption', {
    is: 'new',
    then: (schema) => schema.required('Ticket type name is required'),
    otherwise: (schema) => schema.default(''),
  }),
  endDate: Yup.string().required('End date is required'),
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
  organizationId?: string;
};

const GiveawayModal = ({ open, onClose, isEdit = false, selectedData, organizationId }: GiveawayModalProps) => {
  const [showTicketModal, setShowTicketModal] = useState(false);

  // const [addGiveaway, { isLoading: addGiveawayLoading }] = useAddGiveawayMutation();
  // const [updateGiveaway, { isLoading: updateGiveawayLoading }] = useUpdateGiveawayMutation();

  const methods = useForm<GiveawayFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;

  const ticketTypeOption = watch('ticketTypeOption');
  const selectedEventId = watch('event');
  const winnerCount = watch('winnerCount');
  const ticketQuantity = watch('ticketQuantity');

  // API QUERIES
  const { data: eventData, isLoading: isLoadingEvents } = useGetEventsByOrganizationQuery({});

  const {
    data: ticketData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
  } = useGetTicketingByEventQuery(
    {
      eventId: selectedEventId || undefined,
    },
    {
      skip: !selectedEventId || !organizationId,
    }
  );

  // OPTIONS MAPPING
  const eventOptions =
    eventData?.data?.map((event: any) => ({
      label: event?.basicInfo?.title || event?.title,
      value: event?._id,
    })) || [];

  const ticketTypeOptions =
    ticketData?.data?.map((ticket: any) => ({
      label: `${ticket?.name} (€${ticket?.price})`,
      value: ticket?._id,
    })) || [];

  // EDIT MODE DATA POPULATION
  useEffect(() => {
    if (isEdit && selectedData && open) {
      const mappedValues: any = {
        event: selectedData?.event?._id || selectedData?.event || '',
        winnerCount: selectedData?.winnerCount || ('' as any),
        ticketQuantity: selectedData?.ticketQuantity || ('' as any),
        ticketTypeOption: selectedData?.ticketTypeOption || 'existing',
        existingTicketType: selectedData?.existingTicketType?._id || selectedData?.existingTicketType || '',
        newTicketTypeName: selectedData?.newTicketTypeName || '',
        endDate: selectedData?.endDate ? new Date(selectedData.endDate) : '',
        status: selectedData?.status || 'active',
      };

      reset(mappedValues);
    }
  }, [isEdit, selectedData, open, reset]);

  // CLEAR TICKET TYPE WHEN EVENT CHANGES
  useEffect(() => {
    if (!isEdit) {
      setValue('existingTicketType', '');
    }
  }, [selectedEventId, setValue, isEdit]);

  // CLEAR FIELDS WHEN TICKET TYPE OPTION CHANGES
  useEffect(() => {
    if (ticketTypeOption === 'existing') {
      setValue('newTicketTypeName', '');
    } else {
      setValue('existingTicketType', '');
    }
  }, [ticketTypeOption, setValue]);

  // CALCULATE TOTAL TICKETS
  const totalTickets =
    winnerCount && ticketQuantity && Number(winnerCount) > 0 && Number(ticketQuantity) > 0 ? Number(winnerCount) * Number(ticketQuantity) : 0;

  // SUBMIT HANDLER
  const handleSubmit = async (formData: GiveawayFormValues) => {
    try {
      const payload: any = {
        event: formData.event,
        winnerCount: Number(formData.winnerCount),
        ticketQuantity: Number(formData.ticketQuantity),
        ticketTypeOption: formData.ticketTypeOption,
        endDate: fDate(formData.endDate, formatStr.paramCase.db),
      };

      if (formData.ticketTypeOption === 'existing') {
        payload.existingTicketType = formData.existingTicketType;
      } else {
        payload.newTicketTypeName = formData.newTicketTypeName;
      }

      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      // TODO: Uncomment when API is ready
      // const response = isEdit && selectedData
      //   ? await updateGiveaway(payload).unwrap()
      //   : await addGiveaway(payload).unwrap();

      // if (!response) {
      //   showError('No response from server. Please try again later.');
      //   return;
      // }

      // if (response?.error) {
      //   showError(getErrorMessage(response.error));
      //   return;
      // }

      // showSuccess(
      //   response?.message || (isEdit ? 'Giveaway updated successfully' : 'Giveaway created successfully')
      // );

      // Temporary success message (remove when API is ready)
      showSuccess(isEdit ? 'Giveaway updated successfully' : 'Giveaway created successfully');
      console.log('Payload:', payload);

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleAddTicket = () => {
    setShowTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
  };

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // const isLoading = addGiveawayLoading || updateGiveawayLoading;
  const isLoading = false; // Temporary until API is ready

  // TODO: Replace with actual organization ID
  const dummyOrganization = 'dummy-organization-id-123';

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
                  {/* Event Selection */}
                  {isLoadingEvents ? (
                    <div className="w-full space-y-2">
                      <Skeleton className="ml-1 h-3 w-20" />
                      <Skeleton className="h-10" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="event"
                      label="Select Event"
                      placeholder="Choose an event..."
                      options={eventOptions}
                      isLoading={isLoadingEvents}
                      showNone={false}
                    />
                  )}

                  {/* Winners and Tickets */}
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField name="winnerCount" label="Number of Winners" placeholder="Enter number of winners" type="number" min="1" />

                    <RHFTextField name="ticketQuantity" label="Tickets per Winner" placeholder="Enter tickets per winner" type="number" min="1" />
                  </div>

                  {/* Total Tickets Preview */}
                  {totalTickets > 0 && (
                    <div className="bg-primary/10 border-primary/20 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-sm">Total tickets to distribute:</span>
                        <span className="text-primary font-bold">{totalTickets} tickets</span>
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
                            setValue('ticketTypeOption', 'existing' as any);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="mb-1 font-medium">Use Existing Ticket Type</div>
                          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">Select from your event&apos;s existing ticket types</div>
                          {ticketTypeOption === 'existing' && selectedEventId && (
                            <>
                              {isTicketsLoading || isTicketsFetching ? (
                                <div className="mt-2 space-y-2">
                                  <Skeleton className="h-10 w-full" />
                                </div>
                              ) : (
                                <RHFCustomDropdown
                                  name="existingTicketType"
                                  label=""
                                  placeholder="Select ticket type..."
                                  options={ticketTypeOptions}
                                  isLoading={isTicketsLoading}
                                  showNone={false}
                                />
                              )}
                            </>
                          )}
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
                            setValue('ticketTypeOption', 'new' as any);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="mb-1 font-medium">Create New Ticket Type</div>
                          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">Create a special ticket type just for this giveaway</div>
                          {ticketTypeOption === 'new' && (
                            <div className="mt-3 space-y-3">
                              {/* <RHFTextField name="newTicketTypeName" label="" placeholder="e.g., Giveaway Entry (Free)" /> */}
                              <Button type="button" variant="outline" onClick={handleAddTicket} className="w-full">
                                Add Ticket
                              </Button>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* End Date */}
                  <RHFTextField name="endDate" label="End Date & Time" placeholder="Select end date" type="datetime-local" />
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
          selectedOrganization={dummyOrganization}
        />
      )}
    </>
  );
};

export default GiveawayModal;
