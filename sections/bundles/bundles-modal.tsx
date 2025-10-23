'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
// import { useGetMenuItemsQuery } from '@/store/Reducer/menu-items-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  Package,
  Ticket,
  Calendar,
  Trash2,
  Plus,
  ChevronDown,
} from 'lucide-react';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { useGeteventsQuery } from '@/store/Reducer/events';

// Professional Dropdown Component
const ProfessionalDropdown = ({
  options,
  onSelect,
  placeholder,
  icon: Icon,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter((option: any) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: any) => {
    onSelect(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
      >
        <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {Icon && <Icon size={18} />}
          {placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No items found
                </div>
              ) : (
                filteredOptions.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full cursor-pointer px-4 py-3 text-left text-sm transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const defaultValues: BundleFormValues = {
  name: '',
  description: '',
  event: '',
  startDate: '',
  endDate: '',
  price: 0,
  tickets: [],
  reservations: [],
  preorders: [],
  status: 'active',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Bundle name is required'),
  description: Yup.string().required('Description is required'),
  event: Yup.string().optional(),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
  price: Yup.number()
    .required('Bundle price is required')
    .min(0, 'Price must be at least 0'),
  tickets: Yup.array()
    .of(
      Yup.object().shape({
        ticketId: Yup.string().required('Ticket is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
      })
    )
    .default([]),
  reservations: Yup.array()
    .of(
      Yup.object().shape({
        reservationId: Yup.string().required('Reservation is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
      })
    )
    .default([]),
  preorders: Yup.array()
    .of(
      Yup.object().shape({
        menuItemId: Yup.string().required('Menu item is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
      })
    )
    .default([]),
  status: Yup.string().default('active'),
});

type BundleFormValues = Yup.InferType<typeof schema>;

type TicketData = {
  _id: string;
  name: string;
  price: number;
};

type ReservationData = {
  _id: string;
  name: string;
  price: number;
  capacity: number;
};

type MenuItemData = {
  _id: string;
  title: string;
  price: number;
};

type BundleModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  companyOrganizer?: string;
};

// Static data for tickets
const staticTicketsData: TicketData[] = [
  { _id: '1', name: 'General Admission', price: 50 },
  { _id: '2', name: 'VIP Ticket', price: 150 },
  { _id: '3', name: 'Early Bird', price: 40 },
  { _id: '4', name: 'Student Ticket', price: 30 },
];

// Static data for reservations
const staticReservationsData: ReservationData[] = [
  { _id: '1', name: 'VIP Table', price: 150, capacity: 8 },
  { _id: '2', name: 'Standard Table', price: 100, capacity: 6 },
  { _id: '3', name: 'Lounge Area', price: 200, capacity: 10 },
  { _id: '4', name: 'Private Booth', price: 250, capacity: 4 },
];

// Static data for menu items (fallback)
const staticMenuItemsData: MenuItemData[] = [
  { _id: '1', title: 'Sprite Mint', price: 200 },
  { _id: '2', title: 'Coca Cola 1.5', price: 200 },
  { _id: '3', title: 'Zinger Burger', price: 400 },
  { _id: '4', title: 'Chicken Wings', price: 350 },
];

const BundleModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
  companyOrganizer,
}: BundleModalProps) => {
  const [activeTab, setActiveTab] = useState<
    'tickets' | 'reservations' | 'preorders'
  >('tickets');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using static data for tickets and reservations
  const ticketsData = staticTicketsData;
  const reservationsData = staticReservationsData;
  const menuItemsData = staticMenuItemsData;
  // const ticketsLoading = false;
  // const reservationsLoading = false;

  // Real API call for menu items (with fallback to static data)
  // const { data: menuItemsResponse } = useGetMenuItemsQuery({
  //   page: 0,
  //   search: '',
  //   limit: '10000',
  //   status: 'active',
  // });

  // const menuItemsData: MenuItemData[] = menuItemsResponse?.data || staticMenuItemsData;

  const ticketOptions = ticketsData.map((ticket) => ({
    label: `${ticket.name} - €${ticket.price}`,
    value: ticket._id,
    price: ticket.price,
  }));

  const reservationOptions = reservationsData.map((reservation) => ({
    label: `${reservation.name} - €${reservation.price} (Capacity: ${reservation.capacity})`,
    value: reservation._id,
    price: reservation.price,
    capacity: reservation.capacity,
  }));

  const menuItemOptions = menuItemsData.map((menuItem) => ({
    label: `${menuItem.title} - €${menuItem.price}`,
    value: menuItem._id,
    price: menuItem.price,
  }));

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

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
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

  useEffect(() => {
    if (isEdit && selectedData) {
      reset({
        name: selectedData?.name || '',
        description: selectedData?.description || '',
        price: selectedData?.price || 0,
        tickets: selectedData?.tickets || [],
        reservations: selectedData?.reservations || [],
        preorders: selectedData?.preorders || [],
        status: selectedData?.status || 'active',
      });
    }
  }, [isEdit, selectedData, reset]);

  const calculateOriginalPrice = () => {
    const ticketTotal = tickets.reduce((sum: number, item: any) => {
      const ticket = ticketsData.find((t) => t._id === item.ticketId);
      return sum + (ticket?.price || 0) * item.quantity;
    }, 0);

    const reservationTotal = reservations.reduce((sum: number, item: any) => {
      const reservation = reservationsData.find(
        (r) => r._id === item.reservationId
      );
      return sum + (reservation?.price || 0) * item.quantity;
    }, 0);

    const preorderTotal = preorders.reduce((sum: number, item: any) => {
      const menuItem = menuItemsData.find((m) => m._id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);

    return ticketTotal + reservationTotal + preorderTotal;
  };

  const originalPrice = calculateOriginalPrice();
  const discount =
    originalPrice && bundlePrice
      ? Math.round(((originalPrice - bundlePrice) / originalPrice) * 100)
      : 0;
  const totalItems = tickets.length + reservations.length + preorders.length;

  const addTicket = (ticketId: string) => {
    const ticket = ticketsData.find((t) => t._id === ticketId);
    if (ticket) {
      setValue('tickets', [...tickets, { ticketId, quantity: 1 }], {
        shouldDirty: true,
      });
    }
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
    const reservation = reservationsData.find((r) => r._id === reservationId);
    if (reservation) {
      setValue(
        'reservations',
        [...reservations, { reservationId, quantity: 1 }],
        {
          shouldDirty: true,
        }
      );
    }
  };

  const removeReservation = (index: number) => {
    const newReservations = reservations.filter(
      (_: any, i: number) => i !== index
    );
    setValue('reservations', newReservations, { shouldDirty: true });
  };

  const updateReservationQuantity = (index: number, quantity: number) => {
    const newReservations = [...reservations];
    newReservations[index].quantity = Math.max(1, quantity);
    setValue('reservations', newReservations, { shouldDirty: true });
  };

  const addPreorder = (menuItemId: string) => {
    const menuItem = menuItemsData.find((m) => m._id === menuItemId);
    if (menuItem) {
      setValue('preorders', [...preorders, { menuItemId, quantity: 1 }], {
        shouldDirty: true,
      });
    }
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
    const payload: any = {
      companyOrganizer: companyOrganizer || '68da7aa1e6f099d42e32da71',
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: originalPrice,
      discount: discount,
      tickets: data.tickets.map((t: any) => ({
        ticketId: t.ticketId,
        quantity: t.quantity,
      })),
      reservations: data.reservations.map((r: any) => ({
        reservationId: r.reservationId,
        quantity: r.quantity,
      })),
      preorders: data.preorders.map((p: any) => ({
        menuItemId: p.menuItemId,
        quantity: p.quantity,
      })),
      status: data.status || 'active',
    };

    if (isEdit && selectedData) {
      payload.id = selectedData._id;
    }

    return payload;
  };

  const handleSubmit = async (formData: BundleFormValues) => {
    try {
      if (totalItems === 0) {
        showError('Please add at least one item to the bundle');
        return;
      }

      setIsSubmitting(true);

      const payload = transformToPayload(formData);

      // Console log the payload instead of API call
      console.log('=== BUNDLE PAYLOAD ===');
      console.log(JSON.stringify(payload, null, 2));
      console.log('======================');

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess(
        isEdit ? 'Bundle updated successfully' : 'Bundle created successfully'
      );

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const getItemName = (
    id: string,
    type: 'ticket' | 'reservation' | 'preorder'
  ) => {
    if (type === 'ticket') {
      return ticketsData.find((t) => t._id === id)?.name || '';
    } else if (type === 'reservation') {
      return reservationsData.find((r) => r._id === id)?.name || '';
    } else {
      return menuItemsData.find((m) => m._id === id)?.title || '';
    }
  };

  const getItemPrice = (
    id: string,
    type: 'ticket' | 'reservation' | 'preorder'
  ) => {
    if (type === 'ticket') {
      return ticketsData.find((t) => t._id === id)?.price || 0;
    } else if (type === 'reservation') {
      return reservationsData.find((r) => r._id === id)?.price || 0;
    } else {
      return menuItemsData.find((m) => m._id === id)?.price || 0;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[800px]"
        >
          <DialogHeader className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-opacity-20 rounded-lg bg-gray-800 p-2 dark:bg-gray-200">
                  <Package
                    className="text-white dark:text-gray-900"
                    size={24}
                  />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                    {isEdit ? 'Edit Bundle' : 'Create New Bundle'}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white">
                    Package multiple items into an attractive offer
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="flex w-full flex-col gap-6">
                {/* Basic Information */}
                <div className="dark:bg-secondary">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-gray-200 dark:text-black">
                      1
                    </div>
                    <span className="dark:text-gray-100">
                      Basic Information
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RHFTextField
                      name="name"
                      label="Bundle Name"
                      placeholder="e.g., VIP Experience Package, Weekend Special"
                    />

                    <RHFTextField
                      name="description"
                      label="Description"
                      placeholder="Describe the value proposition and what makes this bundle special"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-2">
                      <RHFCustomDropdown
                        name="event"
                        label="Event (Optional)"
                        placeholder="Select Event"
                        options={eventOptions}
                        isLoading={isLoadingEvents}
                        showNone={true}
                      />
                    </div>

                    <RHFDate
                      label="Start Date"
                      name="startDate"
                      minDate={new Date()}
                      placeholder="Select Start Date"
                    />

                    <RHFDate
                      label="End Date"
                      name="endDate"
                      minDate={new Date()}
                      placeholder="Select End Date"
                    />
                  </div>
                </div>

                {/* Bundle Builder */}
                <div className="">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-gray-200 dark:text-black">
                        2
                      </div>
                      <span className="dark:text-gray-100">
                        Build Your Bundle
                      </span>
                    </h3>
                    {totalItems > 0 && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {totalItems} items added
                      </span>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="dark:bg-secondary mb-6 flex gap-2 rounded-lg bg-white p-1">
                    <button
                      type="button"
                      onClick={() => event && setActiveTab('tickets')}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
                        activeTab === 'tickets'
                          ? 'bg-[#272727] text-gray-100 shadow dark:bg-[#272727] dark:text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      } ${!event ? 'cursor-not-allowed opacity-50' : ''}`}
                      aria-label="Tickets tab"
                      disabled={!event}
                    >
                      <Ticket size={18} />
                      Tickets
                      {tickets.length > 0 && (
                        <span
                          className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                            activeTab === 'tickets'
                              ? 'bg-opacity-20 bg-white text-black'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          {tickets.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('reservations')}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
                        activeTab === 'reservations'
                          ? 'bg-[#272727] text-gray-100 shadow dark:bg-[#272727] dark:text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                      aria-label="Reservations tab"
                    >
                      <Calendar size={18} />
                      Reservations
                      {reservations.length > 0 && (
                        <span
                          className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                            activeTab === 'reservations'
                              ? 'bg-opacity-20 bg-white text-black'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          {reservations.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('preorders')}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
                        activeTab === 'preorders'
                          ? 'bg-[#272727] text-gray-100 shadow dark:bg-[#272727] dark:text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                      aria-label="Pre-orders tab"
                    >
                      <Package size={18} />
                      Pre-orders
                      {preorders.length > 0 && (
                        <span
                          className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                            activeTab === 'preorders'
                              ? 'bg-opacity-20 bg-white text-black'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          {preorders.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[300px]">
                    {activeTab === 'tickets' && (
                      <div>
                        {event && (
                          <ProfessionalDropdown
                            options={ticketOptions}
                            onSelect={addTicket}
                            placeholder="+ Select a ticket to add"
                            icon={Ticket}
                          />
                        )}
                        {/* {ticketsLoading ? (
                          <Skeleton className="h-12 w-full rounded-lg" />
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addTicket(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="mb-4 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            aria-label="Select ticket to add"
                            title="Select ticket to add"
                          >
                            <option value="">+ Select a ticket to add</option>
                            {ticketOptions.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )} */}

                        {/* {tickets.length === 0 ? (
                          <div className="py-12 text-center text-gray-400">
                            <Ticket
                              size={48}
                              className="mx-auto mb-3 opacity-30"
                            />
                            <p className="text-sm">
                              No tickets added yet. Select from the dropdown
                              above.
                            </p>
                          </div>
                        ) : ( */}

                        {!event ? (
                          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <Ticket
                              size={48}
                              className="mx-auto mb-3 opacity-50"
                            />
                            <p className="text-sm">
                              Please select an event before choosing a ticket.
                            </p>
                          </div>
                        ) : tickets.length === 0 ? (
                          <div className="py-12 text-center text-gray-400">
                            <Ticket
                              size={48}
                              className="mx-auto mb-3 opacity-30"
                            />
                            <p className="text-sm">
                              No tickets added yet. Select from the dropdown
                              above.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {tickets.map((ticket: any, index: number) => (
                              <div
                                key={index}
                                className="rounded-lg border-2 border-gray-200 bg-white p-4 transition hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                      {getItemName(ticket.ticketId, 'ticket')}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                      €{getItemPrice(ticket.ticketId, 'ticket')}{' '}
                                      per ticket
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Qty:
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={ticket.quantity}
                                        onChange={(e) =>
                                          updateTicketQuantity(
                                            index,
                                            parseInt(e.target.value) || 1
                                          )
                                        }
                                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                        title="Ticket quantity"
                                        aria-label="Ticket quantity"
                                      />
                                    </div>
                                    <div className="min-w-[80px] text-right">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Subtotal
                                      </div>
                                      <div className="font-bold text-gray-900 dark:text-gray-100">
                                        €
                                        {getItemPrice(
                                          ticket.ticketId,
                                          'ticket'
                                        ) * ticket.quantity}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeTicket(index)}
                                      className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                                      aria-label="Remove ticket"
                                      title="Remove ticket"
                                    >
                                      <Trash2 size={20} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'reservations' && (
                      <div>
                        <ProfessionalDropdown
                          options={reservationOptions}
                          onSelect={addReservation}
                          placeholder="+ Select a reservation to add"
                          icon={Calendar}
                        />

                        {/* {reservationsLoading ? (
                          <Skeleton className="h-12 w-full rounded-lg" />
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addReservation(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="mb-4 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            aria-label="Select reservation to add"
                            title="Select reservation to add"
                          >
                            <option value="">
                              + Select a reservation to add
                            </option>
                            {reservationOptions.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )} */}

                        {reservations.length === 0 ? (
                          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <Calendar
                              size={48}
                              className="mx-auto mb-3 opacity-50"
                            />
                            <p className="text-sm">
                              No reservations added yet. Select from the
                              dropdown above.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {reservations.map(
                              (reservation: any, index: number) => {
                                const resData = reservationsData.find(
                                  (r) => r._id === reservation.reservationId
                                );
                                return (
                                  <div
                                    key={index}
                                    className="rounded-lg border-2 border-gray-200 bg-white p-4 transition hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                          {getItemName(
                                            reservation.reservationId,
                                            'reservation'
                                          )}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                          €
                                          {getItemPrice(
                                            reservation.reservationId,
                                            'reservation'
                                          )}{' '}
                                          per reservation
                                          {resData?.capacity &&
                                            ` • Max ${resData.capacity} guests`}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Qty:
                                          </label>
                                          <input
                                            type="number"
                                            min="1"
                                            value={reservation.quantity}
                                            onChange={(e) =>
                                              updateReservationQuantity(
                                                index,
                                                parseInt(e.target.value) || 1
                                              )
                                            }
                                            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                            title="Reservation quantity"
                                            aria-label="Reservation quantity"
                                          />
                                        </div>
                                        <div className="min-w-[80px] text-right">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Subtotal
                                          </div>
                                          <div className="font-bold text-gray-900 dark:text-gray-100">
                                            €
                                            {getItemPrice(
                                              reservation.reservationId,
                                              'reservation'
                                            ) * reservation.quantity}
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeReservation(index)
                                          }
                                          className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                                          aria-label="Remove reservation"
                                          title="Remove reservation"
                                        >
                                          <Trash2 size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'preorders' && (
                      <div>
                        <ProfessionalDropdown
                          options={menuItemOptions}
                          onSelect={addPreorder}
                          placeholder="+ Select a pre-order item to add"
                          icon={Package}
                        />

                        {/* {menuItemsLoading ? (
                          <Skeleton className="h-12 w-full rounded-lg" />
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addPreorder(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="mb-4 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            aria-label="Select pre-order item to add"
                            title="Select pre-order item to add"
                          >
                            <option value="">
                              + Select a pre-order item to add
                            </option>
                            {menuItemOptions.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )} */}

                        {preorders.length === 0 ? (
                          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <Package
                              size={48}
                              className="mx-auto mb-3 opacity-50"
                            />
                            <p className="text-sm">
                              No pre-order items added yet. Select from the
                              dropdown above.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {preorders.map((preorder: any, index: number) => (
                              <div
                                key={index}
                                className="rounded-lg border-2 border-gray-200 bg-white p-4 transition hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                      {getItemName(
                                        preorder.menuItemId,
                                        'preorder'
                                      )}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                      €
                                      {getItemPrice(
                                        preorder.menuItemId,
                                        'preorder'
                                      )}{' '}
                                      per item
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Qty:
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={preorder.quantity}
                                        onChange={(e) =>
                                          updatePreorderQuantity(
                                            index,
                                            parseInt(e.target.value) || 1
                                          )
                                        }
                                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                        title="Pre-order quantity"
                                        aria-label="Pre-order quantity"
                                      />
                                    </div>
                                    <div className="min-w-[80px] text-right">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Subtotal
                                      </div>
                                      <div className="font-bold text-gray-900 dark:text-gray-100">
                                        €
                                        {getItemPrice(
                                          preorder.menuItemId,
                                          'preorder'
                                        ) * preorder.quantity}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removePreorder(index)}
                                      className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                                      aria-label="Remove pre-order item"
                                      title="Remove pre-order item"
                                    >
                                      <Trash2 size={20} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-gray-200 dark:text-black">
                      3
                    </div>
                    <span className="dark:text-gray-100">Set Bundle Price</span>
                  </h3>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-gray-900">
                      <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        Original Price
                      </div>
                      <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        €{originalPrice}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Sum of all items
                      </div>
                    </div>

                    <div>
                      <RHFTextField
                        type="number"
                        name="price"
                        placeholder="0.00"
                        label="Bundle Price (EUR)"
                        className="h-11 border border-gray-300 bg-white dark:border-gray-500"
                      />
                    </div>
                  </div>

                  {bundlePrice > 0 && originalPrice > 0 && (
                    <div
                      className={`rounded-lg p-4 ${
                        parseFloat(String(bundlePrice)) < originalPrice
                          ? 'border-2 border-green-300 bg-green-100 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-2 border-amber-300 bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <div
                              className={`font-semibold ${
                                parseFloat(String(bundlePrice)) < originalPrice
                                  ? 'text-green-800 dark:text-green-300'
                                  : 'text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              {parseFloat(String(bundlePrice)) < originalPrice
                                ? 'Great Deal!'
                                : 'Price Warning'}
                            </div>
                            <div
                              className={`text-sm ${
                                parseFloat(String(bundlePrice)) < originalPrice
                                  ? 'text-green-700 dark:text-green-400'
                                  : 'text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {parseFloat(String(bundlePrice)) < originalPrice
                                ? `Customers save €${(
                                    originalPrice -
                                    parseFloat(String(bundlePrice))
                                  ).toFixed(2)} (${discount}% discount)`
                                : 'Bundle price is higher than original price. Consider adjusting.'}
                            </div>
                          </div>
                        </div>
                        {parseFloat(String(bundlePrice)) < originalPrice && (
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {discount}%
                            </div>
                            <div className="text-xs text-green-700 dark:text-green-500">
                              OFF
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-3 border-t pt-5 dark:border-gray-700">
                <div className="mr-auto text-sm text-gray-600 dark:text-gray-400">
                  {totalItems === 0
                    ? 'Add items to create your bundle'
                    : `${totalItems} items • Total value: €${originalPrice}`}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="cursor-pointer px-7"
                >
                  Cancel
                </Button>

                {isSubmitting ? (
                  <Button
                    type="button"
                    disabled
                    className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                  >
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark flex cursor-pointer items-center gap-2 px-4 py-2 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    <Plus size={20} />
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
