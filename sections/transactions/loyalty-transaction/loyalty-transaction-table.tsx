'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useTableSort } from '@/hooks/useTableSort';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import LoyaltyTransactionTableRow from './loyalty-transaction-table-row';
import { SamplePageProps } from './types';

const HEAD_LABEL = [
  { id: 'organization', label: 'Organization', align: 'left', sortable: true, sortKey: 'organization.basicInfo.name' },
  { id: 'user', label: 'User', align: 'left', sortable: true, sortKey: 'user.firstName' },
  { id: 'transactionId', label: 'Transaction ID', align: 'left' },
  { id: 'transactionType', label: 'Transaction Type', align: 'left' },
  { id: 'points', label: 'Points', align: 'left' },
  { id: 'reference', label: 'Reference', align: 'left' },
  { id: 'timestamp', label: 'Timestamp', align: 'left', sortable: true, sortKey: 'createdAt' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'left' },
];

const LoyaltyTransactionTable: FC<SamplePageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  limit = 10,
  // filters states bellow
  search = '',
  onSearch = () => {},
  sourceEntity = '',
  onSourceEntityChange = () => {},
  direction = '',
  onDirectionChange = () => {},
  sourceType = '',
  onSourceTypeChange = () => {},
  startPoints = '',
  onStartPointsChange = () => {},
  endPoints = '',
  onEndPointsChange = () => {},
  startBalance = '',
  onStartBalanceChange = () => {},
  endBalance = '',
  onEndBalanceChange = () => {},
  campaign = '',
  onCampaignChange = () => {},
  referralOnly = false,
  onReferralOnlyChange = () => {},
  purchaseBasedOnly = false,
  onPurchaseBasedOnlyChange = () => {},
  manualAdjustmentsOnly = false,
  onManualAdjustmentsOnlyChange = () => {},
  streakBasedOnly = false,
  onStreakBasedOnlyChange = () => {},
  challengeBasedOnly = false,
  onChallengeBasedOnlyChange = () => {},
  promotionBasedOnly = false,
  onPromotionBasedOnlyChange = () => {},
  rewardRedemptionOnly = false,
  onRewardRedemptionOnlyChange = () => {},
  startDate,
  endDate,
  onDateChange = () => {},
  onResetFilters = () => {},
  isSuperAdmin = false,
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

  const { sortedData, sortConfig, handleSort } = useTableSort({
    data: data || [],
  });

  const methods = useForm({
    defaultValues: {
      location: sheetLocation,
    },
  });

  const earnSourceTypeOptions = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'streak', label: 'Streak' },
    { value: 'referral', label: 'Referral' },
    ...(isSuperAdmin ? [{ value: 'manualAdjustment', label: 'Manual Adjustment' }] : []),
  ];

  const spendSourceTypeOptions = [
    { value: 'redeemReward', label: 'Redeem Reward' },
    { value: 'redeemPromotion', label: 'Redeem Promotion' },
    ...(isSuperAdmin ? [{ value: 'manualDeduction', label: 'Manual Deduction' }] : []),
    { value: 'expiration', label: 'Expiration' },
  ];

  const sourceTypeOptions =
    direction === 'earn'
      ? earnSourceTypeOptions
      : direction === 'redeem'
        ? spendSourceTypeOptions
        : [...earnSourceTypeOptions, ...spendSourceTypeOptions];

  const isSourceTypeDisabled = direction !== 'earn' && direction !== 'redeem';

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Loyalty Transaction List</h3>

            {/* FILTER SHEET */}
            <Sheet>
              <SheetTrigger asChild>
                <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
                  <Settings2 className="h-5 w-5" />
                  <span className="whitespace-nowrap">Filter</span>
                </Badge>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary p-0">
                <SheetHeader className="mb-2 border-b pb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FormProvider {...methods}>
                  <form className="flex flex-col gap-6 px-4 py-2">
                    {/* Date Range Filters full width */}
                    <div className="flex w-full flex-col gap-3">
                      <div className="flex w-full flex-col gap-3">
                        <label htmlFor="sheet-event-start-date" className="px-1 text-sm font-medium">
                          Select Date
                        </label>
                        <div className="w-full">
                          <TableFilters
                            className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                            dateRangeFilter={{
                              startDate: {
                                id: 'start-date',
                                placeholder: 'Select start date',
                                value: startDate,
                                onChange: (newStartDate) => onDateChange(newStartDate, endDate),
                              },
                              endDate: {
                                id: 'end-date',
                                placeholder: 'Select end date',
                                value: endDate,
                                onChange: (newEndDate) => onDateChange(startDate, newEndDate),
                              },
                            }}
                            searchFilter={{
                              placeholder: 'Search...',
                              value: search,
                              onChange: onSearch,
                            }}
                            selectFilters={[
                              {
                                id: 'sheet-direction',
                                label: 'Direction',
                                placeholder: 'Select Direction',
                                value: direction,
                                onChange: onDirectionChange,
                                options: [
                                  { value: 'all', label: 'All' },
                                  { value: 'earn', label: 'Earn' },
                                  { value: 'redeem', label: 'Spend' },
                                ],
                              },
                              {
                                id: 'sheet-source-type',
                                label: 'Source Type',
                                placeholder: 'Select Source Type',
                                value: sourceType,
                                onChange: onSourceTypeChange,
                                disabled: isSourceTypeDisabled,
                                disabledHint: 'Select Direction (Earn or Spend) to enable Source Type.',
                                options: [{ value: 'all', label: 'All' }, ...sourceTypeOptions],
                              },
                            ]}
                            filtersAlignment="left"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="-mt-4 flex w-full flex-col gap-2">
                      <Input
                        type="text"
                        placeholder="Source Entity (challenge/reward/promotion)"
                        value={sourceEntity}
                        onChange={(e) => onSourceEntityChange(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>

                    <div className="-mt-4 flex w-full flex-col gap-2">
                      <Label className="text-sm font-medium">Points Changed Range</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={startPoints}
                          onChange={(e) => onStartPointsChange(e.target.value)}
                          className="h-10 w-full"
                        />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={endPoints}
                          onChange={(e) => onEndPointsChange(e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="-mt-4 flex w-full flex-col gap-2">
                      <Label className="text-sm font-medium">Balance After Range</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={startBalance}
                          onChange={(e) => onStartBalanceChange(e.target.value)}
                          className="h-10 w-full"
                        />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={endBalance}
                          onChange={(e) => onEndBalanceChange(e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="-mt-2 flex w-full flex-col gap-3">
                      <Label className="text-sm font-medium">Specific Filters</Label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={referralOnly} onCheckedChange={(checked) => onReferralOnlyChange(Boolean(checked))} />
                        <span>Referral Only</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={purchaseBasedOnly} onCheckedChange={(checked) => onPurchaseBasedOnlyChange(Boolean(checked))} />
                        <span>Purchase-based Points</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={streakBasedOnly} onCheckedChange={(checked) => onStreakBasedOnlyChange(Boolean(checked))} />
                        <span>Streak-based Earnings</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={challengeBasedOnly} onCheckedChange={(checked) => onChallengeBasedOnlyChange(Boolean(checked))} />
                        <span>Challenge-based</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={promotionBasedOnly} onCheckedChange={(checked) => onPromotionBasedOnlyChange(Boolean(checked))} />
                        <span>Promotion-based</span>
                      </label>
                    </div>

                    {(search || sourceEntity || direction || sourceType || startPoints || endPoints || startBalance || endBalance || referralOnly || purchaseBasedOnly || streakBasedOnly || challengeBasedOnly || promotionBasedOnly || startDate || endDate) && (
                      <button
                        className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
                        type="button"
                        onClick={onResetFilters}
                      >
                        Reset
                      </button>
                    )}
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={HEAD_LABEL} onSort={handleSort} sortConfig={sortConfig} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={sortedData?.length || 0}>
                {sortedData?.map((item, idx) => (
                  <LoyaltyTransactionTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
                ))}
              </TableBodyWrapper>
            </Table>
          </div>

          <PaginationControls
            limit={limit}
            totalPages={totalPages}
            currentPage={currentPage}
            totalRecords={totalRecords}
            onPageChange={(p) => onPageChange?.(p)}
          />
        </Card>
      </div>
    </div>
  );
};

export default LoyaltyTransactionTable;
