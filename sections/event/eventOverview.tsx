import BadgeList from '@/components/common/badge-list';
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
          <Card className="dark:bg-secondary mt-3 shadow-lg">
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
          <Card className="dark:bg-secondary mt-3 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">VENUE TYPE</h1>
              <div className="flex items-center gap-2">
                {/* <PartyPopper /> */}
                <p className="text-md mt-2 capitalize">{event?.basicInfo?.venue?.title || ''}</p>
              </div>
            </CardHeader>
          </Card>

          {/* categories */}
          <Card className="dark:bg-secondary mt-3 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">CATEGORIES</h1>
              <BadgeList items={event?.basicInfo?.categories} capitalize />
            </CardHeader>
          </Card>

          {/* tags */}
          <Card className="dark:bg-secondary mt-3 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">TAGS</h1>
              <BadgeList items={event?.basicInfo?.tags} capitalize />
            </CardHeader>
          </Card>

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
         
        </div>
      </div>
    </div>
  );
};

export default EventOverView;
