import React, { useRef, useEffect } from 'react';
import { Order } from './types';
import { STATUS_CONFIG, DELIVERY_TYPE_CONFIG, PAYMENT_STATUS_CONFIG, ORDER_TYPE_CONFIG } from './constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onAccept: (order: Order) => void;
  onDeliver: (order: Order) => void;
  onDeliverAll: (order: Order) => void;
  onDeliverSelected: (order: Order) => void;
  onMarkPaid: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isExpanded,
  onToggle,
  onAccept,
  onDeliver,
  onDeliverAll,
  onDeliverSelected,
  onMarkPaid,
  onCancel,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const deliveryConfig = DELIVERY_TYPE_CONFIG[order.deliveryType];
  const statusConfig = STATUS_CONFIG[order.status];
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const orderTypeConfig = ORDER_TYPE_CONFIG[order.orderType];

  // Disable cancel if payment is already done
  const canCancel = order.paymentStatus !== 'paid';

  // Handle click outside to close expanded card (only if no modal is open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if any modal/dialog is currently open
      const isModalOpen = document.querySelector('[role="dialog"]') !== null;

      if (isExpanded && !isModalOpen && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, onToggle]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Check if there are undelivered items
  const hasUndeliveredItems = order.items.some((item) => !item.isDelivered);

  return (
    <div
      ref={cardRef}
      className={cn(
        'dark:bg-secondary relative cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all select-none hover:shadow-md active:scale-[0.98]',
        isExpanded && 'z-10'
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <span className="text-xl">{deliveryConfig.icon}</span>
            <span>{order.location}</span>
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">{order.userName}</div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            {order.items.length} items • ${order.totalCost.toFixed(2)}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {order.orderNumber && <div className="font-mono text-xs text-gray-500 dark:text-gray-500">#{order.orderNumber}</div>}
            {/* Payment Method */}
            <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
              <span className="text-xs font-medium text-gray-600 capitalize dark:text-gray-400">
                {order.paymentMethod === 'applePay' ? 'Apple Pay' : order.paymentMethod === 'googlePay' ? 'Google Pay' : order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {/* Show status badge only if not preorder status (to avoid duplicate with orderType) */}
          {order.status !== 'preorder' && (
            <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>
              {statusConfig.label}
            </span>
          )}
          {/* Always show order type badge */}
          <span className={cn('rounded-md px-2.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm', orderTypeConfig.className)}>
            {orderTypeConfig.label}
          </span>
        </div>
      </div>

      {/* Expanded Details - Using absolute positioning when expanded to prevent affecting grid */}
      {isExpanded && (
        <div
          className="dark:bg-secondary absolute top-full right-0 left-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-[#2e2e2e]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            {/* Contact Info */}
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Contact Info</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">{order.userEmail}</div>
            </div>

            {/* Order Items */}
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Items</div>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
                    <span className="text-sm">
                      <span
                        className={cn('mr-2 font-bold', item.isDelivered ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400')}
                      >
                        {item.quantity}×
                      </span>
                      <span
                        className={cn(
                          'font-semibold',
                          item.isDelivered ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                        )}
                      >
                        {item.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      {item.isDelivered && (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Delivered
                        </span>
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Information */}
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Payment Information</div>
              <div className="grid grid-cols-2 gap-3">
                {/* Payment Method */}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Method</div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', paymentStatusConfig.className)}
                    >
                      {order.paymentStatus === 'paid' && '✓'}
                      {order.paymentStatus === 'pending' && '⏳'}
                      {order.paymentStatus === 'failed' && '✗'}
                      <span className="capitalize">{paymentStatusConfig.label}</span>
                    </span>
                  </div>
                </div>

                {/* Transaction ID */}
                {order.transactionId && (
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</div>
                    <div className="font-mono text-xs text-gray-900 dark:text-gray-100">{order.transactionId}</div>
                  </div>
                )}

                {/* Paid At */}
                {order.paidAt && (
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Paid At</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.paidAt).toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Total</div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${order.totalCost.toFixed(2)}</div>
            </div>

            {/* Notes */}
            {order.notes && order.notes.trim() !== '' && (
              <div>
                <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Notes</div>
                <div className="rounded-lg bg-yellow-50 p-3 text-sm text-gray-900 dark:bg-yellow-900/20 dark:text-gray-100">{order.notes}</div>
              </div>
            )}

            {/* Action Buttons */}
            {order.status !== 'cancelled' && order.status !== 'preorder' && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {/* Pending Status - Show Accept/Decline */}
                {order.status === 'pending' && (
                  <>
                    <Button
                      onClick={(e) => handleAction(e, () => onAccept(order))}
                      className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      ✓ Accept
                    </Button>
                    <Button
                      onClick={(e) => handleAction(e, () => onCancel(order))}
                      variant="destructive"
                      className="h-12 font-bold transition-transform active:scale-95"
                      disabled={!canCancel}
                    >
                      ✗ Decline
                    </Button>
                  </>
                )}

                {/* Confirmed Status - Show Delivered/Cancel */}
                {order.status === 'confirmed' && (
                  <>
                    <Button
                      onClick={(e) => handleAction(e, () => onDeliver(order))}
                      className="h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                      ✓ Delivered
                    </Button>
                    <Button
                      onClick={(e) => handleAction(e, () => onCancel(order))}
                      variant="destructive"
                      className="h-12 font-bold transition-transform active:scale-95"
                      disabled={!canCancel}
                    >
                      ✗ Cancel
                    </Button>
                  </>
                )}

                {/* Completed Status - Show Mark as Paid if not paid yet */}
                {order.status === 'completed' && order.paymentStatus !== 'paid' && (
                  <>
                    {/* Show delivery item buttons only if there are undelivered items */}
                    {hasUndeliveredItems && (
                      <>
                        <Button
                          onClick={(e) => handleAction(e, () => onDeliverSelected(order))}
                          className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          ✓ Mark Items
                        </Button>
                        <Button
                          onClick={(e) => handleAction(e, () => onDeliverAll(order))}
                          className="h-12 bg-orange-600 font-bold text-white transition-transform hover:bg-orange-700 active:scale-95 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                          ✓ Mark All
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={(e) => handleAction(e, () => onMarkPaid(order))}
                      className={cn(
                        'h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600',
                        hasUndeliveredItems ? 'col-span-2' : 'col-span-2'
                      )}
                    >
                      ✓ Mark as Paid
                    </Button>
                  </>
                )}

                {/* Completed Status - Paid - Show delivery buttons if there are undelivered items */}
                {order.status === 'completed' && order.paymentStatus === 'paid' && (
                  <>
                    {hasUndeliveredItems ? (
                      <>
                        <Button
                          onClick={(e) => handleAction(e, () => onDeliverSelected(order))}
                          className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          ✓ Mark Items
                        </Button>
                        <Button
                          onClick={(e) => handleAction(e, () => onDeliverAll(order))}
                          className="h-12 bg-orange-600 font-bold text-white transition-transform hover:bg-orange-700 active:scale-95 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                          ✓ Mark All
                        </Button>
                      </>
                    ) : (
                      <div className="col-span-2 rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Order Completed & Paid</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Preorder Status - Show Accept button */}
            {order.status === 'preorder' && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={(e) => handleAction(e, () => onAccept(order))}
                  className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  ✓ Accept Preorder
                </Button>
                <Button
                  onClick={(e) => handleAction(e, () => onCancel(order))}
                  variant="destructive"
                  className="h-12 font-bold transition-transform active:scale-95"
                  disabled={!canCancel}
                >
                  ✗ Cancel
                </Button>
              </div>
            )}

            {/* Cancelled Status - Show info (not a button, just info) */}
            {order.status === 'cancelled' && (
              <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">✗ Order Cancelled</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// import React, { useRef, useEffect } from 'react';
// import { Order } from './types';
// import { STATUS_CONFIG, DELIVERY_TYPE_CONFIG, PAYMENT_STATUS_CONFIG, ORDER_TYPE_CONFIG } from './constants';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';

// interface OrderCardProps {
//   order: Order;
//   isExpanded: boolean;
//   onToggle: () => void;
//   onAccept: (order: Order) => void;
//   onDeliver: (order: Order) => void;
//   onDeliverAll: (order: Order) => void;
//   onDeliverSelected: (order: Order) => void;
//   onMarkPaid: (order: Order) => void;
//   onCancel: (order: Order) => void;
// }

// export const OrderCard: React.FC<OrderCardProps> = ({
//   order,
//   isExpanded,
//   onToggle,
//   onAccept,
//   onDeliver,
//   onDeliverAll,
//   onDeliverSelected,
//   onMarkPaid,
//   onCancel,
// }) => {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const deliveryConfig = DELIVERY_TYPE_CONFIG[order.deliveryType];
//   const statusConfig = STATUS_CONFIG[order.status];
//   const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
//   const orderTypeConfig = ORDER_TYPE_CONFIG[order.orderType];

//   // Disable cancel if payment is already done
//   const canCancel = order.paymentStatus !== 'paid';

//   // Handle click outside to close expanded card
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (isExpanded && cardRef.current && !cardRef.current.contains(event.target as Node)) {
//         onToggle();
//       }
//     };

//     if (isExpanded) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isExpanded, onToggle]);

//   const handleAction = (e: React.MouseEvent, action: () => void) => {
//     e.stopPropagation();
//     action();
//   };

//   // Check if there are undelivered items
//   const hasUndeliveredItems = order.items.some((item) => !item.isDelivered);

//   return (
//     <div
//       ref={cardRef}
//       className={cn(
//         'dark:bg-secondary relative cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all select-none hover:shadow-md active:scale-[0.98]',
//         isExpanded && 'z-10'
//       )}
//       onClick={onToggle}
//     >
//       {/* Header */}
//       <div className="mb-3 flex items-start justify-between">
//         <div className="flex-1">
//           <div className="mb-1 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
//             <span className="text-xl">{deliveryConfig.icon}</span>
//             <span>{order.location}</span>
//           </div>
//           <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">{order.userName}</div>
//           <div className="text-sm text-gray-500 dark:text-gray-500">
//             {order.items.length} items • ${order.totalCost.toFixed(2)}
//           </div>
//           <div className="mt-1 flex items-center gap-2">
//             {order.orderNumber && <div className="font-mono text-xs text-gray-500 dark:text-gray-500">#{order.orderNumber}</div>}
//             {/* Payment Method */}
//             <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
//               <span className="text-xs font-medium text-gray-600 capitalize dark:text-gray-400">
//                 {order.paymentMethod === 'applePay' ? 'Apple Pay' : order.paymentMethod === 'googlePay' ? 'Google Pay' : order.paymentMethod}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col items-end gap-1.5">
//           {/* Show status badge only if not preorder status (to avoid duplicate with orderType) */}
//           {order.status !== 'preorder' && (
//             <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>
//               {statusConfig.label}
//             </span>
//           )}
//           {/* Always show order type badge */}
//           <span className={cn('rounded-md px-2.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm', orderTypeConfig.className)}>
//             {orderTypeConfig.label}
//           </span>
//         </div>
//       </div>

//       {/* Expanded Details - Using absolute positioning when expanded to prevent affecting grid */}
//       {isExpanded && (
//         <div
//           className="dark:bg-secondary absolute top-full right-0 left-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-[#2e2e2e]"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="space-y-4">
//             {/* Contact Info */}
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Contact Info</div>
//               <div className="text-sm text-gray-900 dark:text-gray-100">{order.userEmail}</div>
//             </div>

//             {/* Order Items */}
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Items</div>
//               <ul className="space-y-2">
//                 {order.items.map((item) => (
//                   <li key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
//                     <span className="text-sm">
//                       <span
//                         className={cn('mr-2 font-bold', item.isDelivered ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400')}
//                       >
//                         {item.quantity}×
//                       </span>
//                       <span
//                         className={cn(
//                           'font-semibold',
//                           item.isDelivered ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
//                         )}
//                       >
//                         {item.name}
//                       </span>
//                     </span>
//                     <div className="flex items-center gap-2">
//                       {item.isDelivered && (
//                         <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                           Delivered
//                         </span>
//                       )}
//                       <span className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Payment Information */}
//             <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
//               <div className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Payment Information</div>
//               <div className="grid grid-cols-2 gap-3">
//                 {/* Payment Method */}
//                 <div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">Method</div>
//                   <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
//                     <span className="capitalize">{order.paymentMethod}</span>
//                   </div>
//                 </div>

//                 {/* Payment Status */}
//                 <div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
//                   <div className="flex items-center gap-1.5">
//                     <span
//                       className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', paymentStatusConfig.className)}
//                     >
//                       {order.paymentStatus === 'paid' && '✓'}
//                       {order.paymentStatus === 'pending' && '⏳'}
//                       {order.paymentStatus === 'failed' && '✗'}
//                       <span className="capitalize">{paymentStatusConfig.label}</span>
//                     </span>
//                   </div>
//                 </div>

//                 {/* Transaction ID */}
//                 {order.transactionId && (
//                   <div className="col-span-2">
//                     <div className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</div>
//                     <div className="font-mono text-xs text-gray-900 dark:text-gray-100">{order.transactionId}</div>
//                   </div>
//                 )}

//                 {/* Paid At */}
//                 {order.paidAt && (
//                   <div className="col-span-2">
//                     <div className="text-xs text-gray-500 dark:text-gray-400">Paid At</div>
//                     <div className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.paidAt).toLocaleString()}</div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Order Total */}
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Total</div>
//               <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${order.totalCost.toFixed(2)}</div>
//             </div>

//             {/* Notes */}
//             {order.notes && order.notes.trim() !== '' && (
//               <div>
//                 <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Notes</div>
//                 <div className="rounded-lg bg-yellow-50 p-3 text-sm text-gray-900 dark:bg-yellow-900/20 dark:text-gray-100">{order.notes}</div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             {order.status !== 'cancelled' && order.status !== 'preorder' && (
//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 {/* Pending Status - Show Accept/Decline */}
//                 {order.status === 'pending' && (
//                   <>
//                     <Button
//                       onClick={(e) => handleAction(e, () => onAccept(order))}
//                       className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
//                     >
//                       ✓ Accept
//                     </Button>
//                     <Button
//                       onClick={(e) => handleAction(e, () => onCancel(order))}
//                       variant="destructive"
//                       className="h-12 font-bold transition-transform active:scale-95"
//                       disabled={!canCancel}
//                     >
//                       ✗ Decline
//                     </Button>
//                   </>
//                 )}

//                 {/* Confirmed Status - Show Delivered/Cancel */}
//                 {order.status === 'confirmed' && (
//                   <>
//                     <Button
//                       onClick={(e) => handleAction(e, () => onDeliver(order))}
//                       className="h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
//                     >
//                       ✓ Delivered
//                     </Button>
//                     <Button
//                       onClick={(e) => handleAction(e, () => onCancel(order))}
//                       variant="destructive"
//                       className="h-12 font-bold transition-transform active:scale-95"
//                       disabled={!canCancel}
//                     >
//                       ✗ Cancel
//                     </Button>
//                   </>
//                 )}

//                 {/* Completed Status - Show Mark as Paid if not paid yet */}
//                 {order.status === 'completed' && order.paymentStatus !== 'paid' && (
//                   <>
//                     {/* Show delivery item buttons only if there are undelivered items */}
//                     {hasUndeliveredItems && (
//                       <>
//                         <Button
//                           onClick={(e) => handleAction(e, () => onDeliverSelected(order))}
//                           className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
//                         >
//                           ✓ Mark Items
//                         </Button>
//                         <Button
//                           onClick={(e) => handleAction(e, () => onDeliverAll(order))}
//                           className="h-12 bg-orange-600 font-bold text-white transition-transform hover:bg-orange-700 active:scale-95 dark:bg-orange-500 dark:hover:bg-orange-600"
//                         >
//                           ✓ Mark All
//                         </Button>
//                       </>
//                     )}
//                     <Button
//                       onClick={(e) => handleAction(e, () => onMarkPaid(order))}
//                       className={cn(
//                         'h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600',
//                         hasUndeliveredItems ? 'col-span-2' : 'col-span-2'
//                       )}
//                     >
//                       ✓ Mark as Paid
//                     </Button>
//                   </>
//                 )}

//                 {/* Completed Status - Paid - Show delivery buttons if there are undelivered items */}
//                 {order.status === 'completed' && order.paymentStatus === 'paid' && (
//                   <>
//                     {hasUndeliveredItems ? (
//                       <>
//                         <Button
//                           onClick={(e) => handleAction(e, () => onDeliverSelected(order))}
//                           className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
//                         >
//                           ✓ Mark Items
//                         </Button>
//                         <Button
//                           onClick={(e) => handleAction(e, () => onDeliverAll(order))}
//                           className="h-12 bg-orange-600 font-bold text-white transition-transform hover:bg-orange-700 active:scale-95 dark:bg-orange-500 dark:hover:bg-orange-600"
//                         >
//                           ✓ Mark All
//                         </Button>
//                       </>
//                     ) : (
//                       <div className="col-span-2 rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
//                         <span className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Order Completed & Paid</span>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Preorder Status - Show Accept button */}
//             {order.status === 'preorder' && (
//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 <Button
//                   onClick={(e) => handleAction(e, () => onAccept(order))}
//                   className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
//                 >
//                   ✓ Accept Preorder
//                 </Button>
//                 <Button
//                   onClick={(e) => handleAction(e, () => onCancel(order))}
//                   variant="destructive"
//                   className="h-12 font-bold transition-transform active:scale-95"
//                   disabled={!canCancel}
//                 >
//                   ✗ Cancel
//                 </Button>
//               </div>
//             )}

//             {/* Cancelled Status - Show info (not a button, just info) */}
//             {order.status === 'cancelled' && (
//               <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
//                 <span className="text-sm font-semibold text-red-700 dark:text-red-400">✗ Order Cancelled</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // import React, { useRef, useEffect } from 'react';
// // import { Order } from './types';
// // import { STATUS_CONFIG, DELIVERY_TYPE_CONFIG, PAYMENT_STATUS_CONFIG, ORDER_TYPE_CONFIG } from './constants';
// // import { Button } from '@/components/ui/button';
// // import { cn } from '@/lib/utils';

// // interface OrderCardProps {
// //   order: Order;
// //   isExpanded: boolean;
// //   onToggle: () => void;
// //   onAccept: (order: Order) => void;
// //   onDeliver: (order: Order) => void;
// //   onDeliverAll: (order: Order) => void;
// //   onDeliverSelected: (order: Order) => void;
// //   onMarkPaid: (order: Order) => void;
// //   onCancel: (order: Order) => void;
// // }

// // export const OrderCard: React.FC<OrderCardProps> = ({
// //   order,
// //   isExpanded,
// //   onToggle,
// //   onAccept,
// //   onDeliver,
// //   onDeliverAll,
// //   onDeliverSelected,
// //   onMarkPaid,
// //   onCancel,
// // }) => {
// //   const cardRef = useRef<HTMLDivElement>(null);
// //   const deliveryConfig = DELIVERY_TYPE_CONFIG[order.deliveryType];
// //   const statusConfig = STATUS_CONFIG[order.status];
// //   const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
// //   const orderTypeConfig = ORDER_TYPE_CONFIG[order.orderType];

// //   // Disable cancel if payment is already done
// //   const canCancel = order.paymentStatus !== 'paid';

// //   // Handle click outside to close expanded card
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (isExpanded && cardRef.current && !cardRef.current.contains(event.target as Node)) {
// //         onToggle();
// //       }
// //     };

// //     if (isExpanded) {
// //       document.addEventListener('mousedown', handleClickOutside);
// //     }

// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [isExpanded, onToggle]);

// //   const handleAction = (e: React.MouseEvent, action: () => void) => {
// //     e.stopPropagation();
// //     action();
// //   };

// //   // Check if there are undelivered items
// //   const hasUndeliveredItems = order.items.some((item) => !item.isDelivered);

// //   return (
// //     <div
// //       ref={cardRef}
// //       className={cn(
// //         'dark:bg-secondary relative cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all select-none hover:shadow-md active:scale-[0.98]',
// //         isExpanded && 'z-10'
// //       )}
// //       onClick={onToggle}
// //     >
// //       {/* Header */}
// //       <div className="mb-3 flex items-start justify-between">
// //         <div className="flex-1">
// //           <div className="mb-1 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
// //             <span className="text-xl">{deliveryConfig.icon}</span>
// //             <span>{order.location}</span>
// //           </div>
// //           <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">{order.userName}</div>
// //           <div className="text-sm text-gray-500 dark:text-gray-500">
// //             {order.items.length} items • ${order.totalCost.toFixed(2)}
// //           </div>
// //           <div className="mt-1 flex items-center gap-2">
// //             {order.orderNumber && <div className="font-mono text-xs text-gray-500 dark:text-gray-500">#{order.orderNumber}</div>}
// //             {/* Payment Method */}
// //             <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
// //               <span className="text-xs font-medium text-gray-600 capitalize dark:text-gray-400">
// //                 {order.paymentMethod === 'applePay' ? 'Apple Pay' : order.paymentMethod === 'googlePay' ? 'Google Pay' : order.paymentMethod}
// //               </span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex flex-col items-end gap-1.5">
// //           {/* Show status badge only if not preorder status (to avoid duplicate with orderType) */}
// //           {order.status !== 'preorder' && (
// //             <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>
// //               {statusConfig.label}
// //             </span>
// //           )}
// //           {/* Always show order type badge */}
// //           <span className={cn('rounded-md px-2.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm', orderTypeConfig.className)}>
// //             {orderTypeConfig.label}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Expanded Details - Using absolute positioning when expanded to prevent affecting grid */}
// //       {isExpanded && (
// //         <div
// //           className="dark:bg-secondary absolute top-full right-0 left-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-[#2e2e2e]"
// //           onClick={(e) => e.stopPropagation()}
// //         >
// //           <div className="space-y-4">
// //             {/* Contact Info */}
// //             <div>
// //               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Contact Info</div>
// //               <div className="text-sm text-gray-900 dark:text-gray-100">{order.userEmail}</div>
// //             </div>

// //             {/* Order Items */}
// //             <div>
// //               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Items</div>
// //               <ul className="space-y-2">
// //                 {order.items.map((item) => (
// //                   <li key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
// //                     <span className="text-sm">
// //                       <span
// //                         className={cn('mr-2 font-bold', item.isDelivered ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400')}
// //                       >
// //                         {item.quantity}×
// //                       </span>
// //                       <span
// //                         className={cn(
// //                           'font-semibold',
// //                           item.isDelivered ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
// //                         )}
// //                       >
// //                         {item.name}
// //                       </span>
// //                     </span>
// //                     <div className="flex items-center gap-2">
// //                       {item.isDelivered && (
// //                         <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
// //                           Delivered
// //                         </span>
// //                       )}
// //                       <span className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
// //                     </div>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>

// //             {/* Payment Information */}
// //             <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
// //               <div className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Payment Information</div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 {/* Payment Method */}
// //                 <div>
// //                   <div className="text-xs text-gray-500 dark:text-gray-400">Method</div>
// //                   <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
// //                     <span className="capitalize">{order.paymentMethod}</span>
// //                   </div>
// //                 </div>

// //                 {/* Payment Status */}
// //                 <div>
// //                   <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
// //                   <div className="flex items-center gap-1.5">
// //                     <span
// //                       className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', paymentStatusConfig.className)}
// //                     >
// //                       {order.paymentStatus === 'paid' && '✓'}
// //                       {order.paymentStatus === 'pending' && '⏳'}
// //                       {order.paymentStatus === 'failed' && '✗'}
// //                       <span className="capitalize">{paymentStatusConfig.label}</span>
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {/* Transaction ID */}
// //                 {order.transactionId && (
// //                   <div className="col-span-2">
// //                     <div className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</div>
// //                     <div className="font-mono text-xs text-gray-900 dark:text-gray-100">{order.transactionId}</div>
// //                   </div>
// //                 )}

// //                 {/* Paid At */}
// //                 {order.paidAt && (
// //                   <div className="col-span-2">
// //                     <div className="text-xs text-gray-500 dark:text-gray-400">Paid At</div>
// //                     <div className="text-sm text-gray-900 dark:text-gray-100">{new Date(order.paidAt).toLocaleString()}</div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Order Total */}
// //             <div>
// //               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Total</div>
// //               <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${order.totalCost.toFixed(2)}</div>
// //             </div>

// //             {/* Notes */}
// //             {order.notes && order.notes.trim() !== '' && (
// //               <div>
// //                 <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Notes</div>
// //                 <div className="rounded-lg bg-yellow-50 p-3 text-sm text-gray-900 dark:bg-yellow-900/20 dark:text-gray-100">{order.notes}</div>
// //               </div>
// //             )}

// //             {/* Action Buttons */}
// //             {order.status !== 'cancelled' && order.status !== 'preorder' && (
// //               <div className="grid grid-cols-2 gap-2 pt-2">
// //                 {/* Pending Status - Show Accept/Decline */}
// //                 {order.status === 'pending' && (
// //                   <>
// //                     <Button
// //                       onClick={(e) => handleAction(e, () => onAccept(order))}
// //                       className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
// //                     >
// //                       ✓ Accept
// //                     </Button>
// //                     <Button
// //                       onClick={(e) => handleAction(e, () => onCancel(order))}
// //                       variant="destructive"
// //                       className="h-12 font-bold transition-transform active:scale-95"
// //                       disabled={!canCancel}
// //                     >
// //                       ✗ Decline
// //                     </Button>
// //                   </>
// //                 )}

// //                 {/* Confirmed Status - Show Delivered/Cancel */}
// //                 {order.status === 'confirmed' && (
// //                   <>
// //                     <Button
// //                       onClick={(e) => handleAction(e, () => onDeliver(order))}
// //                       className="h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
// //                     >
// //                       ✓ Delivered
// //                     </Button>
// //                     <Button
// //                       onClick={(e) => handleAction(e, () => onCancel(order))}
// //                       variant="destructive"
// //                       className="h-12 font-bold transition-transform active:scale-95"
// //                       disabled={!canCancel}
// //                     >
// //                       ✗ Cancel
// //                     </Button>
// //                   </>
// //                 )}

// //                 {/* Completed Status - Show Mark as Paid if not paid yet */}
// //                 {order.status === 'completed' && order.paymentStatus !== 'paid' && (
// //                   <>
// //                     {/* Show delivery item buttons only if there are undelivered items */}
// //                     {hasUndeliveredItems && (
// //                       <>
// //                         <Button
// //                           onClick={(e) => handleAction(e, () => onDeliverSelected(order))}
// //                           className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
// //                         >
// //                           ✓ Mark Items
// //                         </Button>
// //                         <Button
// //                           onClick={(e) => handleAction(e, () => onDeliverAll(order))}
// //                           className="h-12 bg-orange-600 font-bold text-white transition-transform hover:bg-orange-700 active:scale-95 dark:bg-orange-500 dark:hover:bg-orange-600"
// //                         >
// //                           ✓ Mark All
// //                         </Button>
// //                       </>
// //                     )}
// //                     <Button
// //                       onClick={(e) => handleAction(e, () => onMarkPaid(order))}
// //                       className={cn(
// //                         'h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600',
// //                         hasUndeliveredItems ? 'col-span-2' : 'col-span-2'
// //                       )}
// //                     >
// //                       ✓ Mark as Paid
// //                     </Button>
// //                   </>
// //                 )}

// //                 {/* Completed Status - Paid - Show info only */}
// //                 {order.status === 'completed' && order.paymentStatus === 'paid' && (
// //                   <div className="col-span-2 rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
// //                     <span className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Order Completed & Paid</span>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Preorder Status - Show Accept button */}
// //             {order.status === 'preorder' && (
// //               <div className="grid grid-cols-2 gap-2 pt-2">
// //                 <Button
// //                   onClick={(e) => handleAction(e, () => onAccept(order))}
// //                   className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
// //                 >
// //                   ✓ Accept Preorder
// //                 </Button>
// //                 <Button
// //                   onClick={(e) => handleAction(e, () => onCancel(order))}
// //                   variant="destructive"
// //                   className="h-12 font-bold transition-transform active:scale-95"
// //                   disabled={!canCancel}
// //                 >
// //                   ✗ Cancel
// //                 </Button>
// //               </div>
// //             )}

// //             {/* Cancelled Status - Show info (not a button, just info) */}
// //             {order.status === 'cancelled' && (
// //               <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
// //                 <span className="text-sm font-semibold text-red-700 dark:text-red-400">✗ Order Cancelled</span>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
