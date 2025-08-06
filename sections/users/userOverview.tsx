import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { m } from 'framer-motion';
import {
  CalendarDays,
  DollarSign,
  Eye,
  Globe,
  Heart,
  MapPin,
  Pencil,
  Share2,
  UserRound,
  Users,
} from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  followedEventList,
  followedOrganizationsList,
  userTags,
  venueTypes,
} from '../users/data';

const UserOverView: React.FC<{ userType: string | null; user: any }> = ({
  userType,
  user,
}) => {
  const permissionList = [
    'Ticketing',
    'Loyalty',
    'InApp ordering',
    'Reservation management',
  ];

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

  // const accessList = [
  //   'Ticket validation',
  //   'Reservation info',
  //   'Ticket analytics',
  //   'NFC/QR scanning of tickets and loyalty cards',
  //   'Viewing active loyalty transactions (point redemption)',
  //   'Manually entering transaction codes (if NFC unavailable)',
  //   'Checking orders and confirming delivery',
  //   'Viewing table booking sta`t`us',
  // ];

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
          {userType === 'staff' && (
            <>
              <Card className="dark:bg-secondary mt-4 w-full shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-500 dark:text-slate-500">
                    Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {permissionList.map((perm, idx) => (
                    <Badge key={idx} variant="default">
                      {perm}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {(userType === 'admin' || userType === 'organizer') && (
            <>
              <Card className="dark:bg-secondary mt-6 gap-2 rounded-2xl bg-white pb-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-500 dark:text-slate-500">
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {/* Name */}
                  <div className="">
                    <span className="w-28 font-semibold text-gray-500">
                      Name:
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      {user.businessDetails.name}
                    </span>
                  </div>

                  {/* Description */}
                  <div className=" ">
                    <span className="w-28 font-semibold text-gray-500">
                      Description:
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      {user.businessDetails.description}
                    </span>
                  </div>

                  {/* Website */}
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <a
                      href={user.businessDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium break-all text-blue-600 hover:underline"
                    >
                      {user.businessDetails.website}
                    </a>
                  </div>

                  {/* Social Links */}
                  <div className="mt-5 flex justify-end gap-2">
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                        />
                      </svg>
                    </div>
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        >
                          <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
                          <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01" />
                        </g>
                      </svg>
                    </div>
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M5 1.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M3.75 4a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m-1.5 4A.75.75 0 0 1 3 7.25h4a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75zm1.5.75v11.5h2.5V8.75zM9.25 8a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v.434l.435-.187a7.8 7.8 0 0 1 2.358-.595C20.318 7.4 22.75 9.58 22.75 12.38V21a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75v-7a1.25 1.25 0 0 0-2.5 0v7a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75zm1.5.75v11.5h2.5V14a2.75 2.75 0 1 1 5.5 0v6.25h2.5v-7.87c0-1.904-1.661-3.408-3.57-3.234a6.3 6.3 0 0 0-1.904.48l-1.48.635a.75.75 0 0 1-1.046-.69V8.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14 12l-3.5 2v-4z"
                          />
                          <path d="M2 12.708v-1.416c0-2.895 0-4.343.905-5.274c.906-.932 2.332-.972 5.183-1.053C9.438 4.927 10.818 4.9 12 4.9s2.561.027 3.912.065c2.851.081 4.277.121 5.182 1.053S22 8.398 22 11.292v1.415c0 2.896 0 4.343-.905 5.275c-.906.931-2.331.972-5.183 1.052c-1.35.039-2.73.066-3.912.066s-2.561-.027-3.912-.066c-2.851-.08-4.277-.12-5.183-1.052S2 15.602 2 12.708Z" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-secondary mt-4 rounded-2xl bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-500">
                    Bank Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1 text-sm text-slate-500 dark:text-gray-400">
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-slate-500">OIB:</p>
                    <p className="text-gray-800 dark:text-white">
                      {user.bankDetails?.oib || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-slate-500">IBAN:</p>
                    <p className="text-gray-800 dark:text-white">
                      {user.bankDetails?.iban || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-gray-500">
                      Bank Account Name:
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {user.bankDetails?.bankAccountName || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-gray-500">
                      Representative Full Name:
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {user.bankDetails?.representativeFullName || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-gray-500">Address:</p>
                    <p className="text-gray-800 dark:text-white">
                      {user.bankDetails?.address || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-gray-500">Postal Code:</p>
                    <p className="text-gray-800 dark:text-white">
                      {user.bankDetails?.postalCode || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-gray-500">City:</p>
                    <p className="text-gray-800 dark:text-white">
                      {user.bankDetails?.city || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <p className="font-bold text-gray-500">Country:</p>
                    <p className="text-gray-800 dark:text-white">
                      {user.bankDetails?.country || 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-secondary mt-6 mb-6 w-full max-w-4xl rounded-2xl bg-white shadow-sm transition hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-lg font-semibold">
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className=" ">
                  {/* Left: Event Info */}
                  <div className="flex flex-col justify-center space-y-2">
                    <h2 className="text-primary mb-1 text-2xl font-extrabold">
                      Tech Summit 2025
                    </h2>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">Expo Center, Lahore</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">By: InnovateX</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <CalendarDays className="h-5 w-5" />
                      <span className="font-medium">
                        Aug 1, 2025 – Aug 3, 2025
                      </span>
                    </div>
                  </div>
                  {/* Right: Stats + CTA */}
                  <div className="mt-3 flex flex-col items-start gap-4 text-sm">
                    <div className="text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        <span>
                          <span className="font-medium">Budget:</span>{' '}
                          <strong className="text-foreground">$5000</strong>
                        </span>
                      </div>
                      <div className="items- flex gap-2">
                        <UserRound className="h-5 w-5" />
                        <span>
                          <span className="font-medium">Attendees:</span>{' '}
                          <strong className="text-foreground">1500</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>
                          <span className="font-medium">Region:</span>{' '}
                          <strong className="text-foreground">
                            North America
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">CATEGORIES</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {userTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="text-md rounded-full border border-gray-400 bg-white px-2 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {/* tags */}
          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">TAGS</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {userTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="text-md rounded-full border border-gray-400 bg-white px-2 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {/* venue tag */}
          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">VENUE TYPE</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {venueTypes.map((item, index) => (
                    <Badge
                      key={index}
                      className="text-md rounded-full border border-gray-400 bg-white px-2 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          <Card className="dark:bg-secondary mt-4 gap-y-0 shadow-lg">
            <CardHeader className="">
              <h3 className="mb-2 text-lg font-semibold text-slate-500">
                Wallet Information
              </h3>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="flex items-center gap-2 text-xl">
                <strong className="text-slate-500">Balance:</strong>{' '}
                <span className="text-3xl font-bold">$95.00</span>
              </p>
              <p>
                <strong className="text-slate-500">Recent Transactions:</strong>{' '}
                See more go to transaction tab
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-sm">Tickets: 10</p>
                </div>
                <div>
                  <p className="text-sm">Rewards: 5</p>
                </div>
                <div>
                  <p className="text-sm">Loyalty Cards: 3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <Card className="mt-4 rounded-2xl bg-white shadow-lg dark:bg-[#1a1a1a]">
            <CardHeader>
              <h1 className="text-xl font-semibold text-slate-500 dark:text-slate-500">
                User Interactions
              </h1>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {interactions.map((item, index) => (
                  <m.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Card className="border-muted dark:bg-muted/50 cursor-pointer rounded-xl border p-5 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-muted rounded-full p-2">
                          {item.icon}
                        </div>
                        <div className="text-center">
                          <h2 className="text-muted-foreground text-sm text-nowrap">
                            {item.label}
                          </h2>
                          <p className="text-primary text-2xl font-extrabold">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </m.div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* timeline  */}

          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-500">
                    Loyalty Program Participation
                  </h1>

                  <div className="flex gap-3">
                    <Pencil
                      className="hover:text-primary h-5 w-5 cursor-pointer text-gray-500 transition"
                      onClick={openModal.onTrue}
                    />
                  </div>
                </div>

                <div className="mt-2 space-y-2 text-sm">
                  <p>
                    <strong className="text-slate-500">Global Status:</strong>{' '}
                    Platium
                  </p>
                  <p>
                    <strong className="text-slate-500">Global Points:</strong>{' '}
                    1,800 pts
                  </p>
                  <p>
                    <strong className="text-slate-500">Global Spent:</strong> 40
                    pts
                  </p>
                </div>

                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  <div className="flex items-center justify-between gap-3 py-2 dark:border-gray-600">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">
                            Club Name
                          </th>
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">
                            Points
                          </th>
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">
                            Tier
                          </th>
                          <th className="px-2 py-1 font-semibold text-gray-600 dark:text-gray-300">
                            Spent
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Premium Club</td>
                          <td className="px-2 py-1">1200 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-yellow-400 text-white">
                              Gold
                            </Badge>
                          </td>
                          <td className="px-2 py-1">25</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">EventPlus</td>
                          <td className="px-2 py-1">600 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-gray-400 text-white">
                              Silver
                            </Badge>
                          </td>
                          <td className="px-2 py-1">15</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">VIP Access</td>
                          <td className="px-2 py-1">300 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-yellow-800 text-white">
                              Premium
                            </Badge>
                          </td>
                          <td className="px-2 py-1">8</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Music Lovers</td>
                          <td className="px-2 py-1">950 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-gray-400 text-white">
                              Silver
                            </Badge>
                          </td>
                          <td className="px-2 py-1">18</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Cinema Club</td>
                          <td className="px-2 py-1">400 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-yellow-400 text-white">
                              Gold
                            </Badge>
                          </td>
                          <td className="px-2 py-1">10</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1">Sports Elite</td>
                          <td className="px-2 py-1">700 pts</td>
                          <td className="px-2 py-1">
                            <Badge className="bg-gray-400 text-white">
                              Silver
                            </Badge>
                          </td>
                          <td className="px-2 py-1">32</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">
                  FOLLOWED ORGANIZATION
                </h1>

                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  {followedOrganizationsList?.map((item, index) => (
                    <div
                      className="flex items-center justify-between gap-3 border-b border-gray-300 py-2 dark:border-gray-600"
                      key={index}
                    >
                      <p>{item.orgName}</p>

                      <Badge
                        variant="secondary"
                        className="mt-1 bg-gray-200 text-xs capitalize dark:bg-gray-600"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {userType === 'user' && (
            <Card className="dark:bg-secondary mt-4 shadow-lg">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">
                  FOLLOWED EVENTS
                </h1>
                <div className="mt-2 max-h-48 gap-2 overflow-y-auto">
                  {followedEventList?.map((item, index) => (
                    <div
                      className="flex items-center justify-between gap-3 border-b border-gray-300 py-2 dark:border-gray-600"
                      key={index}
                    >
                      <p>{item.orgName}</p>

                      <Badge
                        variant="secondary"
                        className="mt-1 bg-gray-200 text-xs capitalize dark:bg-gray-600"
                      >
                        {item.views} Views
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
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(() => {})}
            >
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

                  <RHFTextField
                    name="globalPoints"
                    label="Global Points"
                    placeholder="Enter Global Points"
                  />

                  <RHFTextField
                    name="globalSpent"
                    label="Global Spent"
                    placeholder="Enter Global Spent"
                  />
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
                      <RHFTextField
                        name="points"
                        label="Points"
                        placeholder="Enter Points"
                      />

                      <RHFTextField
                        name="tier"
                        label="Tier"
                        placeholder="Enter Tier"
                      />

                      <RHFTextField
                        name="spent"
                        label="Spent"
                        placeholder="Enter Spent"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
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
