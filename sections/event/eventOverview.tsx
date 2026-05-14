import ImageWithFallback from '@/components/common/img-with-fallback';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { fDate } from '@/utils/format-time';
import { capitalizeFirst } from '@/utils/short-utils';
import { Calendar, Dot, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const EventOverView = ({ event }: { event: any }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);

  // const ticketsData = [
  //   {
  //     title: 'Early Bird Tickets',
  //     sold: event?.ticketingStats?.earlyBird?.used?.count || 0,
  //     total: event?.ticketingStats?.earlyBird?.totalCreated || 0,
  //   },
  //   {
  //     title: 'Last Minute Tickets',
  //     sold: event?.ticketingStats?.lastMinute?.used?.count || 0,
  //     total: event?.ticketingStats?.lastMinute?.totalCreated || 0,
  //   },
  //   {
  //     title: 'Regular Tickets',
  //     sold: event?.ticketingStats?.regular?.used?.count || 0,
  //     total: event?.ticketingStats?.regular?.totalCreated || 0,
  //   },
  // ];

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
          {/* about organizer */}
          <Card className="dark:bg-secondary shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">ABOUT ORGANIZER</h1>
              <div className="mt-2">
                <div className="mt-1 items-center gap-2 md:flex">
                  <ImageWithFallback
                    url={event?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                    alt={event?.basicInfo?.organization?.basicInfo?.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {event?.basicInfo?.organization?.basicInfo?.name || 'Unknown Organizer'}
                    </span>
                  </div>
                </div>

                <h1 className="my-3 text-sm text-slate-500 dark:text-slate-300">
                  {event?.basicInfo?.organization?.otherInfo?.description || 'No description available.'}
                </h1>

                <Badge
                  onClick={
                    event?.basicInfo?.organization?._id
                      ? () => router.push(`/${window.location.pathname.split('/')[1]}/organization/${event?.basicInfo?.organization?._id}`)
                      : undefined
                  }
                  className={`text-md w-full rounded-full border border-gray-400 bg-transparent px-4 py-1 font-medium transition-colors ${
                    event?.basicInfo?.organization?._id
                      ? 'cursor-pointer text-black hover:bg-gray-200 hover:text-gray-800 dark:bg-white'
                      : 'pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                  }`}
                >
                  Profile
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* description */}
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">DESCRIPTION</h1>
              <p className={`mt-2 text-sm ${expanded ? '' : 'line-clamp-3'}`}>
                {capitalizeFirst(event?.basicInfo?.description) || 'No description available.'}
              </p>

              <div className="flex">
                {event?.basicInfo?.description?.length > 290 && (
                  <button
                    type="button"
                    onClick={toggle}
                    className="mt-0 cursor-pointer text-sm font-medium text-blue-600 underline underline-offset-2"
                  >
                    {expanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* venue */}
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">VENUE TYPE</h1>
              <div className="flex items-center gap-2">
                {/* <PartyPopper /> */}
                <p className="text-md mt-2 capitalize">{event?.basicInfo?.venue?.title || ''}</p>
              </div>
            </CardHeader>
          </Card>

          {/* categories */}
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">CATEGORIES</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {event?.basicInfo?.categories?.map((item: any, index: number) => (
                  <Badge
                    key={index}
                    className="rounded-full border border-gray-500 bg-white px-3 py-1 text-sm font-medium text-gray-500 capitalize transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                  >
                    {item?.title}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* tags */}
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">TAGS</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {event?.basicInfo?.tags?.map((item: any, index: number) => (
                  <Badge
                    key={index}
                    className="rounded-full border border-gray-500 bg-white px-3 py-1 text-sm font-medium text-gray-500 capitalize transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                  >
                    {item?.title}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* <Card className="dark:bg-secondary mt-4 w-full shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-black dark:bg-white">Active</Badge>
                <Ellipsis className="h-4 w-4 cursor-pointer" />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
                <Image
                  src="/images/bannerImage.png"
                  alt="Promotion"
                  width={100}
                  height={100}
                  className="h-30 w-full rounded-[10px] object-cover sm:w-20 md:h-20"
                />

                <div className="flex flex-1 flex-col">
                  <div className="mb-1 flex items-center justify-between">
                    <h1 className="font-semibold text-slate-500">PROMOTION</h1>
                    <h1 className="font-semibold whitespace-nowrap text-green-500">24 Days left</h1>
                  </div>

                  <h1 className="text-lg font-medium sm:text-xl">Promotion Name</h1>

                  <p className="mt-1 text-sm text-slate-500">lorem ipsum dolor sit amet, consectetur ...</p>
                </div>
              </div>
            </CardHeader>

            <hr />

            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
                <div className="flex items-center">
                  <UsersRound className="h-5 w-5 text-slate-500" />
                  <p className="ml-2 font-normal text-slate-500">
                    Max Points <span className="font-bold">632</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <UsersRound className="h-5 w-5 text-slate-500" />
                  <p className="ml-2 font-normal text-slate-500">
                    Max Points <span className="font-bold">632</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <h1 className="font-semibold text-slate-500">REWARD AVAILABILITY</h1>
                <h1 className="text-slate-500">488/2300</h1>
              </div>

              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-5/6 bg-blue-600 transition-all duration-500"></div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <div className="mt-5 grid grid-cols-12 gap-4">
            <div className="col-span-12 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 md:col-span-6 dark:bg-black">
              <Badge className="text-md bg-transparent px-4 py-1 font-semibold text-black dark:text-slate-500">New Promotion</Badge>
            </div>
            <div className="col-span-12 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 md:col-span-6 dark:bg-black">
              <Badge className="text-md bg-transparent px-4 py-1 font-semibold text-black dark:text-slate-500">New Notification</Badge>
            </div>
          </div> */}

          {/* Updates Section */}
          <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-muted-foreground text-sm font-semibold">UPDATES</h2>

              {event?.updates && event.updates.length > 0 ? (
                event.updates.map((update: any, index: number) => (
                  <div key={index}>
                    <div className="flex items-start justify-between rounded-md py-4">
                      <div className="flex-1 space-y-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Dot className="text-primary bg-primary -ml-1 h-2 w-2 rounded-full" />
                          <p className="text-sm font-medium">{update?.title}</p>
                        </div>
                        <p className="text-muted-foreground text-sm">{update?.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-4 text-center text-sm">No updates available.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-7">
          {/* timeline  */}
          <Card className="shadow-lg dark:bg-[#171717]">
            <CardHeader className="flex w-full flex-col gap-2">
              <h1 className="font-semibold text-slate-500">Timeline</h1>
              <hr />
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm text-slate-500">START DATE</p>
                  </div>
                  <p className="text-sm">{event?.schedule?.startDateTime ? fDate(event.schedule.startDateTime, 'DD/MM/YYYY HH:mm') : '-'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm text-slate-500">END DATE</p>
                  </div>
                  <p className="text-sm">{event?.schedule?.endDateTime ? fDate(event.schedule.endDateTime, 'DD/MM/YYYY HH:mm') : '-'}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* location */}
          <Card className="mt-4 shadow-lg dark:bg-[#171717]">
            <CardHeader className="flex w-full flex-col gap-2">
              <h1 className="font-semibold text-slate-500">VENUE</h1>
              <div className="mt-2 flex items-center gap-2 capitalize">
                <span>{event?.basicInfo?.venue?.title || 'Unknown Venue'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{event?.basicInfo?.venue?.location?.fullAddress || 'Unknown Address'}</span>
              </div>

              <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                {event?.basicInfo?.venue?.location?.coordinates?.length ? (
                  <iframe
                    title="Venue Location Map"
                    src={`https://www.google.com/maps?q=${event?.basicInfo?.venue?.location?.coordinates[1]},${event?.basicInfo?.venue?.location?.coordinates[0]}&hl=es;z=14&output=embed`}
                    className="h-full w-full border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">No location selected</div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Tickets Section */}
          {/* <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-muted-foreground text-sm font-semibold">TICKETS</h2>

              {ticketsData.map((ticket, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between rounded-md py-4">
                    <div className="flex-1 space-y-1">
                      <div className="mr-2 flex items-center justify-between">
                        <div>
                          <p className="text-base font-medium">{ticket.title}</p>
                        </div>
                        <p>
                          {ticket.sold} / {ticket.total}
                        </p>
                      </div>

                      <div className="mt-1">
                        <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full dark:bg-white">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{
                              width: ticket.total > 0 ? `${(ticket.sold / ticket.total) * 100}%` : '0%',
                            }}
                          />
                        </div>
                      </div>

                      <p className="text-muted-foreground text-xs">
                        {ticket.sold}/{ticket.total}
                      </p>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 md:pt-4">
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Total</p>
                  <p className="text-lg font-bold">{event?.ticketingStats?.grandTotal?.amount || 0} €</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default EventOverView;
