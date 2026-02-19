'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddBundleMutation, useUpdateBundleMutation } from '@/store/Reducer/bundles-api';
import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
import { useGetMenuMinifyDataQuery } from '@/store/Reducer/menu-items-api';
import { useGetReservationsQuery } from '@/store/Reducer/reservations-api';
import { useGetTicketingByEventQuery } from '@/store/Reducer/ticketing-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Package } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import BundleBuilderTabs from './bundle-builder-tabs';
import { BundleFormValues, BundleModalProps, MenuItemData, ReservationData, TicketData } from './bundle-modal.types';
import { calculateDiscount, calculateOriginalPrice, formatDateTimeForAPI, parseDateTimeFromAPI } from './helpers';
import PricingSection from './pricing-section';
import { bundleSchema, defaultValues } from './schema';

const BundleModal = ({ open, onClose, isEdit = false, selectedData, companyId, organizationId, userType }: BundleModalProps) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'reservations' | 'preorders'>('tickets');
  const isInitializingEdit = useRef(false);

  const [addBundle, { isLoading: addBundleLoading }] = useAddBundleMutation();
  const [updateBundle, { isLoading: updateBundleLoading }] = useUpdateBundleMutation();

  const methods = useForm<BundleFormValues>({
    resolver: yupResolver(bundleSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;

  const tickets = watch('tickets') || [];
  const reservations = watch('reservations') || [];
  const preorders = watch('preorders') || [];
  const bundlePrice = watch('price');
  const event = watch('event');

  // EVENTS -----------------------------------
  const { data: eventData, isLoading: isLoadingEvents } = useGetEventsByOrganizationQuery(
    {
      organization: organizationId,
    },
    {
      skip: !organizationId,
    }
  );

  const eventOptions = (eventData || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.title || 'No Title',
  }));

  // TICKETS -----------------------------------
  const {
    data: ticketData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
  } = useGetTicketingByEventQuery(
    {
      eventId: event || undefined,
    },
    {
      skip: !event || !organizationId,
    }
  );

  const ticketsData: TicketData[] = ticketData?.data || [];

  const ticketOptions = ticketsData.map((ticket) => ({
    label: `${ticket?.title} - €${ticket?.amount}`,
    value: ticket?._id,
    price: ticket?.amount,
  }));

  // RESERVATIONS -----------------------------------
  const {
    data: reservationsDataResponse,
    isLoading: isReservationsLoading,
    isFetching: isReservationsFetching,
  } = useGetReservationsQuery({
    page: 0,
    limit: 10000,
    companyOrganizer: userType === 'super-admin' ? companyId : undefined,
    organizationsId: userType === 'organizer' ? organizationId : undefined,
  });

  // Map Reservation[] to ReservationData[] and provide default for amount
  const reservationsData: ReservationData[] = (reservationsDataResponse?.data || []).map((r: any) => ({
    _id: r._id,
    reservationType: r.reservationType,
    amount: r.amount ?? 0,
    maxCapacityPerReservation: r.maxCapacityPerReservation,
  }));

  const reservationOptions = reservationsData.map((reservation) => ({
    label: `${reservation?.reservationType} - €${reservation?.amount} (Capacity: ${reservation?.maxCapacityPerReservation})`,
    value: reservation?._id,
    price: reservation?.amount,
    capacity: reservation?.maxCapacityPerReservation,
  }));

  // MENU ITEMS -----------------------------------
  const {
    data: menuItemsDataResponse,
    isLoading: isMenuItemsLoading,
    isFetching: isMenuItemsFetching,
  } = useGetMenuMinifyDataQuery({
    page: 0,
    limit: 10000,
    companyOrganizer: companyId || undefined,
  });

  const menuItemsData: MenuItemData[] = menuItemsDataResponse?.data || [];

  const menuItemOptions = menuItemsData.map((menuItem) => ({
    label: `${menuItem?.title} - €${menuItem?.price}`,
    value: menuItem?._id,
    price: menuItem?.price,
  }));

  useEffect(() => {
    if (isEdit && selectedData && open) {
      isInitializingEdit.current = true;

      const startDateTime = parseDateTimeFromAPI(selectedData?.startDate);
      const endDateTime = parseDateTimeFromAPI(selectedData?.endDate);

      const mappedValues: BundleFormValues = {
        name: selectedData?.name || '',
        description: selectedData?.description || '',
        event: selectedData?.event || '',
        startDate: startDateTime.date,
        endDate: endDateTime.date,
        price: selectedData?.discountedPrice || 0,
        tickets:
          selectedData?.bundleDetails?.ticketings?.map((t: any) => ({
            ticketId: t.ticketType,
            quantity: t.quantity,
          })) || [],
        reservations:
          selectedData?.bundleDetails?.reservations?.map((r: any) => ({
            reservationId: r.reservationType,
            quantity: r.quantity,
          })) || [],
        preorders:
          selectedData?.bundleDetails?.preOrderItems?.map((p: any) => ({
            menuItemId: p.menuItem,
            quantity: p.quantity,
          })) || [],
        status: selectedData?.status || 'active',
      };

      reset(mappedValues);

      setTimeout(() => {
        isInitializingEdit.current = false;
      }, 100);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, selectedData, reset, open]);

  const originalPrice = calculateOriginalPrice(tickets, reservations, preorders, ticketsData, reservationsData, menuItemsData);
  const discount = calculateDiscount(originalPrice, bundlePrice);
  const totalItems = tickets.length + reservations.length + preorders.length;

  const addTicket = (ticketId: string) => {
    setValue('tickets', [...tickets, { ticketId, quantity: 1 }], {
      shouldDirty: true,
    });
  };

  const removeTicket = (index: number) => {
    const newTickets = tickets.filter((_: any, i: number) => i !== index);
    setValue('tickets', newTickets, { shouldDirty: true });
  };

  const updateTicketQuantity = (index: number, quantity: number) => {
    const newTickets = [...tickets];
    newTickets[index].quantity = Math.max(1, quantity);
    setValue('tickets', newTickets, { shouldDirty: true });
  };

  const addReservation = (reservationId: string) => {
    setValue('reservations', [...reservations, { reservationId, quantity: 1 }], {
      shouldDirty: true,
    });
  };

  const removeReservation = (index: number) => {
    const newReservations = reservations.filter((_: any, i: number) => i !== index);
    setValue('reservations', newReservations, { shouldDirty: true });
  };

  const updateReservationQuantity = (index: number, quantity: number) => {
    const newReservations = [...reservations];
    newReservations[index].quantity = Math.max(1, quantity);
    setValue('reservations', newReservations, { shouldDirty: true });
  };

  const addPreorder = (menuItemId: string) => {
    setValue('preorders', [...preorders, { menuItemId, quantity: 1 }], {
      shouldDirty: true,
    });
  };

  const removePreorder = (index: number) => {
    const newPreorders = preorders.filter((_: any, i: number) => i !== index);
    setValue('preorders', newPreorders, { shouldDirty: true });
  };

  const updatePreorderQuantity = (index: number, quantity: number) => {
    const newPreorders = [...preorders];
    newPreorders[index].quantity = Math.max(1, quantity);
    setValue('preorders', newPreorders, { shouldDirty: true });
  };

  const transformToPayload = (data: BundleFormValues) => {
    const startDateTime = formatDateTimeForAPI(data.startDate, '10:00');
    const endDateTime = formatDateTimeForAPI(data.endDate, '23:59');

    const payload: any = {
      organization: organizationId,
      name: data.name,
      description: data.description,
      originalPrice: originalPrice,
      discountedPrice: data.price,
      discountPercentage: discount,
      startDate: startDateTime,
      endDate: endDateTime,
      bundleDetails: {
        ticketings: data.tickets.map((t) => ({
          ticketType: t.ticketId,
          quantity: t.quantity,
        })),
        reservations: data.reservations.map((r) => ({
          reservationType: r.reservationId,
          quantity: r.quantity,
        })),
        preOrderItems: data.preorders.map((p) => ({
          menuItem: p.menuItemId,
          quantity: p.quantity,
        })),
      },
    };

    if (data.event) {
      payload.event = data.event;
    }

    if (isEdit && selectedData) {
      payload.id = selectedData._id;
      payload.status = data.status;
    }

    return payload;
  };

  const handleSubmit = async (formData: BundleFormValues) => {
    try {
      if (totalItems === 0) {
        showError('Please add at least one item to the bundle');
        return;
      }

      // Validation: End date must be after start date
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        showError('Please provide valid start and end dates.');
        return;
      }
      if (end <= start) {
        showError('End date must be after the start date.');
        return;
      }

      // Calculate original price and discount
      const original = calculateOriginalPrice(
        formData.tickets,
        formData.reservations,
        formData.preorders,
        ticketsData,
        reservationsData,
        menuItemsData
      );
      const discountPercent = calculateDiscount(original, formData.price);

      // Validation: Discounted price must be less than original price
      if (formData.price >= original) {
        showError('Bundle price must be less than the original price.');
        return;
      }

      // Validation: Discount percentage must be positive
      if (discountPercent <= 0) {
        showError('Discount percentage must be positive.');
        return;
      }

      const payload = transformToPayload(formData);

      const response = isEdit ? await updateBundle(payload).unwrap() : await addBundle(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Bundle updated successfully' : 'Bundle created successfully'));

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    isInitializingEdit.current = false;
    onClose();
  };

  const isLoading = addBundleLoading || updateBundleLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[800px]!"
        >
          <DialogHeader className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-opacity-20 rounded-lg bg-gray-800 p-2 dark:bg-gray-200">
                  <Package className="text-white dark:text-gray-900" size={24} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                    {isEdit ? 'Edit Bundle' : 'Create New Bundle'}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white">Package multiple items into an attractive offer</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="flex w-full flex-col gap-6">
                <div className="dark:bg-secondary">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-gray-200 dark:text-black">
                      1
                    </div>
                    <span className="dark:text-gray-100">Basic Information</span>
                  </h3>

                  <div className="space-y-4">
                    <RHFTextField name="name" label="Bundle Name" placeholder="e.g., VIP Experience Package, Weekend Special" />

                    <RHFTextField
                      name="description"
                      label="Description"
                      placeholder="Describe the value proposition and what makes this bundle special"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-2">
                      {isLoadingEvents ? (
                        <div className="space-y-2">
                          <Skeleton className="ml-1 h-3 w-20" />
                          <Skeleton className="h-11" />
                        </div>
                      ) : (
                        <RHFCustomDropdown
                          name="event"
                          label="Event (Optional)"
                          placeholder="Select Event"
                          options={eventOptions}
                          isLoading={isLoadingEvents}
                          showNone={true}
                        />
                      )}
                    </div>

                    <RHFDate label="Start Date" name="startDate" minDate={new Date()} placeholder="Select Start Date" />

                    <RHFDate label="End Date" name="endDate" minDate={new Date()} placeholder="Select End Date" />
                  </div>

                  {isEdit && (
                    <div className="mt-4">
                      <RHFSelectField
                        name="status"
                        label="Status"
                        placeholder="Select Status"
                        options={[
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                      />
                    </div>
                  )}
                </div>

                <BundleBuilderTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  totalItems={totalItems}
                  tickets={tickets}
                  reservations={reservations}
                  preorders={preorders}
                  event={event}
                  ticketOptions={ticketOptions}
                  reservationOptions={reservationOptions}
                  menuItemOptions={menuItemOptions}
                  ticketsData={ticketsData}
                  reservationsData={reservationsData}
                  menuItemsData={menuItemsData}
                  isTicketsLoading={isTicketsLoading || isTicketsFetching}
                  isReservationsLoading={isReservationsLoading || isReservationsFetching}
                  isMenuItemsLoading={isMenuItemsLoading || isMenuItemsFetching}
                  addTicket={addTicket}
                  removeTicket={removeTicket}
                  updateTicketQuantity={updateTicketQuantity}
                  addReservation={addReservation}
                  removeReservation={removeReservation}
                  updateReservationQuantity={updateReservationQuantity}
                  addPreorder={addPreorder}
                  removePreorder={removePreorder}
                  updatePreorderQuantity={updatePreorderQuantity}
                />

                <PricingSection originalPrice={originalPrice} bundlePrice={bundlePrice} discount={discount} />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t pt-5 dark:border-gray-700">
                <div className="mr-auto text-sm text-gray-600 dark:text-gray-400">
                  {totalItems === 0 ? 'Add items to create your bundle' : `${totalItems} items • Total value: €${originalPrice}`}
                </div>
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
                    {isEdit ? 'Update Bundle' : 'Create Bundle'}
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

export default BundleModal;
