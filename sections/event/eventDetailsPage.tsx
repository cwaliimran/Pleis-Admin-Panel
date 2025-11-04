'use client';

import { AppLoading } from '@/components/atoms/app-loading';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import ImageWithFallback from '@/components/common/img-with-fallback';
import FilterDropdown from '@/components/filter-dropdown/FilterDropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoolean } from '@/hooks/useBoolean';
import { cn } from '@/lib/utils';
import CapacityGaugeChart from '@/sections/event/CapacityGaugeChart';
import { eventCardData, tabsData } from '@/sections/event/data';
import EventAnalytics from '@/sections/event/eventAnalytics';
import EventNotification from '@/sections/event/eventNotification';
import EventOverView from '@/sections/event/eventOverview';
import EventReservation from '@/sections/event/eventReservation';
import EventTicket from '@/sections/event/eventTicket';
import LastTransaction from '@/sections/event/lastTransaction';
import { TransactionHistory } from '@/sections/invoices';
import UserCard from '@/sections/users/userCard';
import { useCloneeventMutation, useDeleteeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
import { fDate } from '@/utils/format-time';
import { capitalizeFirst } from '@/utils/short-utils';
import { Calendar, Copy, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const deleteModal = useBoolean();

  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState('overview');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const [updateEvent] = useUpdateeventMutation();
  const { data: event = {}, isLoading, refetch } = useGeteventByIdQuery(id);
  const [deleteEvent, { isLoading: deleteEventLoading }] = useDeleteeventMutation();

  const [cloneEvent] = useCloneeventMutation();
  const userType = window?.location?.pathname?.split('/')[1];

  // const event = {
  //   id: "1",
  //   name: "Summer Music Festival 2025",
  //   published: true,
  //   fromDate: "2025-03-23T13:00:00Z",
  //   endDate: "2025-03-25T13:00:00Z",
  // };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    deleteModal.onTrue();
  };

  const handleUpdateEvent = async () => {
    try {
      setLoading(true);
      const newStatus = event.status === 'active' ? 'inactive' : 'active';
      const res = await updateEvent({ id, status: newStatus }).unwrap();
      if (res?.data) {
        refetch();
      }
    } catch (error) {
      console.log('Failed to update event', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneEvent = async () => {
    try {
      setLoading(true);
      const res = await cloneEvent(id).unwrap();
      if (res?.data?._id) {
        router.push(`/${userType}/events`);
      }
    } catch (error) {
      console.log('Failed to clone event', error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      if (deleteId) {
        const response = await deleteEvent(deleteId).unwrap();
        if (response && response.message === 'Event deleted successfully') {
          router.push(`/${userType}/events`);
        }
      }
      deleteModal.onFalse();
    } catch (error) {
      console.log('Failed to delete event', error);
    }
  };

  const media = event?.basicInfo?.media?.url;
  const mediaUrl = typeof media === 'string' ? media.toLowerCase() : null;
  const isVideo = mediaUrl?.endsWith('.mp4');

  return (
    <>
      {isLoading || loading ? (
        <AppLoading />
      ) : (
        <div className="space-y-6 pb-12">
          <div className="mt-10 h-full">
            <div className="grid grid-cols-12 md:gap-7">
              <div className="col-span-12 lg:col-span-9">
                <Card className="pb-0 shadow-md dark:bg-[#171717]">
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-1/3">
                        {/* <ImageWithFallback
                          url={event?.basicInfo?.media}
                          size={300}
                          alt={event?.basicInfo?.title}
                          className="h-auto w-full rounded-md object-contain object-top"
                        />
                         */}

                        {isVideo ? (
                          <video src={event?.basicInfo?.media?.url} controls className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <Image
                            src={event?.basicInfo?.media?.url}
                            alt="Event preview"
                            className="rounded-lg object-cover"
                            sizes="(max-width: 768px) 100vw, 40vw"
                            priority
                            // quality={85}
                            height={300}
                            width={300}
                          />
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="flex w-full flex-col gap-3 sm:w-2/3">
                        {/* Status and Date */}
                        <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                          <div className="flex flex-col items-center gap-2 md:flex-row">
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800">
                              {capitalizeFirst(event?.status) || 'Upcoming'}
                            </span>
                            <span>{fDate(event?.schedule?.endDateTime) || '-'}</span>
                          </div>

                          <div className="flex items-center">
                            <Pencil
                              className="h-4 w-4 cursor-pointer text-gray-500 transition-colors hover:text-gray-700 md:h-5 md:w-5"
                              onClick={() => router.push(`/${window.location.pathname.split('/')[1]}/events/edit-event/${event?._id}`)}
                            />
                            <Trash2
                              className="ml-1 h-4 w-4 cursor-pointer text-gray-500 transition-colors hover:text-gray-700 md:ml-4 md:h-5 md:w-5"
                              onClick={() => handleDelete(event?._id)}
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-gray-900 capitalize dark:text-white">
                          {event?.basicInfo?.title || 'Untitled Event'}
                        </h2>

                        {/* Description */}
                        <p className="-mt-2 text-sm leading-relaxed text-gray-700 capitalize dark:text-gray-300">
                          {capitalizeFirst(event?.basicInfo?.description) || 'No description available.'}
                        </p>

                        {/* Organizer */}
                        <div className="mt-2">
                          <h4 className="text-xs font-bold text-gray-500">ORGANIZER</h4>
                          <div className="mt-2 flex items-center gap-2">
                            <ImageWithFallback
                              url={event?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                              alt={event?.basicInfo?.organization?.basicInfo?.name}
                              className="h-6 w-6 rounded-full"
                            />

                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                              {event?.basicInfo?.organization?.basicInfo?.name || 'Unknown Organizer'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 mb-2 flex w-full flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-end md:mb-0 md:px-0">
                      {/* Publish / Hide Button */}
                      {/* <div className="w-full sm:w-auto">
                      <Button
                        variant="default"
                        onClick={() => handleTogglePublish(event.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-3xl w-full sm:w-auto cursor-pointer"
                      >
                        {event.published ? (
                          <>
                            <EyeOff className="w-4 h-4" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" /> Publish
                          </>
                        )}
                      </Button>
                    </div> */}

                      {/* Clone Button */}
                      <div className="w-full sm:w-auto">
                        <Button
                          variant="default"
                          onClick={handleCloneEvent}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-4 py-2 sm:w-auto"
                        >
                          <Copy className="h-4 w-4" /> Clone
                        </Button>
                      </div>

                      {/* Publish Button */}
                      <div className="w-full sm:w-auto">
                        <Button
                          onClick={handleUpdateEvent}
                          variant="default"
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-4 py-2 sm:w-auto"
                        >
                          {event?.status === 'active' ? 'Unpublish' : 'Publish'}
                        </Button>
                      </div>

                      {/* Boost Button */}
                      <div className="w-full sm:w-auto">
                        <button className="bg-primary hover:bg-primary w-full cursor-pointer rounded-3xl px-4 py-2 text-white transition sm:w-auto">
                          Boost
                        </button>
                      </div>
                    </div>

                    <div className="w-full px-2 md:px-0">
                      {/* Small screen dropdown */}
                      <div className="mb-4 block sm:hidden">
                        <Select value={active} onValueChange={setActive}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select tab" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-secondary">
                            {tabsData.map((tab: any) => (
                              <SelectItem key={tab.value} value={tab.value}>
                                {tab.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Tabs for larger screens */}
                      <Tabs value={active} onValueChange={setActive} className="hidden w-full sm:block">
                        <TabsList className="inline-flex items-center gap-2 bg-transparent p-1">
                          <div className="scrollbar-hide overflow-x-auto whitespace-nowrap">
                            {tabsData.map((tab: any) => (
                              <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`relative cursor-pointer rounded-full border-none px-4 py-2 text-sm font-semibold !shadow-none transition-all dark:!bg-transparent ${
                                  active === tab.value
                                    ? 'after:absolute after:bottom-0 after:left-1/2 after:h-[4px] after:w-3/4 after:-translate-x-1/2 after:rounded-full after:bg-[#71717A] after:content-[""]'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {tab.label}
                              </TabsTrigger>
                            ))}
                          </div>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-4 rounded-lg">
                  {active === 'overview' && <EventOverView event={event} />}

                  {active === 'analytics' && <EventAnalytics />}

                  {active === 'tickets' && <EventTicket />}

                  {active === 'reservations' && <EventReservation />}

                  {active === 'notifications' && <EventNotification />}
                </div>
              </div>

              {/* Sidebar or Additional Panel */}
              <div className="col-span-12 mt-3 space-y-3 md:mt-0 md:space-y-2 lg:col-span-3">
                {eventCardData.map((user: any) => (
                  <UserCard item={user} key={user._id} />
                ))}
                <CapacityGaugeChart />
                <LastTransaction />

                <Card className="col-span-12 shadow-lg dark:bg-[#171717]">
                  <CardContent>
                    <div className="w-full flex-wrap items-start justify-between gap-y-6 px-2 md:flex md:px-0">
                      {/* START DATE */}
                      <div className="flex min-w-[140px] flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
                          <p className="text-xs font-semibold text-gray-600 dark:text-white">START DATE</p>
                        </div>
                        <p className="text-sm font-medium text-black dark:text-white">{fDate(event?.schedule?.startDateTime) || 'N/A'}</p>
                      </div>

                      {/* END DATE */}
                      <div className="mt-4 flex min-w-[140px] flex-col gap-1 md:mt-0">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
                          <p className="text-xs font-semibold text-gray-600 dark:text-white">END DATE</p>
                        </div>
                        <p className="text-sm font-medium text-black dark:text-white">{fDate(event?.schedule?.endDateTime) || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {active === 'analytics' && (
              <div className="mt-5 grid grid-cols-12">
                <Card className="col-span-12 shadow-lg dark:bg-[#171717]">
                  {/* <CardHeader>
                  <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4">
                    <h3 className="text-xl font-semibold">
                      Transaction History
                    </h3>
                    <div>
                      <Tabs
                        value={tabActive}
                        onValueChange={setTabActive}
                        defaultValue="all"
                        className="w-full "
                      >
                        <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1">
                          <TabsTrigger
                            value="all"
                            className={cn(
                              "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer "
                            )}
                          >
                            All
                          </TabsTrigger>
                          <TabsTrigger
                            value="transactions"
                            className={cn(
                              "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                            )}
                          >
                            Transactions
                          </TabsTrigger>
                          <TabsTrigger
                            value="refunds"
                            className={cn(
                              "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                            )}
                          >
                            Refunds
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="flex flex-col md:items-center items-end">
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="w-auto">
                            <SelectLabel>Transaction</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="thisWeek">This Week</SelectItem>
                            <SelectItem value="thisMonth">
                              This Month
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader> */}
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <h3 className="text-xl font-semibold">Transaction History</h3>
                      <div>
                        <div className="w-full">
                          {/* Show select on small screens */}
                          <div className="block sm:hidden">
                            <Select value={active} onValueChange={setActive}>
                              <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                                <SelectValue placeholder="Select tab" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-secondary">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="transactions">Transactions</SelectItem>
                                <SelectItem value="refunds">Refunds</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Show tabs on medium and larger screens */}
                          <div className="hidden sm:block">
                            <Tabs value={active} onValueChange={setActive} defaultValue="all" className="w-full">
                              <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                                <TabsTrigger
                                  value="all"
                                  className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                                >
                                  All
                                </TabsTrigger>
                                <TabsTrigger
                                  value="transactions"
                                  className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                                >
                                  Transactions
                                </TabsTrigger>
                                <TabsTrigger
                                  value="refunds"
                                  className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                                >
                                  Refunds
                                </TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end md:items-center">
                        <FilterDropdown
                          selectedOptions={selectedOptions}
                          onSelectOption={setSelectedOptions}
                          options={[
                            { id: 'user', label: 'User' },
                            { id: 'contact', label: 'Contact' },
                            { id: 'invoice', label: 'Invoice' },
                            { id: 'organizer', label: 'Organizer ' },
                            { id: 'date', label: 'Date' },
                            { id: 'total', label: 'Total' },
                            {
                              id: 'transactionType',
                              label: 'Transaction Type',
                            },
                            { id: 'status', label: 'Status' },
                          ]}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <TransactionHistory />
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this event?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
        isLoading={deleteEventLoading}
      />
    </>
  );
};

export default EventDetailsPage;
