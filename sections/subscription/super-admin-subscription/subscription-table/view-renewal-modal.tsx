'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { fDate, formatStr } from '@/utils/format-time';

type ViewRenewalModalProps = {
  open: boolean;
  onClose: () => void;
  selectedData?: any;
};

const ViewRenewalModal = ({ open, onClose, selectedData }: ViewRenewalModalProps) => {
  const inactiveSubscription = selectedData?.inactiveSubscription;

  if (!inactiveSubscription) return null;

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-700">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-y-auto md:max-w-[600px]!"
        >
          <DialogHeader>
            <DialogTitle>Next Renewal Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full space-y-6">
            {/* Header Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Organizer</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                    {selectedData?.firstName} {selectedData?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                    {inactiveSubscription?.startDate ? fDate(inactiveSubscription.startDate, formatStr.paramCase.date) : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Subscription Modules</h3>
              <div className="flex flex-wrap gap-2">
                {inactiveSubscription?.subscriptionTypes?.map((type: string, index: number) => (
                  <span
                    key={`${type}-${index}`}
                    className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Subscription Details */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Subscription Details</h3>

              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="px-4 py-2">
                  <InfoRow
                    label="Pricing Plan"
                    value={
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                          inactiveSubscription?.pricingPlan === 'yearly'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {inactiveSubscription?.pricingPlan || '-'}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Status"
                    value={
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                          inactiveSubscription?.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {inactiveSubscription?.status || '-'}
                      </span>
                    }
                  />
                  <InfoRow label="Organizations" value={inactiveSubscription?.numberOfOrganizations || '-'} />
                  <InfoRow
                    label="Total Amount"
                    value={
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {inactiveSubscription?.totalSubscriptionAmount ? `€${inactiveSubscription.totalSubscriptionAmount}` : '-'}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Commission Rates */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Commission Rates</h3>
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="px-4 py-2">
                  <InfoRow
                    label="Ordering Commission"
                    value={inactiveSubscription?.orderingCommission !== undefined ? `${inactiveSubscription.orderingCommission}%` : '-'}
                  />
                  <InfoRow
                    label="Ticketing Commission"
                    value={inactiveSubscription?.ticketingCommission !== undefined ? `${inactiveSubscription.ticketingCommission}%` : '-'}
                  />
                  <InfoRow
                    label="Reservation Commission"
                    value={inactiveSubscription?.reservationCommission !== undefined ? `${inactiveSubscription.reservationCommission}%` : '-'}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer px-6">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ViewRenewalModal;
