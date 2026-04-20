'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import LoyaltyTransactionTable from './loyalty-transaction-table';
import TransactionModal from './transactions-modal';
import { useCompanySelection } from '@/app/common/header/company-selection-storage';

interface LoyaltyTransactionViewProps {
  global?: boolean;
  userType?: string;
}

const LoyaltyTransactionView = ({ global, userType }: LoyaltyTransactionViewProps) => {
  const openModal = useBoolean();
  const isSuperAdmin = userType === 'super-admin';

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sourceEntity, setSourceEntity] = useState('');
  const [direction, setDirection] = useState<string>('');
  const [sourceType, setSourceType] = useState<string>('');
  const [startPoints, setStartPoints] = useState<string>('');
  const [endPoints, setEndPoints] = useState<string>('');
  const [startBalance, setStartBalance] = useState<string>('');
  const [endBalance, setEndBalance] = useState<string>('');
  const [campaign, setCampaign] = useState<string>('');
  const [referralOnly, setReferralOnly] = useState(false);
  const [purchaseBasedOnly, setPurchaseBasedOnly] = useState(false);
  const [manualAdjustmentsOnly, setManualAdjustmentsOnly] = useState(false);
  const [streakBasedOnly, setStreakBasedOnly] = useState(false);
  const [challengeBasedOnly, setChallengeBasedOnly] = useState(false);
  const [promotionBasedOnly, setPromotionBasedOnly] = useState(false);
  const [rewardRedemptionOnly, setRewardRedemptionOnly] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { companyId: selectedCompany } = useCompanySelectionState();

  const { organizerOrganizationIds } = useCompanySelection();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetLoyaltyTransactionsQuery({
    page: page - 1,
    search,
    sourceEntity: sourceEntity || undefined,
    limit,
    type:
      manualAdjustmentsOnly
        ? 'adjustment'
        : rewardRedemptionOnly
          ? 'redeem'
          : !direction || direction === 'all'
            ? undefined
            : direction,
    domainType: !sourceType || sourceType === 'all' ? undefined : sourceType,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    startPoints: startPoints || undefined,
    endPoints: endPoints || undefined,
    startBalance: startBalance || undefined,
    endBalance: endBalance || undefined,
    balance: startBalance || undefined,
    campaign: campaign || undefined,
    referral: referralOnly || undefined,
    purchaseBased: purchaseBasedOnly || undefined,
    streakBased: streakBasedOnly || undefined,
    challengeBased: challengeBasedOnly || undefined,
    promotionBased: promotionBasedOnly || undefined,
    companyOrganizer: selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
    isGlobal: global || false,
    walletType: 'companyLoyalty',
  });

  const [localData, setLocalData] = useState<any[]>([]);

  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setLocalData(apiData?.data);
      setMeta(
        apiData.meta || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    }
  }, [apiData, page, limit]);

  const handleEdit = (data: string) => {
    setSelectedRecord(data);
    openModal.onTrue();
  };
  return (
    <div>
      <LoyaltyTransactionTable
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
        handleEdit={handleEdit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        search={search}
        sourceEntity={sourceEntity}
        onSourceEntityChange={(val) => {
          setSourceEntity(val);
          setPage(1);
        }}
        limit={limit}
        page={page}
        direction={direction}
        onDirectionChange={(val) => {
          setDirection(val);
          setSourceType('');
          setPage(1);
        }}
        sourceType={sourceType}
        onSourceTypeChange={(val) => {
          setSourceType(val);
          setPage(1);
        }}
        startPoints={startPoints}
        onStartPointsChange={(val) => {
          setStartPoints(val);
          setPage(1);
        }}
        endPoints={endPoints}
        onEndPointsChange={(val) => {
          setEndPoints(val);
          setPage(1);
        }}
        startBalance={startBalance}
        onStartBalanceChange={(val) => {
          setStartBalance(val);
          setPage(1);
        }}
        endBalance={endBalance}
        onEndBalanceChange={(val) => {
          setEndBalance(val);
          setPage(1);
        }}
        campaign={campaign}
        onCampaignChange={(val) => {
          setCampaign(val);
          setPage(1);
        }}
        referralOnly={referralOnly}
        onReferralOnlyChange={(value) => {
          setReferralOnly(value);
          setPage(1);
        }}
        purchaseBasedOnly={purchaseBasedOnly}
        onPurchaseBasedOnlyChange={(value) => {
          setPurchaseBasedOnly(value);
          setPage(1);
        }}
        manualAdjustmentsOnly={manualAdjustmentsOnly}
        onManualAdjustmentsOnlyChange={(value) => {
          setManualAdjustmentsOnly(value);
          setPage(1);
        }}
        streakBasedOnly={streakBasedOnly}
        onStreakBasedOnlyChange={(value) => {
          setStreakBasedOnly(value);
          setPage(1);
        }}
        challengeBasedOnly={challengeBasedOnly}
        onChallengeBasedOnlyChange={(value) => {
          setChallengeBasedOnly(value);
          setPage(1);
        }}
        promotionBasedOnly={promotionBasedOnly}
        onPromotionBasedOnlyChange={(value) => {
          setPromotionBasedOnly(value);
          setPage(1);
        }}
        rewardRedemptionOnly={rewardRedemptionOnly}
        onRewardRedemptionOnlyChange={(value) => {
          setRewardRedemptionOnly(value);
          setPage(1);
        }}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(newStartDate, newEndDate) => {


          
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}
        onResetFilters={() => {
          setSourceEntity('');
          setDirection('');
          setSourceType('');
          setStartPoints('');
          setEndPoints('');
          setStartBalance('');
          setEndBalance('');
          setCampaign('');
          setReferralOnly(false);
          setPurchaseBasedOnly(false);
          setManualAdjustmentsOnly(false);
          setStreakBasedOnly(false);
          setChallengeBasedOnly(false);
          setPromotionBasedOnly(false);
          setRewardRedemptionOnly(false);
          setStartDate(undefined);
          setEndDate(undefined);
          setSearch('');
          setPage(1);
        }}
        isSuperAdmin={isSuperAdmin}
      />

      <TransactionModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedRecord} />
    </div>
  );
};

export default LoyaltyTransactionView;
