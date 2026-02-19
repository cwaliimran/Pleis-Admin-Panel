'use client';

import { AppLoading } from '@/components/atoms/app-loading';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import ImageWithFallback from '@/components/common/img-with-fallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useBoolean } from '@/hooks/useBoolean';
import CapacityGaugeChart from '@/sections/event/CapacityGaugeChart';
import { tabsData } from '@/sections/event/data';
import EventAnalytics from '@/sections/event/eventAnalytics';
import EventNotification from '@/sections/event/eventNotification';
import EventOverView from '@/sections/event/eventOverview';
import EventReservation from '@/sections/event/eventReservation';
import EventTicket from '@/sections/event/eventTicket';
import LastTransaction from '@/sections/event/lastTransaction';
import { useCloneeventMutation, useDeleteeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
import { fDate } from '@/utils/format-time';
import { capitalizeFirst } from '@/utils/short-utils';
import { Copy, Loader2, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
// import EventFeedbackView from '../event-feedback/event-feedback-view';
import FeedbackView from '../feedback/feedback-view';
import { showError } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const deleteModal = useBoolean();

  const [loading, setLoading] = React.useState(false);
  const [preOrderLoading, setPreOrderLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [active, setActive] = React.useState('overview');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);

  const [preOrdersEnabled, setPreOrdersEnabled] = useState(false);

  const [updateEvent] = useUpdateeventMutation();
  const { data: event = {}, isLoading, refetch } = useGeteventByIdQuery(id);
  const [deleteEvent, { isLoading: deleteEventLoading }] = useDeleteeventMutation();

  const [cloneEvent] = useCloneeventMutation();
  const userType = window?.location?.pathname?.split('/')[1];

  React.useEffect(() => {
    if (event?.preOrdersEnabled !== undefined) {
      setPreOrdersEnabled(event.preOrdersEnabled);
    }
  }, [event?.preOrdersEnabled]);

  // Check if event has ended
  const isEventEnded = React.useMemo(() => {
    if (!event?.schedule?.endDateTime) return false;
    const endDate = new Date(event.schedule.endDateTime);
    return endDate < new Date();
  }, [event?.schedule?.endDateTime]);

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
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await updateEvent({ id, feedbackEnabled: true }).unwrap();
      if (res?.data) {
        refetch();
      }
    } catch (error) {
      // console.log('Failed to request feedback', error);
      showError(getErrorMessage(error));
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handlePreOrderToggle = async () => {
    try {
      setPreOrderLoading(true);
      const newPreOrderStatus = !preOrdersEnabled;
      const res = await updateEvent({ id, preOrdersEnabled: newPreOrderStatus }).unwrap();
      if (res?.data) {
        setPreOrdersEnabled(newPreOrderStatus);
        refetch();
      }
    } catch (error) {
      console.log('Failed to update preorder status', error);
    } finally {
      setPreOrderLoading(false);
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

  return (
    <>
      {isLoading || loading ? (
        <AppLoading />
      ) : (
        <div className="space-y-6 pb-12">
          <div className="mt-10 h-full">
            <div className="grid grid-cols-12 md:gap-7">
              <div className="col-span-12 lg:col-span-9">
                {/* ---------------- INFO CARD ---------------- */}
                <Card className="pb-0 shadow-md dark:bg-[#171717]">
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-1/3">
                        {event?.basicInfo?.media && event?.basicInfo?.media !== noImageUrl && event?.basicInfo?.media !== noImageUrlDev ? (
                          <Image
                            src={event?.basicInfo?.media || ''}
                            alt="Event preview"
                            className="max-h-88 rounded-lg object-cover"
                            priority
                            height={400}
                            width={400}
                          />
                        ) : (
                          <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                            {event?.basicInfo?.title?.[0]?.toUpperCase() || ''}
                          </span>
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="flex w-full flex-col gap-3 sm:w-2/3">
                        {/* Top Row */}
                        <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                          <div className="flex flex-col items-center gap-2 md:flex-row">
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800">
                              {capitalizeFirst(event?.status) || 'Upcoming'}
                            </span>
                            <span>{fDate(event?.schedule?.endDateTime) || '-'}</span>
                          </div>

                          <div className="flex items-center">
                            {/* Static Preorder Toggle Button */}

                            <label className="mr-2 flex cursor-pointer items-center select-none">
                              {preOrderLoading ? (
                                <Loader2 className="mr-3 h-6 w-6 animate-spin text-gray-500" />
                              ) : (
                                <div>
                                  <input type="checkbox" checked={preOrdersEnabled} onChange={handlePreOrderToggle} className="sr-only" />
                                  <span
                                    className={`relative inline-block h-5 w-10 rounded-full transition ${preOrdersEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                                  >
                                    <span
                                      className={`absolute top-0 h-5 w-5 transform rounded-full border border-gray-300 bg-white shadow transition-transform ${
                                        preOrdersEnabled ? 'translate-x-5' : 'left-0'
                                      }`}
                                    />
                                  </span>
                                </div>
                              )}
                              <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">Preorder</span>
                            </label>

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
                        <p className={`-mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300 ${expanded ? '' : 'line-clamp-3'} `}>
                          {capitalizeFirst(event?.basicInfo?.description) || 'No description available.'}
                        </p>

                        <div className="flex">
                          {event?.basicInfo?.description?.length > 290 && (
                            <button
                              type="button"
                              onClick={toggle}
                              className="-mt-2 cursor-pointer text-sm font-medium text-blue-600 underline underline-offset-2"
                            >
                              {expanded ? 'See less' : 'See more'}
                            </button>
                          )}
                        </div>

                        {/* Organizer */}
                        <div className="mt-2">
                          <h4 className="text-xs font-bold text-gray-500">ORGANIZER</h4>
                          <div className="mt-2 flex items-center gap-2">
                            <ImageWithFallback
                              url={event?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                              alt={event?.basicInfo?.organization?.basicInfo?.name}
                              className="h-6 w-6 rounded-full"
                            />

                            <span className="text-sm font-medium text-gray-800 capitalize dark:text-white">
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

                      {/* Request Feedback Button */}
                      <div className="w-full sm:w-auto">
                        {event?.feedbackEnabled ? (
                          <span className="flex w-full items-center justify-center gap-2 rounded-3xl px-4 py-2 font-semibold text-green-600 sm:w-auto">
                            Feedback Request Sent
                          </span>
                        ) : (
                          <Button
                            variant="default"
                            onClick={handleRequestFeedback}
                            disabled={feedbackLoading || !isEventEnded}
                            title={!isEventEnded ? 'Event must end before requesting feedback' : ''}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                          >
                            {feedbackLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Request Feedback
                          </Button>
                        )}
                      </div>

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
                        <button
                          type="button"
                          className="bg-primary hover:bg-primary w-full cursor-pointer rounded-3xl px-4 py-2 text-white transition sm:w-auto"
                        >
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
                                className={`relative cursor-pointer rounded-full border-none px-4 py-2 text-sm font-semibold shadow-none! transition-all dark:bg-transparent! ${
                                  active === tab.value
                                    ? 'after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-3/4 after:-translate-x-1/2 after:rounded-full after:bg-[#71717A] after:content-[""]'
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

                  {active === 'analytics' && <EventAnalytics id={id} />}

                  {active === 'tickets' && <EventTicket event={event} />}

                  {active === 'reservations' && <EventReservation event={event} />}

                  {active === 'notifications' && <EventNotification id={id} />}

                  {active === 'feedback' && (
                    <FeedbackView
                      id={id}
                      feedbackEnabled={event?.feedbackEnabled}
                      onRequestFeedback={handleRequestFeedback}
                      feedbackLoading={feedbackLoading}
                      isEventEnded={isEventEnded}
                    />
                  )}
                  {/* {active === 'feedback' && showFeedback ? <EventFeedbackView /> : null} */}
                </div>
              </div>

              {/* Sidebar or Additional Panel */}
              <div className="col-span-12 mt-3 space-y-3 md:mt-0 md:space-y-2 lg:col-span-3">
                {/* Total Revenue */}
                <Card className="dark:bg-secondary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Total Revenue</h3>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-4xl font-bold">{event?.meta?.revenue}</div>
                  </CardHeader>
                </Card>

                {/* Total Tickets Sold */}
                <Card className="dark:bg-secondary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Total Tickets Sold</h3>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-4xl font-bold">
                      0
                      {event?.ticketingStats?.grandTotal?.count && (
                        <sub className="ml-1 text-base font-medium">/ {event?.ticketingStats?.grandTotal?.amount}</sub>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                {/* Views */}
                <Card className="dark:bg-secondary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Views</h3>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-4xl font-bold">{event?.eventViews}</div>
                  </CardHeader>
                </Card>

                <CapacityGaugeChart data={event} />

                <LastTransaction data={event} />

                {/* <Card className="col-span-12 shadow-lg dark:bg-[#171717]">
                  <CardContent>
                    <div className="w-full flex-wrap items-start justify-between gap-y-6 px-2 md:flex md:px-0">
                      <div className="flex min-w-35 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
                          <p className="text-xs font-semibold text-gray-600 dark:text-white">START DATE</p>
                        </div>
                        <p className="text-sm font-medium text-black dark:text-white">{fDate(event?.schedule?.startDateTime) || 'N/A'}</p>
                      </div>

                      <div className="mt-4 flex min-w-35 flex-col gap-1 md:mt-0">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
                          <p className="text-xs font-semibold text-gray-600 dark:text-white">END DATE</p>
                        </div>
                        <p className="text-sm font-medium text-black dark:text-white">{fDate(event?.schedule?.endDateTime) || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
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
