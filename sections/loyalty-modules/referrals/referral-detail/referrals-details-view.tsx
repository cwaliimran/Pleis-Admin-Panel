'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ViewsOverTime } from '@/sections/invoices';
import ReferralsDetailPageTable from './referrals-detail-table';

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

const dummyReferralAnalytics: ReferralAnalytics = {
  totalCompleted: 120,
  totalPointsGiven: 2400,
  topReferrers: [
    { username: 'Alice', count: 30 },
    { username: 'Bob', count: 22 },
    { username: 'Charlie', count: 18 },
  ],
  referralSettings: {
    pointsPerReferral: 20,
    maxReferralsPerUser: 50,
    isActive: true,
  },
};

const ReferralsDetailsView = () => {
  return (
    <>
      {/* --------- REFERRALS HEADER --------- */}
      <Card className="dark:bg-secondary mt-5 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Referrals Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Referrals Completed" value={dummyReferralAnalytics.totalCompleted} />
          <StatCard title="Total Points Given" value={dummyReferralAnalytics.totalPointsGiven} />
          <StatCard title="Points Per Referral" value={dummyReferralAnalytics.referralSettings.pointsPerReferral} />
          <StatCard title="Program Status" value={dummyReferralAnalytics.referralSettings.isActive ? 'Active' : 'Inactive'} />
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
              data={[
                { month: 'Jan', views: 5 },
                { month: 'Feb', views: 8 },
                { month: 'Mar', views: 15 },
                { month: 'Apr', views: 12 },
                { month: 'May', views: 20 },
              ]}
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
                {dummyReferralAnalytics.topReferrers.map((user, i) => (
                  <li key={i} className="flex justify-between border-b pb-1 text-sm">
                    <span>{user.username}</span>
                    <span className="font-semibold">{user.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --------- REFERRAL LIST --------- */}
      <div className="mt-6">
        <ReferralsDetailPageTable />
      </div>

      {/* --------- CURRENT SETTINGS --------- */}
      <Card className="dark:bg-secondary mt-6 shadow-md">
        <CardHeader>
          <h3 className="text-lg font-semibold">Current Referral Settings</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Points Per Referral:</strong> {dummyReferralAnalytics.referralSettings.pointsPerReferral}
          </p>
          <p>
            <strong>Max Referrals Per User:</strong> {dummyReferralAnalytics.referralSettings.maxReferralsPerUser}
          </p>
          <p>
            <strong>Status:</strong> {dummyReferralAnalytics.referralSettings.isActive ? 'Active' : 'Inactive'}
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
