'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import LoyaltyTransactionTable from './loyalty-transaction-table';
import TransactionModal from './transactions-modal';

interface LoyaltyTransactionDashboardWidgetProps {
  global?: boolean;
  userType?: string;
}

const LoyaltyTransactionDashboardWidget = ({ global = false, userType }: LoyaltyTransactionDashboardWidgetProps) => {
  const openModal = useBoolean();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [direction, setDirection] = useState<string>('');
  const [sourceEntity, setSourceEntity] = useState('');
  const [startPoints, setStartPoints] = useState<string>('');
  const [endPoints, setEndPoints] = useState<string>('');
  const [startBalance, setStartBalance] = useState<string>('');
  const [endBalance, setEndBalance] = useState<string>('');
  const [referralOnly, setReferralOnly] = useState(false);
  const [purchaseBasedOnly, setPurchaseBasedOnly] = useState(false);
  const [streakBasedOnly, setStreakBasedOnly] = useState(false);
  const [challengeBasedOnly, setChallengeBasedOnly] = useState(false);
  const [promotionBasedOnly, setPromotionBasedOnly] = useState(false);
  const [sourceType, setSourceType] = useState<string>('');

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
    limit,
    domainType: !sourceType || sourceType === 'all' ? undefined : sourceType,
    type: direction !== "all" && direction || '',
    sourceEntity: sourceEntity || undefined,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    startPoints: startPoints || undefined,
    endPoints: endPoints || undefined,
    endBalance: endBalance || undefined,
    balance: startBalance || undefined,
    referral: referralOnly || undefined,
    purchaseBased: purchaseBasedOnly || undefined,
    streakBased: streakBasedOnly || undefined,
    challengeBased: challengeBasedOnly || undefined,
    promotionBased: promotionBasedOnly || undefined,
    companyOrganizer: global ? undefined : selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
    isGlobal: global,
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
      setLocalData(apiData.data);
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
    <>
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
        limit={limit}
        page={page}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        date={date}
        startDate={startDate}
        endDate={endDate}

        // onDateChange={(val) => {
        //   setDate(val);
        //   setPage(1);
        // }}
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
        sourceEntity={sourceEntity}
        onSourceEntityChange={(val) => {
          setSourceEntity(val);
          setPage(1);
        }}
        onDateChange={(newStartDate?: Date, newEndDate?: Date) => {
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}

        referralOnly={referralOnly}
        onReferralOnlyChange={(value) => {
          setReferralOnly(value);
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
        purchaseBasedOnly={purchaseBasedOnly}
        onPurchaseBasedOnlyChange={(value) => {
          setPurchaseBasedOnly(value);
          setPage(1);
        }}
        startBalance={startBalance}
        onStartBalanceChange={(val) => {
          setStartBalance(val);
          setPage(1);
        }}
        endBalance={endBalance}
        onEndBalanceChange={(endBalance) => {
          setEndBalance(endBalance);
          setPage(1);
        }}
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

        onResetFilters={() => {
          setSourceEntity('');
          setDirection('');
          setStartPoints('');
          setEndPoints('');
          setStartBalance('');
          setEndBalance('');
          setReferralOnly(false);
          setPurchaseBasedOnly(false);
          setStreakBasedOnly(false);
          setChallengeBasedOnly(false);
          setPromotionBasedOnly(false);
          setStartDate(undefined);
          setEndDate(undefined);
          setSearch('');
          setSourceType('');
          setPage(1);
        }}
      />

      <TransactionModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedRecord} />
    </>
  );
};

export default LoyaltyTransactionDashboardWidget;
