'use client';
import { useGetOrdersAnalyticsQuery } from '@/store/Reducer/orders-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { GenderDonutChart, ViewsOverTime, VisitorAge } from '@/sections/invoices';
import ReservationStatsCard from '@/sections/invoices/ReservationCard';
import RevenueTrendsChart from '@/sections/invoices/revenueTrendsChart';
import OrderTransactionList from './order-listing/OrderTransactionList';
import MenuItemPerformanceTable from './order-listing/MenuItemPerformanceTable';
import ActivePromotionsList from './order-listing/ActivePromotionsList';
import { useCompanySelection } from '@/app/common/header/company-selection-storage';

const OrderAnalyticsView = ({ userType, global: isGlobal }: { global: boolean; userType: string }) => {
  const openModal = useBoolean();

  const { organizerOrganizationIds } = useCompanySelection();

  const { data: analyticsRaw, isLoading, isFetching } = useGetOrdersAnalyticsQuery(
    { organizations: userType === 'organizer' ? organizerOrganizationIds : undefined }, { refetchOnMountOrArgChange: true });
  if (isLoading || isFetching) return null;
  console.log('analyticsRaw', analyticsRaw);
  console.log('userType', userType);

  // const activePercent = 75;
  // const inactivePercent = 25;
  // const thirdPercent = 40;

  const loyaltyOrderFrequency = 75; // 75% of high frequency orders are from loyalty
  // const nonLoyaltyOrderFrequency = 25;
  const loyaltyAvgSpend = 60; // Loyalty users spend 60% more than non-loyalty
  // const nonLoyaltyAvgSpend = 40;

  // Format stats values based on key before passing to ReservationStatsCard
  const formatStatValue = (key: string, value: any) => {
    switch (key) {
      case 'totalRevenue':
      case 'revenueAfterCommission':
      case 'averageOrderValue':
        return `€${Number(value).toLocaleString()}`;
      case 'orderFrequencyPerHour':
        return `${value} / hr`;
      default:
        return value;
    }
  };

  return (
    <>
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {analyticsRaw?.data?.stats?.map((card: any, index: number) => (
          <ReservationStatsCard
            key={index}
            item={{
              ...card,
              value: formatStatValue(card.key, card.value),
            }}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* 2. ORDERS OVER TIME (Volume) */}
        {/* Requirement: Line chart showing volume of orders per day/month */}
        <div className="col-span-12 md:col-span-12">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-md mb-3 font-medium">Orders Volume Over Time</h3>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold"></h3>
                <h3 className="text-md font-[400] text-gray-400">{/* Last 90 Days <span className="ml-1 text-green-500">+12.5%</span> */}</h3>
              </div>
            </CardHeader>
            <ViewsOverTime
              height={350}
              data={(analyticsRaw?.data?.ordersOverTime || []).map((item: any) => ({
                month: item.month,
                views: item.value,
              }))}
            />
          </Card>
        </div>
      </div>

      {/* --------------- SECOND LAYER --------------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* 3. REVENUE OVER TIME */}
        {/* Requirement: Time-series tracking revenue trends (Gross vs Net) */}
        <div className="col-span-12 md:col-span-7">
          <Card className="dark:bg-secondary h-full shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Revenue Trends</h3>

                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#5585ec]" />
                    <h1 className="text-sm">Total Revenue</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-sm">Net Income</h1>
                  </div>
                </div>
              </div>
            </CardHeader>

            <RevenueTrendsChart
              chartData={(analyticsRaw?.data?.revenueOverTime || []).map((item: any) => ({
                month: item.month,
                total: item.totalRevenue,
                net: item.netIncome,
              }))}
              chartConfig={{
                total: { label: 'Total Revenue', color: '#5585ec' },
                net: { label: 'Net Income', color: '#2563EB' },
              }}
            />
          </Card>
        </div>

        {/* 4. CATEGORY SALES BREAKDOWN */}
        {/* Requirement: Pie/Donut chart showing % of sales by category */}
        <div className="col-span-12 md:col-span-5">
          <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold">Category Sales Breakdown</h3>

                <div className="flex flex-col items-end space-y-1">
                  {(() => {
                    const categories = analyticsRaw?.data?.orderedCategories || [];
                    const deduped = categories.reduce((acc: any[], t: any) => {
                      const existing = acc.find((c) => c.categoryName === t.categoryName);
                      if (existing) {
                        existing.count += t.count;
                        existing.percent += t.percent;
                      } else {
                        acc.push({ ...t });
                      }
                      return acc;
                    }, []);
                    deduped.sort((a: any, b: any) => b.count - a.count);
                    return deduped.slice(0, 5).map((t: any, idx: number) => (
                      <div className="flex items-center" key={`${t.categoryName}-${idx}`}>
                        <div
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: ['#2563EB', '#202C88', '#7DAEF4', '#5585ec', '#A0C4FF'][idx % 5] }}
                        />
                        <h1 className={`text-[13px] ${idx > 0 ? 'text-[#7DAEF4]' : ''}`}>
                          {t.categoryName} <span className="font-semibold">({t.percent.toFixed(1)}%)</span>
                        </h1>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={(() => {
                const categories = analyticsRaw?.data?.orderedCategories || [];
                // Deduplicate by categoryName, sum counts
                const deduped = categories.reduce((acc: any[], t: any) => {
                  const existing = acc.find((c) => c.categoryName === t.categoryName);
                  if (existing) {
                    existing.count += t.count;
                    existing.percent += t.percent;
                  } else {
                    acc.push({ ...t });
                  }
                  return acc;
                }, []);
                // Sort by count descending
                deduped.sort((a: any, b: any) => b.count - a.count);
                const top5 = deduped.slice(0, 5);
                const rest = deduped.slice(5);
                const chartData = top5.map((t: any) => ({
                  name: t.categoryName,
                  value: t.count,
                }));
                if (rest.length > 0) {
                  const totalOther = rest.reduce((sum: number, t: any) => sum + t.count, 0);
                  chartData.push({ name: 'Other', value: totalOther });
                }
                return chartData;
              })()}
              COLORS={['#2563EB', '#202C88', '#7DAEF4', '#5585ec', '#A0C4FF', '#94A3B8']}
            />
          </Card>
        </div>

        {/* 6. LOYALTY IMPACT GRAPH (NEW REQUIREMENT - Repurposing Progress Bars) */}
        {/* Requirement: Difference in order frequency and spending between loyalty and non-loyalty */}
        <div className="col-span-12 md:col-span-12">
          <div className="flex h-full flex-col gap-3">
            <Card className="dark:bg-secondary h-full w-full shadow-md">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Loyalty Impact Graph</h3>
                </div>
              </CardHeader>

              <div className="flex-1">
                {/* Order Frequency Comparison */}
                <div className="mx-4 mt-2 flex items-start justify-between gap-4">
                  <h4 className="text-md mb-2 font-medium">Order Frequency (Loyalty)</h4>
                  <h4 className="text-md mb-2 font-medium">{loyaltyOrderFrequency}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${loyaltyOrderFrequency}%` }}></div>
                  </div>
                  <h4 className="text-muted-foreground mb-4 text-sm font-medium">
                    Represents share of high-frequency orders (75% from loyalty users)
                  </h4>
                </div>

                {/* Average Spend Comparison */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Average Spend (Loyalty vs Non-Loyalty)</h4>
                  <h4 className="text-md mb-2 font-medium">+{loyaltyAvgSpend}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${loyaltyAvgSpend}%` }}></div>
                  </div>
                  <h4 className="text-muted-foreground mb-4 text-sm font-medium">Loyalty users spend an average of 60% more per order</h4>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 5. PEAK ORDERING HOURS */}
        {/* Requirement: Histogram displaying when users place most orders */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary w-full shadow-md">
            <CardHeader>
              <div className="flex items-center justify-start">
                <h3 className="text-xl font-semibold">Peak Ordering Hours</h3>
              </div>
            </CardHeader>
            <div className="flex-1">
              <VisitorAge
                data={(analyticsRaw?.data?.orderByHour || []).map((item: any) => ({
                  ageGroup: item.time,
                  visitors: item.count,
                }))}
              />
            </div>
          </Card>
        </div>

        {/* 6. PROMOTIONAL vs REGULAR vs UPSELL */}
        {/* Requirement: Comparison of revenue/volume between standard and promo/upsell */}
        <div className="col-span-12 md:col-span-6">
          <div className="flex h-full flex-col gap-3">
            <Card className="dark:bg-secondary h-full w-full shadow-md">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Sales Source Breakdown</h3>
                </div>
              </CardHeader>

              <div className="flex-1 pb-4">
                {(analyticsRaw?.data?.salesSourceBreakDown || []).map((item: any) => (
                  <div key={item.reservationType} className="mb-2">
                    <div className="mx-4 mt-2 flex items-start justify-between gap-4">
                      <h4 className="text-md mb-2 font-medium">{item.reservationType}</h4>
                      <h4 className="text-md mb-2 font-medium">{item.percent}%</h4>
                    </div>
                    <div className="mx-4 flex flex-1 flex-col">
                      <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${item.percent}%` }} />
                      </div>
                      <h4 className="text-md mb-2 font-medium">{item.count} Orders</h4>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 4. AVERAGE ORDER VALUE OVER TIME (NEW REQUIREMENT - Repurposing ViewsOverTime) */}
        {/* Requirement: Tracks changes in average spend per order */}
        <div className="col-span-12 md:col-span-12">
          <Card className="dark:bg-secondary col-span-12 shadow-md">
            <CardHeader>
              <h3 className="text-md mb-3 font-medium">Average Order Value (AOV) Over Time</h3>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">€15.90</h3>
                <h3 className="text-md font-[400] text-gray-400">{/* Last 30 Days <span className="ml-1 text-red-500">-1.5%</span> */}</h3>
              </div>
            </CardHeader>
            <ViewsOverTime
              height={350}
              data={(analyticsRaw?.data?.averageOrderValueOverTime || []).map((item: any) => ({
                month: item.month,
                views: item.value,
              }))}
            />
          </Card>
        </div>
      </div>

      {/* List Analytics Section */}
      <div className="mt-5 grid grid-cols-1 md:gap-4">
        {/* 1. Transaction List */}
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">Order Transaction List</h3>
            </div>
          </CardHeader>
          <CardContent>
            <OrderTransactionList  userType={userType}  /> {/* <-- Using the new component */}
          </CardContent>
        </Card>

        {/* 2. Menu Item Performance Table */}
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">Menu Item Performance</h3>
            </div>
          </CardHeader>
          <CardContent>
            <MenuItemPerformanceTable  userType={userType} />
          </CardContent>
        </Card>

        {/* 3. Active Promotions List */}
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">Active Promotions List</h3>
            </div>
          </CardHeader>
          <CardContent>
            <ActivePromotionsList userType={userType} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-white">
          <DialogContent>
            <DialogTitle>Create Program </DialogTitle>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Organizer Name" className="z-10 rounded-md p-2 shadow-md" />
              <input type="email" placeholder="Email" className="z-10 rounded-md p-2 shadow-md" />
              <input type="tel" placeholder="Phone Number" className="z-10 rounded-md p-2 shadow-md" />
              <input type="text" placeholder="Address" className="z-10 rounded-md p-2 shadow-md" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={openModal.onFalse} variant={'outline'} className="mr-2 cursor-pointer">
                Cancel
              </Button>
              <Button onClick={openModal.onFalse} className="cursor-pointer">
                add Program
              </Button>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </>
  );
};

export default OrderAnalyticsView;
