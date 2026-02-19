import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetLoyaltyClubsListQuery, useLinkLoyaltyClubMutation } from '@/store/Reducer/loyalty-club-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import ClubsView from '../clubs/clubs-view';
import SearchedResultsCard from './searched-results-card';
import { Props } from './types';

const LinkedClubs = ({ selectedCompanyId }: Props) => {
  console.log('selectedCompanyId', selectedCompanyId);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [linkingId, setLinkingId] = useState<string | null>(null);

  const [linkLoyaltyClub, { isLoading: isLinking }] = useLinkLoyaltyClubMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchKeyword]);

  const shouldFetch = !!debouncedKeyword;

  const {
    data: companyList,
    isLoading,
    isFetching,
  } = useGetLoyaltyClubsListQuery(
    shouldFetch
      ? {
          search: debouncedKeyword,
          page: 0,
          limit: 10000,
          companyOrganizer: selectedCompanyId || undefined,
        }
      : skipToken
  );

  const handleSendRequest = async (companyId: string) => {
    if (!selectedCompanyId) {
      showError('Sender (your company) is not selected.');
      return;
    }
    if (!companyId) {
      showError('Receiver (target club) is not specified.');
      return;
    }
    if (selectedCompanyId === companyId) {
      showError('You cannot link your own club.');
      return;
    }

    setLinkingId(companyId);

    try {
      const payload = {
        sender: selectedCompanyId,
        receiver: companyId,
      };

      const response = await linkLoyaltyClub(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Loyalty club linked successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLinkingId(null); // reset loading
    }
  };

  return (
    <>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Link Loyalty clubs</h2>

        <div className="mb-3 max-w-full">
          <Label htmlFor="searchClub" className="mb-2 block">
            Search Loyalty Clubs
          </Label>

          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              id="searchClub"
              type="text"
              placeholder="Enter club name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="mt-2 h-12 flex-1 border border-gray-300 bg-white text-[15px]! text-gray-900 placeholder:text-[15px]! placeholder:text-gray-500 dark:border-gray-700 dark:bg-[#171717] dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchKeyword && (
          <div className="mb-6">
            <SearchedResultsCard
              results={companyList || []}
              isLoading={isLoading}
              isFetching={isFetching}
              isLinking={isLinking}
              linkingId={linkingId}
              selectedCompanyId={selectedCompanyId ?? null}
              onSendRequest={handleSendRequest}
            />
          </div>
        )}

        <ClubsView title="Currently Linked Clubs" type="accepted" />
        <ClubsView title="Incoming Requests" type="pending" />
      </div>
    </>
  );
};

export default LinkedClubs;
