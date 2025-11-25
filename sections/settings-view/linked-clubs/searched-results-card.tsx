'use client';

import { Button } from '@/components/ui/button';
import SearchResultSkelton from './search-result-skelton';
import { CompanyResult } from './types';

type Props = {
  results: CompanyResult[];
  isLinking: boolean;
  isLoading: boolean;
  isFetching: boolean;
  selectedCompanyId: string | null;
  onSendRequest: (companyId: string) => void;
};

const SearchedResultsCard = ({ results, isLoading, isFetching, isLinking, selectedCompanyId, onSendRequest }: Props) => {
  if (isLoading || isFetching) {
    return (
      <div className="mt-2">
        <SearchResultSkelton />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="mt-2 rounded-lg border border-gray-300 bg-white p-4 text-center text-gray-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400">
        No results found
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg bg-[#1a1a1a] p-0">
      {results.map((company) => (
        <div
          key={company?._id}
          className="flex items-center justify-between rounded-md border border-gray-300 bg-white p-4 text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-[#222222] dark:text-gray-100 dark:hover:bg-[#2a2a2a]"
        >
          <div className="flex flex-col">
            <p className="font-semibold">{company?.companyDetails?.loyaltySettings?.title}</p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {company?.companyDetails?.name} • {company?.firstName} {company?.lastName}
            </p>

            <p className="text-xs text-gray-500 capitalize dark:text-gray-500">Model: {company?.companyDetails?.loyaltySettings?.model}</p>
          </div>

          {selectedCompanyId === company._id ? (
            <div className="cursor-not-allowed rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              Your club
            </div>
          ) : company.collaborationStatus === 'accepted' ? (
            <div className="cursor-not-allowed rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
              Linked
            </div>
          ) : company.collaborationStatus === 'pending' ? (
            <div className="cursor-not-allowed rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
              Pending Approval
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => onSendRequest(company?._id)}
              className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 dark:text-white"
            >
              {isLinking ? 'Linking...' : 'Send Request'}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchedResultsCard;
