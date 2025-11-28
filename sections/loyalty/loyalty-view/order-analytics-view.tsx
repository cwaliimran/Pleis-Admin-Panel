'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { GenderDonutChart, ViewsOverTime, VisitorAge } from '@/sections/invoices';
import ReservationStatsCard from '@/sections/invoices/ReservationCard';
import { orderAnalyticsData } from '@/sections/loyalty/data';
import ReservationList from '../ReservationTransactionList';
import StaffConfirmationsLog from '../StaffConfirmation';
import RevenueTrendsChart from '@/sections/invoices/revenueTrendsChart';
import OrderTransactionList from './order-listing/OrderTransactionList';
import MenuItemPerformanceTable from './order-listing/MenuItemPerformanceTable';
import ActivePromotionsList from './order-listing/ActivePromotionsList';

const OrderAnalyticsView = ({ userType }: { global: boolean; userType: string }) => {
  const openModal = useBoolean();
  console.log('userType', userType);

  const activePercent = 75;
  const inactivePercent = 25;
  const thirdPercent = 40;

  // Data for Progress Bars (Sales Source Breakdown)
  const regularSalesPercent = 65;
  const promoSalesPercent = 25;
  const upsellPercent = 10;

  const loyaltyOrderFrequency = 75; // 75% of high frequency orders are from loyalty
  const nonLoyaltyOrderFrequency = 25;
  const loyaltyAvgSpend = 60; // Loyalty users spend 60% more than non-loyalty
  const nonLoyaltyAvgSpend = 40;

  return (
    <>
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {orderAnalyticsData?.map((card: any, index) => (
          <ReservationStatsCard key={index} item={card} />
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
                <h3 className="text-xl font-bold">15,450 Orders</h3>
                <h3 className="text-md font-[400] text-gray-400">
                  Last 90 Days <span className="ml-1 text-green-500">+12.5%</span>
                </h3>
              </div>
            </CardHeader>
            <ViewsOverTime
              height={350}
              data={[
                { month: 'Jan', views: 1200 },
                { month: 'Feb', views: 1350 },
                { month: 'Mar', views: 1100 },
                { month: 'Apr', views: 1600 },
                { month: 'May', views: 2100 },
                { month: 'Jun', views: 2400 },
                { month: 'Jul', views: 2800 },
                { month: 'Aug', views: 3100 },
                { month: 'Sep', views: 2900 },
                { month: 'Oct', views: 3400 },
                { month: 'Nov', views: 3800 },
                { month: 'Dec', views: 4200 },
              ]}
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
              chartData={[
                { month: 'Jan', total: 12000, net: 10500 },
                { month: 'Feb', total: 14000, net: 12200 },
                { month: 'Mar', total: 11500, net: 9800 },
                { month: 'Apr', total: 16500, net: 14500 },
                { month: 'May', total: 19000, net: 16800 },
                { month: 'Jun', total: 22000, net: 19500 },
              ]}
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
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-[13px]">
                      Drinks <span className="font-semibold">(50%)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Food <span className="font-semibold">(30%)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Merch <span className="font-semibold">(20%)</span>
                    </h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={[
                { name: 'Drinks', value: 500 },
                { name: 'Food', value: 300 },
                { name: 'Merch', value: 200 },
              ]}
              COLORS={['#2563EB', '#202C88', '#7DAEF4']}
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
          <Card className="dark:bg-secondary h-[450px] w-full shadow-md">
            <CardHeader>
              <div className="flex items-center justify-start">
                <h3 className="text-xl font-semibold">Peak Ordering Hours</h3>
              </div>
            </CardHeader>
            <div className="flex-1">
              <VisitorAge
                data={[
                  { ageGroup: '12-2 PM', visitors: 45 },
                  { ageGroup: '2-4 PM', visitors: 30 },
                  { ageGroup: '4-6 PM', visitors: 120 },
                  { ageGroup: '6-8 PM', visitors: 350 },
                  { ageGroup: '8-10 PM', visitors: 410 },
                  { ageGroup: '10-12 PM', visitors: 280 },
                  { ageGroup: '12-2 AM', visitors: 140 },
                ]}
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

              <div className="flex-1">
                {/* Regular Sales */}
                <div className="mx-4 mt-2 flex items-start justify-between gap-4">
                  <h4 className="text-md mb-2 font-medium">Regular Menu Orders</h4>
                  <h4 className="text-md mb-2 font-medium">{regularSalesPercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${regularSalesPercent}%` }}></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">8,450 Orders</h4>
                </div>

                {/* Promotional Sales */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Promotional / Limited Time</h4>
                  <h4 className="text-md mb-2 font-medium">{promoSalesPercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${promoSalesPercent}%` }}></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">3,250 Orders</h4>
                </div>

                {/* Upsell Conversion */}
                {/* Requirement: How often users added upsell items */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Upsell Conversions</h4>
                  <h4 className="text-md mb-2 font-medium">{upsellPercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${upsellPercent}%` }}></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">1,300 Orders</h4>
                </div>
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
                <h3 className="text-md font-[400] text-gray-400">
                  Last 30 Days <span className="ml-1 text-red-500">-1.5%</span>
                </h3>
              </div>
            </CardHeader>
            <ViewsOverTime // Using ViewsOverTime structure for single-line time series
              height={350}
              data={[
                { month: 'Jan', views: 14.5 },
                { month: 'Feb', views: 15.2 },
                { month: 'Mar', views: 15.0 },
                { month: 'Apr', views: 16.1 },
                { month: 'May', views: 15.8 },
                { month: 'Jun', views: 15.9 },
              ]}
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
            <OrderTransactionList /> {/* <-- Using the new component */}
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
            <MenuItemPerformanceTable />
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
            <ActivePromotionsList />
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
