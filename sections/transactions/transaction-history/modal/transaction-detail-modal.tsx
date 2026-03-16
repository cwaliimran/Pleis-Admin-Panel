'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useGetTransactionsByIdQuery } from '@/store/Reducer/loyalty-transactions-api';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import MenuOrdersDetail from './menu-orders-detail';
import { CompanyOrganizerCard, getOrderTypeLabel, OrganizationInfoCard, TransactionSummaryHeader, UserInfoCard } from './shared-components';
import TicketingBookingsDetail from './ticketing-bookings-detail';
import TicketTransferDetail from './ticket-transfer-detail';
import { TransactionDetail } from './types';
import UserReservationsDetail from './user-reservations-detail';

interface TransactionDetailModalProps {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
  isAdmin?: boolean;
}

const TransactionDetailModal: FC<TransactionDetailModalProps> = ({ open, onClose, transactionId, isAdmin = false }) => {
  const { data, isLoading, isFetching, isError } = useGetTransactionsByIdQuery({ id: transactionId!, isAdmin }, { skip: !transactionId || !open });

  //   const transaction = data as TransactionDetail | undefined;
  const transaction = !isLoading && !isFetching ? (data as TransactionDetail | undefined) : undefined;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-[700px]!"
        >
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>{transaction ? `${getOrderTypeLabel(transaction.orderType)} – Details` : 'Transaction Details'}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 py-4">
            {/* Loading */}
            {(isLoading || isFetching) && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading transaction details...</p>
              </div>
            )}

            {/* Error */}
            {isError && !isLoading && !isFetching && (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm text-red-500">Failed to load transaction details. Please try again.</p>
              </div>
            )}

            {/* Content */}
            {transaction && !isLoading && (
              <div className="space-y-3">
                {/* Summary Header */}
                <TransactionSummaryHeader data={transaction} />

                {/* Common: User, Organization, Organizer */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {transaction.user && <UserInfoCard user={transaction.user} />}
                  {transaction.organization && <OrganizationInfoCard organization={transaction.organization} />}
                </div>

                {transaction.companyOrganizer && <CompanyOrganizerCard organizer={transaction.companyOrganizer} />}

                {/* Type-Specific Detail */}
                <OrderTypeDetail transaction={transaction} />
              </div>
            )}
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

// ─── Type Router ────────────────────────────────────────────────

const OrderTypeDetail: FC<{ transaction: TransactionDetail }> = ({ transaction }) => {
  switch (transaction.orderType) {
    case 'menuorders':
      return <MenuOrdersDetail orderData={transaction.orderData} />;
    case 'userreservations':
      return <UserReservationsDetail orderData={transaction.orderData} />;
    case 'tickettransfer':
      return <TicketTransferDetail orderData={transaction.orderData} />;
    case 'ticketingbookings':
      return <TicketingBookingsDetail orderData={transaction.orderData} />;
    default:
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">Unknown transaction type</p>
        </div>
      );
  }
};

export default TransactionDetailModal;
