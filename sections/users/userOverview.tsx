import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { fDate, formatStr } from '@/utils/format-time';
import { m } from 'framer-motion';
import { CalendarDays, Eye, Globe, Heart, MapPin, Pencil, Share2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { followedEventList, followedOrganizationsList } from '../users/data';
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
      role: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      clubName: '',
      points: '',
      tier: '',
      spent: '',
    },
  });

  const interactions = [
    {
      label: 'Viewed Content',
      value: 124,
      icon: <Eye className="h-6 w-6 text-blue-500" />,
    },
    {
      label: 'Liked Content',
      value: 78,
      icon: <Heart className="h-6 w-6 text-pink-500" />,
    },
    {
      label: 'Shared Content',
      value: 32,
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
          {(userType === 'manager' || userType === 'organizer' || userType === 'staff') && (
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
                            <p className="text-primary text-2xl font-extrabold">0</p>
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
                    <strong className="text-slate-500">Global Status:</strong> Platium
                  </p>
                  <p>
                    <strong className="text-slate-500">Global Points:</strong> 0 pts
                  </p>
                  <p>
                    <strong className="text-slate-500">Global Spent:</strong> 0 pts
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
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Premium Club</td>
                          <td className="px-2 py-1">0 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-yellow-400 text-white">Gold</Badge>
                          </td>
                          <td className="px-2 py-1">0</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">EventPlus</td>
                          <td className="px-2 py-1">0 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-gray-400 text-white">Silver</Badge>
                          </td>
                          <td className="px-2 py-1">0</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">VIP Access</td>
                          <td className="px-2 py-1">0 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-yellow-800 text-white">Premium</Badge>
                          </td>
                          <td className="px-2 py-1">0</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Music Lovers</td>
                          <td className="px-2 py-1">0 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-gray-400 text-white">Silver</Badge>
                          </td>
                          <td className="px-2 py-1">0</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Cinema Club</td>
                          <td className="px-2 py-1">0 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-yellow-400 text-white">Gold</Badge>
                          </td>
                          <td className="px-2 py-1">0</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Sports Elite</td>
                          <td className="px-2 py-1">0 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-gray-400 text-white">Silver</Badge>
                          </td>
                          <td className="px-2 py-1">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* FOLLOWED ORGANIZATIONS */}
          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">FOLLOWED ORGANIZATION</h1>

                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  {followedOrganizationsList?.map((item, index) => (
                    <div className="flex items-center justify-between gap-3 border-b border-gray-300 py-2 dark:border-gray-600" key={index}>
                      <p>{item.orgName}</p>

                      <Badge variant="secondary" className="mt-1 bg-gray-200 text-xs capitalize dark:bg-gray-600">
                        {item.status}
                      </Badge>
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
                <h1 className="font-semibold text-slate-500">FOLLOWED EVENTS</h1>
                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  {followedEventList?.map((item, index) => (
                    <div className="flex items-center justify-between gap-3 border-b border-gray-300 py-2 dark:border-gray-600" key={index}>
                      <p>{item.orgName}</p>

                      <Badge variant="secondary" className="mt-1 bg-gray-200 text-xs capitalize dark:bg-gray-600">
                        0 Views
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>

      {/* update Organization */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Loyalty Program</DialogTitle>
            </DialogHeader>
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(() => {})}>
              <div className="mt-4 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="globalStatus"
                    label="Global Status"
                    placeholder="Select Global Status"
                    className="w-full flex-1"
                    options={[
                      { label: 'Gold', value: 'gold' },
                      { label: 'Silver', value: 'silver' },
                      { label: 'Bronze', value: 'bronze' },
                    ]}
                  />

                  <RHFTextField name="globalPoints" label="Global Points" placeholder="Enter Global Points" />

                  <RHFTextField name="globalSpent" label="Global Spent" placeholder="Enter Global Spent" />
                </div>

                <div className="flex border-t border-gray-300 pt-4">
                  <h3 className="font-bold">Loyalty</h3>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="clubName"
                    label="Club Name"
                    placeholder="Select Club Name"
                    className="w-full flex-1"
                    options={[
                      { label: 'Premium Club', value: 'PremiumClub' },
                      { label: 'EventPlus', value: 'EventPlus' },
                      { label: 'Music Lovers', value: 'MusicLovers' },
                    ]}
                  />

                  {/* Show next 3 fields only if a club name is selected */}
                  {methods.watch('clubName') && (
                    <>
                      <RHFTextField name="points" label="Points" placeholder="Enter Points" />

                      <RHFTextField name="tier" label="Tier" placeholder="Enter Tier" />

                      <RHFTextField name="spent" label="Spent" placeholder="Enter Spent" />
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button type="button" className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white">
                    Save
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default UserOverView;
