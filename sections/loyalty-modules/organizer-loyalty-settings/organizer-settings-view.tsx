'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import { Edit, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import LinkedClubs from './linked-clubs/linked-clubs';
import SettingsModal from './setting-modal';
import { SettingsDisplaySkeleton } from './skelton';

const OrganizerSettingsView = () => {
  const { user } = useAuth();
  const settingsModal = useBoolean();

  const userType = user?.accountState?.userType;
  const selectedCompanyId = userType === 'manager' ? user?.basicInfo?.companyDetails?._id : user?.basicInfo?._id;

  // const selectedCompanyId = user?.basicInfo?._id || '';

  const { data: apiData, isLoading, isFetching, refetch } = useGetUserByIdQuery({ id: selectedCompanyId || '' }, { skip: !selectedCompanyId });
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  // Loyalty enable toggle
  const handleEnableLoyalty = async () => {
    if (!selectedCompanyId) return;
    try {
      await updateUser({
        id: selectedCompanyId,
        body: {
          companyDetails: {
            loyaltySettings: {
              ...loyaltySettings,
              isEnabled: true,
            },
          },
        },
      }).unwrap();
      refetch();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const companyDetails = useMemo(() => {
    if (!apiData?.basicInfo?.companyDetails) return null;
    return apiData.basicInfo.companyDetails;
  }, [apiData]);

  const loyaltySettings = companyDetails?.loyaltySettings;

  // Safe fallback values
  const coverImage = companyDetails?.coverImage || '';
  const logo = companyDetails?.logo || '';
  const title = loyaltySettings?.title || 'Club Name';
  const description = companyDetails?.description || 'No description available';
  const category = companyDetails?.category?.title || '';
  // const category = companyDetails?.category || '';
  const model = loyaltySettings?.model || '';
  const pointValue = loyaltySettings?.pointValuePercentage || 0;

  const modelLabels: Record<string, string> = {
    essential: 'Essential',
    preferred: 'Preferred',
    premier: 'Premier',
  };

  // Check if cover image is valid
  const hasValidCoverImage = coverImage && !coverImage.toLowerCase().includes('noimage');
  const hasValidLogo = logo && !logo.toLowerCase().includes('noimage');

  const handleSuccess = () => {
    refetch();
  };

  return (
    <>
      <div className="space-y-7 p-6 sm:space-y-12">
        {/* Club Information Card */}
        {isLoading || isFetching ? (
          <SettingsDisplaySkeleton />
        ) : !selectedCompanyId ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-[#171717]">
            <p className="text-gray-500 dark:text-gray-400">No data found!</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-[#171717]">
            {/* Cover Image */}
            <div className="relative h-48 w-full overflow-hidden bg-linear-to-r from-blue-500 to-purple-600 sm:h-64">
              {hasValidCoverImage ? (
                <Image width={600} height={600} priority src={coverImage} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-lg text-white/60">No cover image</p>
                </div>
              )}

              {/* Edit and Delete Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                  onClick={settingsModal.onTrue}
                  title="Edit Settings"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative px-6 pb-6">
              {/* Logo */}
              <div className="relative -mt-16 mb-4">
                <div className="inline-block rounded-full border-4 border-white bg-white dark:border-gray-800 dark:bg-gray-800">
                  {hasValidLogo ? (
                    <Image width={300} height={300} src={logo} alt="Logo" className="h-32 w-32 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-sm dark:bg-gray-700">
                      <span className="text-gray-400 dark:text-gray-500">No Logo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Club Title & Category & Loyalty Enable Toggle */}
              <div className="mb-4">
                <div className="mb-2 flex w-full items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

                  {/* Loyalty Enable Toggle */}
                  {loyaltySettings && loyaltySettings.isEnabled === false && (
                    <div className="flex items-center space-x-3 px-4">
                      <label htmlFor="loyalty-enable" className="cursor-pointer text-gray-700 dark:text-white">
                        Enable Loyalty Settings
                      </label>

                      {!updateLoading && (
                        <>
                          <input
                            id="loyalty-enable"
                            type="checkbox"
                            checked={false}
                            onChange={handleEnableLoyalty}
                            className="peer sr-only"
                            disabled={updateLoading}
                          />

                          <div
                            className={`peer relative h-6 w-11 cursor-pointer rounded-full after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${updateLoading ? 'cursor-not-allowed opacity-50' : 'bg-gray-200'}`}
                            onClick={updateLoading ? undefined : handleEnableLoyalty}
                          ></div>
                        </>
                      )}

                      {updateLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin text-gray-500" />}
                    </div>
                  )}
                </div>
                {category && (
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 capitalize dark:bg-blue-900/30 dark:text-blue-300">
                    {category}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{description}</p>

              {/* Stats/Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                  <span className="font-medium text-gray-900 dark:text-white">Model:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{modelLabels[model] || 'Not Set'}</span>
                </div>
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                  <span className="font-medium text-gray-900 dark:text-white">Point Value:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{pointValue}%</span>
                </div>
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                  <span className="font-medium text-gray-900 dark:text-white">0</span> Subscriptions
                </div>
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                  <span className="font-medium text-gray-900 dark:text-white">0%</span> Commission
                </div>
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                  <span className="font-medium text-gray-900 dark:text-white">0</span> Boost
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-sm ${apiData?.basicInfo?.companyDetails?.status === 'active' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {apiData?.basicInfo?.companyDetails?.status === 'active'
                      ? apiData?.basicInfo?.companyDetails?.status?.slice(0, 1)?.toUpperCase() +
                        apiData?.basicInfo?.companyDetails?.status?.slice(1)?.toLowerCase()
                      : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Linked Clubs Section */}
        {selectedCompanyId && <LinkedClubs selectedCompanyId={selectedCompanyId} />}
      </div>

      {/* Settings Modal */}
      {settingsModal.value && selectedCompanyId && (
        <SettingsModal
          open={settingsModal.value}
          onClose={settingsModal.onFalse}
          // user={user}
          selectedCompanyId={selectedCompanyId}
          companyDetails={companyDetails}
          handleSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default OrganizerSettingsView;
