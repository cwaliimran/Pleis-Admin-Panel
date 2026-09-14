import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { fDate, formatStr } from '@/utils/format-time';
import { m } from 'framer-motion';
import { CalendarDays, Eye, Globe, Heart, MapPin, Pencil, Share2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import UserBusinessInfo from './userBusinessInfo';

// Reusable Badge List Component with "See more" functionality
const ITEMS_LIMIT = 10;

interface BadgeListProps {
  title: string;
  items: Array<{ _id: string; title: string }> | undefined;
}

const BadgeListCard: React.FC<BadgeListProps> = ({ title, items }) => {
  const [showAll, setShowAll] = React.useState(false);

  const hasItems = items && items.length > 0;
  const displayedItems = hasItems ? (showAll ? items : items.slice(0, ITEMS_LIMIT)) : [];
  const hasMoreItems = hasItems && items.length > ITEMS_LIMIT;

  return (
    <Card className="dark:bg-secondary mt-4 shadow-lg">
      <CardHeader>
        <h1 className="font-semibold text-slate-500">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {hasItems ? (
            <>
              {displayedItems.map((item) => (
                <Badge
                  key={item._id}
                  className="rounded-full border border-gray-400 bg-white px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:text-gray-300 dark:hover:text-white"
                >
                  {item.title}
                </Badge>
              ))}
              {hasMoreItems && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="text-primary cursor-pointer text-sm font-medium hover:underline dark:text-gray-200"
                >
                  {showAll ? 'See less' : `+${items.length - ITEMS_LIMIT} more`}
                </button>
              )}
            </>
          ) : (
            <Badge className="text-md rounded-full border border-gray-400 bg-white px-2 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white">
              -
            </Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

const UserOverView: React.FC<{
  userType: string | null;
  user: any;
  apiData: any;
}> = ({ userType, apiData }) => {
  const permissionLabels: Record<string, string> = {
    inAppOrdering: 'InApp ordering',
    reservationManagement: 'Reservation management',
    loyaltyScanning: 'Loyalty',
    ticketing: 'Ticketing',
  };

  const openModal = useBoolean();

  const methods = useForm({
    defaultValues: {
      globalStatus: '',
      globalPoints: '',
      globalSpent: '',
      clubName: '',
      points: '',
      tier: '',
      spent: '',
    },
  });

  // Clubs the user has actually joined, shaped for the Club Name select.
  const clubOptions = React.useMemo(() => {
    const clubs = Array.isArray(apiData?.joinedClubs) ? apiData.joinedClubs : [];

    return clubs.map((club: any, index: number) => ({
      label: club?.companyOrganizer?.companyDetails?.name || 'Unnamed club',
      // Response is untyped, so fall through the ids it may carry — the value
      // must be unique and non-empty or the select silently drops the option.
      value: club?._id || club?.companyOrganizer?._id || `club-${index}`,
    }));
  }, [apiData?.joinedClubs]);

  const hasClubs = clubOptions.length > 0;

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      methods.reset();
      openModal.onFalse();
    }
  };

  const interactions = [
    {
      label: 'Viewed Content',
      value: apiData?.eventEngagement?.views || 0,
      icon: <Eye className="h-6 w-6 text-blue-500" />,
    },
    {
      label: 'Liked Content',
      value: apiData?.eventEngagement?.favorites || 0,
      icon: <Heart className="h-6 w-6 text-pink-500" />,
    },
    {
      label: 'Shared Content',
      value: apiData?.eventEngagement?.shares || 0,
      icon: <Share2 className="h-6 w-6 text-green-500" />,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          {/* USERTYPE -> STAFF */}
          {userType === 'staff' && (
            <Card className="dark:bg-secondary mt-4 w-full shadow-lg">
              <CardHeader className="gap-0">
                <CardTitle className="text-xl font-semibold text-slate-500 dark:text-slate-500">Permissions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {apiData?.organizations?.[0]?.staff?.[0]?.featuresAccess?.map((perm: string, idx: number) => (
                  <Badge key={idx} variant="default">
                    {permissionLabels[perm] ?? perm}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {(userType === 'admin' || userType === 'organizer') && <UserBusinessInfo organizationData={apiData?.basicInfo?.companyDetails} />}

          {/* CATEGORIES */}
          {userType === 'user' && <BadgeListCard title="CATEGORIES" items={apiData?.interests?.categories} />}

          {/* TAGS */}
          {userType === 'user' && <BadgeListCard title="TAGS" items={apiData?.interests?.tags} />}

          {/* VENUE TYPE */}
          {userType === 'user' && <BadgeListCard title="VENUE TYPE" items={apiData?.interests?.venueTypes} />}

          {/* WALLET INFORMATION */}
          {(userType === 'manager' || userType === 'organizer') && (
            <Card className="dark:bg-secondary mt-4 gap-y-0 shadow-lg">
              <CardHeader className="">
                <h3 className="mb-2 text-lg font-semibold text-slate-500">Wallet Information</h3>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="flex items-center gap-2 text-xl">
                  <strong className="text-slate-500">Balance:</strong> <span className="text-3xl font-bold">$0</span>
                </p>
                <p>
                  <strong className="text-slate-500">Recent Transactions:</strong> See more go to transaction tab
                </p>

                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-sm">Tickets: 0</p>
                  </div>
                  <div>
                    <p className="text-sm">Rewards: 0</p>
                  </div>
                  <div>
                    <p className="text-sm">Loyalty Cards: 0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-12 lg:col-span-7">
          {/* BANK DETAILS */}
          {(userType === 'admin' || userType === 'organizer') && (
            <Card className="dark:bg-secondary mt-4 gap-2 rounded-2xl bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-500">Bank Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-1 text-sm text-slate-500 dark:text-gray-400">
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-slate-500">VAT:</p>
                  <p className="text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.oib || 'N/A'}</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-slate-500">IBAN:</p>
                  <p className="text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.bankAccountNumber || 'N/A'}</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-gray-500">Bank Account Name:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.name || 'N/A'}</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-gray-500">Representative Full Name:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.representativeName || 'N/A'}</p>
                </div>

                {/* <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="text-gray-800 dark:text-white">
                    <span className="font-bold text-gray-500">Address: </span>
                    {apiData?.basicInfo?.companyDetails?.location?.fullAddress || 'N/A'}
                  </p>
                </div> */}

                {/* 
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-gray-500">Postal Code:</p>
                  <p className="text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.location?.postalCode || 'N/A'}</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-gray-500">City:</p>
                  <p className="text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.location?.city || 'N/A'}</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <p className="font-bold text-gray-500">Country:</p>
                  <p className="text-gray-800 dark:text-white">{apiData?.basicInfo?.companyDetails?.location?.country || 'N/A'}</p>
                </div> */}
              </CardContent>
            </Card>
          )}

          {/* LATEST EVENT DETAILS */}
          {(userType === 'admin' || userType === 'organizer') && (
            <Card className="dark:bg-secondary mt-6 mb-6 w-full max-w-4xl gap-2 rounded-2xl bg-white shadow-sm transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-lg font-semibold">Latest Event Details</CardTitle>
              </CardHeader>
              <CardContent className=" ">
                {/* Left: Event Info */}
                <div className="flex flex-col justify-center space-y-2">
                  <h2 className="mb-3 text-xl font-extrabold text-gray-800 dark:text-gray-300">{apiData?.event?.basicInfo?.title || 'Event Name'}</h2>

                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-x-1">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">Location:</span>{' '}
                    </span>

                    <span className="font-medium">{apiData?.event?.basicInfo?.venueLocation?.fullAddress || '-'}</span>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-x-1">
                      <CalendarDays className="h-5 w-5" />
                      <span className="font-medium">Date:</span>{' '}
                    </span>
                    <span className="font-medium">
                      {fDate(apiData?.event?.schedule?.startDateTime, formatStr.split.date)} –{' '}
                      {fDate(apiData?.event?.schedule?.endDateTime, formatStr.split.date)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col items-start gap-4 text-sm">
                  <div className="text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      <span>
                        <span className="font-medium">Region:</span>{' '}
                        <strong className="text-foreground">{apiData?.event?.meta?.region || '-'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* USER INTERACTIONS */}
          {(userType === 'user' || userType === 'guest') && (
            <Card className="mt-4 rounded-2xl bg-white shadow-lg dark:bg-[#1a1a1a]">
              <CardHeader>
                <h1 className="text-xl font-semibold text-slate-500 dark:text-slate-500">User Interactions</h1>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {interactions.map((item, index) => (
                    <m.div key={index} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <Card className="border-muted dark:bg-muted/50 cursor-pointer rounded-xl border p-5 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-muted rounded-full p-2">{item.icon}</div>
                          <div className="text-center">
                            <h2 className="text-muted-foreground text-sm text-nowrap">{item.label}</h2>
                            <p className="text-2xl font-extrabold text-gray-600 dark:text-gray-300">{item?.value}</p>
                          </div>
                        </div>
                      </Card>
                    </m.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* LOYALTY PROGRAM PARTICIPATION */}
          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-500">Loyalty Program Participation</h1>

                  <div className="flex gap-3">
                    <Pencil className="hover:text-primary h-5 w-5 cursor-pointer text-gray-500 transition" onClick={openModal.onTrue} />
                  </div>
                </div>

                <div className="mt-2 space-y-2 text-sm">
                  <p>
                    <strong className="text-slate-500">Global Status:</strong> {apiData?.globalPoints?.global?.level?.title || 'N/A'}
                  </p>
                  <p>
                    <strong className="text-slate-500">Global Points:</strong>{' '}
                    {apiData?.globalPoints?.global?.points ? `${apiData.globalPoints.global.points} pts` : 'N/A'}
                  </p>
                  <p>
                    <strong className="text-slate-500">Global Spent:</strong> {apiData?.globalPoints?.global?.spent || 'N/A'}
                  </p>
                </div>

                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  <div className="flex items-center justify-between gap-3 py-2 dark:border-gray-600">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">Club Name</th>
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">Points</th>
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">Tier</th>
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiData?.joinedClubs?.length > 0 ? (
                          apiData.joinedClubs.map((club: any, index: number) => (
                            <tr className="border-b border-gray-100 dark:border-gray-700" key={index}>
                              <td className="px-2 py-1">{club?.companyOrganizer?.companyDetails?.name || 'N/A'}</td>
                              <td className="px-2 py-1">{club?.points?.toFixed(0) || 'N/A'} pts</td>
                              <td className="px-2 py-1">
                                <Badge className={`bg-green-800 text-white`}>{club?.level?.title || 'N/A'}</Badge>
                                {/* <CustomBadge variant={club.status === 'active' ? 'success' : club.status === 'inactive' ? 'error' : 'info'}>
                                  {club.status}
                                </CustomBadge> */}
                              </td>
                              <td className="px-2 py-1">{club?.spent || 'N/A'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-100 dark:border-gray-700">
                            <td className="px-2 py-1" colSpan={4} align="center">
                              No club participation data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* FOLLOWED ORGANIZERS */}
          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">FOLLOWED ORGANIZER</h1>

                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  {apiData?.joinedClubs?.map((club: any, index: number) => (
                    <div className="flex items-center justify-between gap-3 border-b border-gray-300 py-2 dark:border-gray-600" key={index}>
                      <p>{club?.companyOrganizer?.companyDetails?.name || 'N/A'}</p>

                      <CustomBadge variant={club.status === 'active' ? 'success' : club.status === 'inactive' ? 'error' : 'info'}>
                        {club.status}
                      </CustomBadge>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {/* FOLLOWED EVENTS */}
          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">EVENT</h1>
                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  {apiData?.eventEngagement?.events?.map((item: any, index: number) => (
                    <div className="flex items-center justify-between gap-3 py-2 dark:border-gray-600" key={index}>
                      <p>{item?.eventDetails?.basicInfo?.title}</p>

                      <Badge variant="secondary" className="mt-1 bg-gray-200 text-xs capitalize dark:bg-gray-600">
                        {item?.views?.toFixed(0) || 'N/A'} Views
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>

      {/* EDIT LOYALTY PROGRAM */}
      <Dialog open={openModal.value} onOpenChange={handleModalOpenChange}>
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[560px]"
        >
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="pr-8 text-base font-semibold">Edit Loyalty Program</DialogTitle>
            <p className="text-muted-foreground text-sm">Update the global loyalty standing and per-club balances for this user.</p>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={methods.handleSubmit(() => {})} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {/* GLOBAL */}
              <section className="space-y-4">
                <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Global</h3>

                <RHFSelectField
                  name="globalStatus"
                  label="Global Status"
                  placeholder="Select status"
                  options={[
                    { label: 'Gold', value: 'gold' },
                    { label: 'Silver', value: 'silver' },
                    { label: 'Bronze', value: 'bronze' },
                  ]}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <RHFTextField name="globalPoints" label="Global Points" type="number" min={0} placeholder="0" />
                  <RHFTextField name="globalSpent" label="Global Spent" type="number" min={0} placeholder="0" />
                </div>
              </section>

              {/* PER-CLUB */}
              <section className="space-y-4 border-t pt-5">
                <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Club Loyalty</h3>

                <RHFSelectField
                  name="clubName"
                  label="Club Name"
                  placeholder={hasClubs ? 'Select a club' : 'No clubs joined'}
                  disabled={!hasClubs}
                  options={clubOptions}
                />

                {/* Club-level fields only apply once a club is chosen */}
                {methods.watch('clubName') ? (
                  <div className="bg-muted/40 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-3">
                    <RHFTextField name="points" label="Points" type="number" min={0} placeholder="0" />
                    <RHFTextField name="tier" label="Tier" placeholder="e.g. Gold" />
                    <RHFTextField name="spent" label="Spent" type="number" min={0} placeholder="0" />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {hasClubs ? 'Select a club to edit its points, tier and spend.' : 'This user has not joined any clubs yet.'}
                  </p>
                )}
              </section>
            </div>

            <DialogFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => handleModalOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserOverView;
