'use client';

import { AppLoading } from '@/components/atoms/app-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoolean } from '@/hooks/useBoolean';
import BookingHistory from '@/sections/users/bookingHistory';
import { organizerCardData } from '@/sections/users/data';
import Loyalty from '@/sections/users/loyalty';
import LoyaltyAndOrderTransaction from '@/sections/users/loyaltyAndOrderTransaction';
import UserCard from '@/sections/users/userCard';
import UserOverView from '@/sections/users/userOverview';
import { useGetUserByIdQuery } from '@/store/Reducer/user-list';
import { fDate, formatStr } from '@/utils/format-time';
import { showError } from '@/utils/toast';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import EditUserModal from './user-modal/custom-edit-user-modal';
import UserAllTransactionView from '../transactions/user-all-transaction/user-all-transaction-view';

interface UserDetailPageProps {
  userDashboardType: string;
}

const tabData = [
  { value: 'overview', label: 'Overview' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'booking&loyalty', label: 'Booking & Loyalty' },
];

const UserDetailPage = ({ userDashboardType }: UserDetailPageProps) => {
  const { id } = useParams();

  const openModal = useBoolean();
  const data = useSearchParams();
  const userType = data.get('userType');

  const [active, setActive] = React.useState('overview');
  const [activeTransactionTab] = React.useState('all');

  const { data: apiData = {}, isLoading } = useGetUserByIdQuery({ id });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const user = {
    id: '-',
    fullName: '-',
    surname: '-',
    email: '-',
    createdAt: '-',
    phoneNumber: '-',
    gender: '-',
    dateOfBirth: '-',
    region: '-',
    dateOfAccountCreation: '-',
    lastActivity: '-',
    image: '-',
    linkedOrganization: '-',
    businessDetails: {
      name: '-',
      description: '-',
      website: '-',
      socialLinks: {
        facebook: '-',
        instagram: '-',
        twitter: '-',
      },
    },
    bankDetails: {
      oib: '-',
      bankAccountNumber: '-',
      bankAccountName: '-',
      representativeFullName: '-',
      address: '-',
      postalCode: '-',
      city: '-',
      country: '-',
    },
  };

  const handleEdit = (id: string) => {
    if (apiData) {
      setSelectedId(id);
      openModal.onTrue();
    } else {
      showError('User not found');
    }
  };

  return (
    <div>
      {isLoading ? (
        <AppLoading />
      ) : (
        <div className="space-y-6 pb-12">
          <div className="mt-10 h-full">
            <div className="grid grid-cols-12 md:gap-7">
              <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              {/* <div
                className={` ${
                  userType === 'user' || userType === 'guest' || userType === 'staff' ? 'col-span-12' : 'col-span-12 lg:col-span-8 xl:col-span-9'
                } `}
              > */}
                {/* ---------------- UPPER PROFILE SECTION ---------------- */}
                <Card className="dark:bg-secondary overflow-hidden rounded-xl bg-white pb-0 shadow-lg transition-all">
                  <CardContent>
                    <div>
                      <div className="flex flex-col gap-6 lg:flex-row">
                        {/* Profile Image */}
                        <div className="w-full lg:w-1/3">
                          {apiData?.basicInfo?.profileIcon && !apiData?.basicInfo?.profileIcon.toLowerCase().includes('noimage.png') ? (
                            <Image
                              src={apiData?.basicInfo?.profileIcon || '-'}
                              alt={apiData?.basicInfo?.firstName || '-'}
                              priority
                              className="h-56 w-full rounded-lg object-cover shadow sm:h-72"
                              width={300}
                              height={300}
                            />
                          ) : (
                            <div className="flex h-56 items-center justify-center rounded-md border text-center text-4xl font-semibold text-gray-500 dark:text-gray-300">
                              {apiData?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}
                            </div>
                          )}
                        </div>

                        {/* Right Content */}
                        <div className="flex w-full flex-col gap-4 lg:w-2/3">
                          {/* Actions and Role Info */}
                          <div className="flex items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800 capitalize">
                                {apiData?.accountState?.userType || '-'}
                              </span>
                              <span>Joined: {fDate(apiData?.metadata?.createdAt, formatStr.split.date)}</span>
                            </div>
                            <div className="flex gap-3">
                              <Pencil
                                className="hover:text-primary h-5 w-5 cursor-pointer text-gray-500 transition"
                                onClick={() => handleEdit(apiData?.basicInfo?._id)}
                              />
                            </div>
                          </div>

                          {/* User Name */}
                          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
                            {apiData?.basicInfo?.firstName || '-'} {apiData?.basicInfo?.lastName || '-'}
                          </h2>

                          {userType === 'staff' && <p className="text-sm text-gray-500 dark:text-gray-400">Linked Organization: -</p>}

                          {/* More Info */}
                          <div className="mt-4">
                            <h4 className="text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400">USER INFO</h4>
                            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-gray-800 lg:grid-cols-2 dark:text-white">
                              <p>
                                <span className="font-medium">Email:</span> {apiData?.basicInfo?.email || '-'}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span> {apiData?.basicInfo?.phoneNumber?.code || '-'}{' '}
                                {apiData?.basicInfo?.phoneNumber?.number || '-'}
                              </p>

                              {userType === 'user' && (
                                <>
                                  <p>
                                    <span className="font-medium">Gender:</span> {apiData?.basicInfo?.gender || '-'}
                                  </p>
                                  <p>
                                    <span className="font-medium">DOB:</span> {fDate(apiData?.basicInfo?.dob, formatStr.split.date) || '-'}
                                  </p>
                                  <p>
                                    <span className="font-medium">Region:</span> {apiData?.basicInfo?.region || '-'}
                                  </p>
                                </>
                              )}
                              {userType === 'staff' && (
                                <p>
                                  <span className="font-medium">Surname:</span> {apiData?.basicInfo?.gender || '-'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 w-full px-2 md:px-0">
                        {/* Small screen dropdown */}
                        <div className="mb-4 block sm:hidden">
                          <Select value={activeTransactionTab} onValueChange={setActive}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select tab" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-secondary">
                              {tabData.map((tab: any) => (
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
                              {tabData.map((tab: any) => (
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
                    </div>
                  </CardContent>
                </Card>

                <div className="rounded-lg">
                  {/* ---------------- OVERVIEW ---------------- */}
                  {active === 'overview' && <UserOverView userType={userType} user={user} apiData={apiData} />}

                  {/* ---------------- TRANSACTION ---------------- */}
                  {active === 'transactions' && <UserAllTransactionView userId={id} />}

                  {/* ---------------- BOOKING & LOYALTY ---------------- */}
                  {active === 'booking&loyalty' && (
                    <>
                      <Card className="dark:bg-secondary col-span-12 mt-4 shadow-lg">
                        <CardHeader>
                          <CardTitle>Booking History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-lg border">
                            <BookingHistory />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="dark:bg-secondary mt-4 shadow-lg">
                        <CardHeader>
                          <CardTitle>Ordering Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-lg border">
                            <LoyaltyAndOrderTransaction />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="dark:bg-secondary mt-4 shadow-lg">
                        <CardHeader>
                          <CardTitle>Loyalty</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-lg border">
                            <Loyalty />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>

              {/* {userType !== 'user' && ( */}
                <div className={`col-span-12 mt-3 space-y-3 md:mt-0 md:space-y-2 lg:col-span-4 xl:col-span-3`}>
                  {organizerCardData.map((user: any) => (
                    <UserCard item={user} key={user._id} />
                  ))}
                </div>
              {/* )} */}
            </div>
          </div>
        </div>
      )}

      <EditUserModal
        open={openModal.value}
        onClose={() => openModal.onFalse()}
        selectedId={selectedId}
        userData={apiData}
        // onUpdateSuccess={(updatedUser) => {
        //   setVenueTypes((prev) =>
        //     prev.map((item) =>
        //       item.basicInfo?._id === selectedId
        //         ? { ...item, ...updatedUser }
        //         : item
        //     )
        //   );
        //   showSuccess('User updated successfully');
        //   openModal.onFalse();
        // }}
        isLoading={false}
        userType={userDashboardType}
      />
    </div>
  );
};

export default UserDetailPage;
