import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Dot, Ellipsis, MapPin, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/common/img-with-fallback';
import { useRouter } from 'next/navigation';
import { capitalizeFirst, formatDateTime } from '@/utils/short-utils';
import Image from 'next/image';

const EventOverView = ({ event }: { event: any }) => {
  const router = useRouter();

  const tickets = [
    {
      title: 'Early Bird Tickets',
      from: 'Mon 13, 25',
      sold: 1500,
      total: 2000,
    },
    {
      title: 'Early Bird Tickets',
      from: 'Mon 13, 25',
      sold: 1800,
      total: 2000,
    },
  ];

  const updates = [
    {
      title: 'Early Bird Tickets',
      description: 'Lorem ipsum dolor sit amet consectetur. Posuere tellus sagittis morbi eu ac justo. Phasellus in in porta egestas eget massa.',
    },
    {
      title: 'Early Bird Tickets',
      description: 'Tellus congue tortor non morbi eros risus aenean.',
    },
  ];

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
                    {/* <div className="flex">
                      <MapPin className="h-4 w-4" />
                      <span>Trnjanska cesta 5, 10 00...</span>
                    </div> */}
                  </div>
                </div>

                <h1 className="my-3 text-sm text-slate-500 dark:text-slate-300">
                  {event?.basicInfo?.organization?.otherInfo?.description || 'No description available.'}
                </h1>

                <Badge
                  onClick={() => router.push(`/${window.location.pathname.split('/')[1]}/organization/${event?.basicInfo?.organization?._id}`)}
                  className="text-md w-full cursor-pointer rounded-full border border-gray-400 bg-transparent px-4 py-1 font-medium text-black transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white"
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
              <p className="mt-2">{capitalizeFirst(event?.basicInfo?.description) || 'No description available.'}</p>
            </CardHeader>
          </Card>

          {/* venue */}
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">VENUE TYPE</h1>
              <div className="flex items-center gap-2">
                {/* <PartyPopper /> */}
                <p className="text-md mt-2 capitalize">{event?.basicInfo?.venue?.title || 'Unknown Type'}</p>
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
          <Card className="dark:bg-secondary mt-4 w-full shadow-lg">
            <CardHeader>
              {/* Top: Status + Ellipsis */}
              <div className="flex items-center justify-between">
                <Badge className="rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-black dark:bg-white">Active</Badge>
                <Ellipsis className="h-4 w-4 cursor-pointer" />
              </div>

              {/* Middle: Image + Info */}
              <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
                {/* Image */}
                <Image
                  src="/images/bannerImage.png"
                  alt="Promotion"
                  width={100}
                  height={100}
                  className="h-30 w-full rounded-[10px] object-cover sm:w-20 md:h-20"
                />

                {/* Text Info */}
                <div className="flex flex-1 flex-col">
                  {/* Row 1: Label + Days Left */}
                  <div className="mb-1 flex items-center justify-between">
                    <h1 className="font-semibold text-slate-500">PROMOTION</h1>
                    <h1 className="font-semibold whitespace-nowrap text-green-500">24 Days left</h1>
                  </div>

                  {/* Row 2: Title */}
                  <h1 className="text-lg font-medium sm:text-xl">Promotion Name</h1>

                  {/* Row 3: Description */}
                  <p className="mt-1 text-sm text-slate-500">lorem ipsum dolor sit amet, consectetur ...</p>
                </div>
              </div>
            </CardHeader>

            <hr />

            <CardContent>
              {/* Info Stats Row */}
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

              {/* Reward Availability */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <h1 className="font-semibold text-slate-500">REWARD AVAILABILITY</h1>
                <h1 className="text-slate-500">488/2300</h1>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-5/6 bg-blue-600 transition-all duration-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-5 grid grid-cols-12 gap-4">
            <div className="col-span-12 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 md:col-span-6 dark:bg-black">
              <Badge className="text-md bg-transparent px-4 py-1 font-semibold text-black dark:text-slate-500">New Promotion</Badge>
            </div>
            <div className="col-span-12 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 md:col-span-6 dark:bg-black">
              <Badge className="text-md bg-transparent px-4 py-1 font-semibold text-black dark:text-slate-500">New Notification</Badge>
            </div>
          </div>
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
                  <p className="text-sm">{formatDateTime(event?.schedule?.startDateTime) || '-'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm text-slate-500">END DATE</p>
                  </div>
                  <p className="text-sm">{formatDateTime(event?.schedule?.endDateTime) || '-'}</p>
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
          <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-muted-foreground text-sm font-semibold">TICKETS</h2>

              {tickets.map((ticket, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between rounded-md py-4">
                    <div className="flex-1 space-y-1">
                      <div className="mr-2 flex items-center justify-between">
                        <div>
                          <p className="text-base font-medium">{ticket.title}</p>
                          <p className="text-muted-foreground text-xs">From {ticket.from}</p>
                        </div>
                        <p>
                          {ticket.sold}/ {ticket.total}
                        </p>
                      </div>

                      <div className="mt-1">
                        <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full dark:bg-white">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{
                              width: `${(ticket.sold / ticket.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <p className="text-muted-foreground text-xs">
                        {ticket.sold}/{ticket.total}
                      </p>
                    </div>
                    {/* <Button variant="outline" size="sm">
                      Boost
                    </Button> */}
                  </div>
                  <hr />
                </div>
              ))}

              {/* Total Summary */}
              <div className="flex items-center justify-between pt-2 md:pt-4">
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Total</p>
                  <p className="text-lg font-bold">12,026 €</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Tickets
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Updates Section */}
          <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-muted-foreground text-sm font-semibold">UPDATES</h2>

              {updates.map((update, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between rounded-md py-4">
                    <div className="flex-1 space-y-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Dot className="text-primary bg-primary -ml-1 h-2 w-2 rounded-full" />
                        <p className="text-sm font-medium">{update.title}</p>
                      </div>
                      <p className="text-muted-foreground text-sm">{update.description}</p>
                    </div>
                    {/* <Button variant="outline" size="sm">
                      Boost
                    </Button> */}
                  </div>
                  <hr />
                </div>
              ))}

              {/* Optional Summary Section */}
              <div className="flex items-center justify-between px-2 pt-5">
                <p className="text-muted-foreground text-sm font-semibold">Last updated: 2 hours ago</p>
                <Button variant="outline" size="sm">
                  Manage Updates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventOverView;
