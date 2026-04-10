'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ViewsOverTime } from '@/sections/invoices';
import ReferralsDetailPageTable from './referrals-detail-table';
import { useReferralGlobalAnalyticsQuery, useReferralLoyaltyAnalyticsQuery } from '@/store/Reducer/referrals-api';
import DashboardSkeleton from '@/sections/super-admin-dashboard/components/DashboardSkeleton';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';

type StatCardProps = {
  title: string;
  value: string | number;
};

type ReferralAnalytics = {
  totalCompleted: number;
  totalPointsGiven: number;
  topReferrers: { username: string; count: number }[];
  referralSettings: {
    pointsPerReferral: number;
    maxReferralsPerUser: number;
    isActive: boolean;
  };
};

const ReferralsDetailsView = ({ global = false }: { global?: boolean }) => {

  const { companyId } = useCompanySelectionState();
  
  const dashboardQuery = global ? 
     useReferralGlobalAnalyticsQuery({},{ refetchOnMountOrArgChange: true }) :
     useReferralLoyaltyAnalyticsQuery({ companyOrganizer: companyId }, { refetchOnMountOrArgChange: true });

  const  { data : referralGlobalAnalytics= {} as any , isLoading, isFetching } = dashboardQuery;
   
  if (isLoading || isFetching) {
      return <DashboardSkeleton />;
    }

  return (
    <>
      {/* --------- REFERRALS HEADER --------- */}
      <Card className="dark:bg-secondary mt-5 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Referrals Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(referralGlobalAnalytics?.data?.stats)
            ? referralGlobalAnalytics?.data?.stats?.map((stat: any, idx: number) => (
                <StatCard key={idx} title={stat?.title} value={stat?.value} />
              ))
            : null}
        </CardContent>
      </Card>

      {/* --------- REFERRALS CHARTS --------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* Referrals Over Time */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Referrals Over Time</h3>
            </CardHeader>
            <ViewsOverTime
              height={330}
              data={
                Array.isArray(referralGlobalAnalytics?.data?.referralsOverTime)
                  ? referralGlobalAnalytics.data.referralsOverTime.map((item: any) => ({
                      month: item.month,
                      views: Number(item.points ?? 0),
                    }))
                  : []
              }
            />
          </Card>
        </div>

        {/* Top Referrers */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary min-h-full shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Top Referrers</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {Array.isArray(referralGlobalAnalytics?.data?.topReferrers)
                  ? referralGlobalAnalytics.data.topReferrers.map((user: any, i: number) => (
                      <li key={i} className="flex justify-between border-b pb-1 text-sm">
                        <span>{user.referrerUserName}</span>
                        <span className="font-semibold">{user.totalReferrals}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --------- REFERRAL LIST --------- */}
      <div className="mt-6">
        <ReferralsDetailPageTable global={global} companyId={companyId} />
      </div>

      {/* --------- CURRENT SETTINGS --------- */}
      <Card className="dark:bg-secondary mt-6 shadow-md">
        <CardHeader>
          <h3 className="text-lg font-semibold">Current Referral Settings</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Points Per Referral:</strong> {referralGlobalAnalytics?.data?.referralSettings?.referrerPoints}
          </p>
          <p>
            <strong>Referral Limit:</strong> {referralGlobalAnalytics?.data?.referralSettings?.referralLimit}
          </p>
          <p>
            <strong>Status:</strong> {referralGlobalAnalytics?.data?.referralSettings?.status}
          </p>
        </CardContent>
      </Card>
    </>
  );
};

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card className="dark:bg-secondary gap-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium dark:text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default ReferralsDetailsView;
