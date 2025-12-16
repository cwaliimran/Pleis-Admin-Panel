import React from 'react';
import { Order } from './types';
import { STATUS_CONFIG } from './constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onAccept: (order: Order) => void;
  onDeliver: (order: Order) => void;
  onMarkPaid: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggle, onAccept, onDeliver, onMarkPaid, onCancel }) => {
  const statusConfig = STATUS_CONFIG[order.status];

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={cn(
        'dark:bg-secondary relative cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all select-none hover:shadow-md active:scale-[0.98]',
        isExpanded && 'z-10'
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">#{order.id}</span>
            {order.isVIP && <span className="text-lg">🥇</span>}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{order.userName}</span>
          </div>
          {order.tierName && <div className="mb-1.5 text-xs text-gray-500 dark:text-gray-500">{order.tierName}</div>}
          <div className="mb-1 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <span>{order.location}</span>
            {order.partySize && (
              <span className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>👥</span>
                <span>
                  {order.partySize} {order.partySize === 1 ? 'guest' : 'guests'}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${order.totalCost.toFixed(2)}</span>
          {order.isPreorder && (
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              New Order
            </span>
          )}
          {!order.isPreorder && order.status === 'sent' && (
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              New Order
            </span>
          )}
          {order.status === 'preparing' && (
            <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>
              {statusConfig.label}
            </span>
          )}
          {order.status === 'waiting-payment' && (
            <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>
              {statusConfig.label}
            </span>
          )}
          {(order.status === 'paid' || order.status === 'canceled') && (
            <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>
              {statusConfig.label}
            </span>
          )}
          <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
        </div>
      </div>

      {/* Divider line */}
      {/* <div className="border-t border-gray-100 dark:border-gray-800" /> */}

      {/* Expanded Details - Using absolute positioning when expanded to prevent affecting grid */}
      {isExpanded && (
        <div className="dark:bg-secondary absolute top-full right-0 left-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-[#2e2e2e]">
          <div className="space-y-4">
            {/* Contact Info */}
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Contact Info</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {order.userHandle} • {order.userEmail}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Items</div>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
                    <span className="text-sm">
                      <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">{item.quantity}×</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Instructions */}
            {order.notes && (
              <div>
                <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Special Instructions</div>
                <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 italic dark:bg-gray-800 dark:text-gray-100">{order.notes}</div>
              </div>
            )}

            {/* Payment Information */}
            {order.paymentInfo && (
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Payment Information</div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Payment Method */}
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Method</div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <span className="capitalize">{order.paymentInfo.method.replace('-', ' ')}</span>
                      {order.paymentInfo.cardLast4 && <span className="text-gray-500">•••• {order.paymentInfo.cardLast4}</span>}
                    </div>
                    {order.paymentInfo.cardBrand && (
                      <div className="mt-0.5 text-xs text-gray-500 capitalize dark:text-gray-400">{order.paymentInfo.cardBrand}</div>
                    )}
                  </div>

                  {/* Payment Status */}
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
                          order.paymentInfo.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                          order.paymentInfo.status === 'pending' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                          order.paymentInfo.status === 'processing' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                          order.paymentInfo.status === 'failed' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                          order.paymentInfo.status === 'refunded' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        )}
                      >
                        {order.paymentInfo.status === 'completed' && '✓'}
                        {order.paymentInfo.status === 'pending' && '⏳'}
                        {order.paymentInfo.status === 'processing' && '⟳'}
                        {order.paymentInfo.status === 'failed' && '✗'}
                        {order.paymentInfo.status === 'refunded' && '↩'}
                        <span className="capitalize">{order.paymentInfo.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  {order.paymentInfo.transactionId && (
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</div>
                      <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{order.paymentInfo.transactionId}</div>
                    </div>
                  )}

                  {/* Paid At */}
                  {order.paymentInfo.paidAt && (
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Paid At</div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{order.paymentInfo.paidAt}</div>
                    </div>
                  )}

                  {/* Refund Info */}
                  {order.paymentInfo.status === 'refunded' && (
                    <>
                      {order.paymentInfo.refundedAt && (
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Refunded At</div>
                          <div className="text-sm text-gray-900 dark:text-gray-100">{order.paymentInfo.refundedAt}</div>
                        </div>
                      )}
                      {order.paymentInfo.refundAmount !== undefined && (
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Refund Amount</div>
                          <div className="text-sm font-medium text-purple-600 dark:text-purple-400">${order.paymentInfo.refundAmount.toFixed(2)}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Legacy Payment Type (for backward compatibility) */}
            {order.paymentType && !order.paymentInfo && (
              <div>
                <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Payment Type</div>
                <div className="text-sm text-gray-900 dark:text-gray-100">💳 Pay Later</div>
              </div>
            )}

            {/* Order Total */}
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Total</div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${order.totalCost.toFixed(2)}</div>
            </div>

            {/* Completed/Canceled Time */}
            {order.completedAt && (
              <div>
                <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">
                  {order.status === 'canceled' ? 'Canceled At' : 'Completed At'}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">{order.completedAt}</div>
              </div>
            )}

            {/* Preorder Status */}
            {order.isPreorder && order.status === 'pending' && (
              <div>
                <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Status</div>
                <div className="text-sm text-gray-900 dark:text-gray-100">⏳ Waiting for check-in</div>
              </div>
            )}

            {/* Action Buttons */}
            {order.status !== 'paid' && order.status !== 'canceled' && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {order.status === 'sent' && (
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
                    >
                      ✗ Decline
                    </Button>
                  </>
                )}

                {order.status === 'preparing' && (
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
                    >
                      ✗ Cancel
                    </Button>
                  </>
                )}

                {order.status === 'waiting-payment' && (
                  <Button
                    onClick={(e) => handleAction(e, () => onMarkPaid(order))}
                    className="col-span-2 h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    ✓ Mark as Paid
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import React from 'react';
// import { DELIVERY_TYPE_CONFIG, STATUS_CONFIG } from './constants';
// import { Order } from './types';

// interface OrderCardProps {
//   order: Order;
//   isExpanded: boolean;
//   onToggle: () => void;
//   onAccept: (order: Order) => void;
//   onDeliver: (order: Order) => void;
//   onMarkPaid: (order: Order) => void;
//   onCancel: (order: Order) => void;
// }

// export const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggle, onAccept, onDeliver, onMarkPaid, onCancel }) => {
//   const deliveryConfig = DELIVERY_TYPE_CONFIG[order.deliveryType];
//   const statusConfig = STATUS_CONFIG[order.status];

//   const handleAction = (e: React.MouseEvent, action: () => void) => {
//     e.stopPropagation();
//     action();
//   };

//   return (
//     <div
//       className="dark:bg-secondary cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all select-none hover:shadow-md active:scale-[0.98]"
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
//         </div>

//         <div className="flex flex-col items-end gap-1.5">
//           <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase', statusConfig.className)}>{statusConfig.label}</span>
//           {order.isVIP && (
//             <span className="rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 px-2.5 py-1 text-xs font-bold tracking-wide text-gray-900 uppercase shadow-sm">
//               ⭐ VIP
//             </span>
//           )}
//           {order.isPreorder && (
//             <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase dark:bg-blue-500">Preorder</span>
//           )}
//         </div>
//       </div>

//       {/* Expanded Details */}
//       <div className={cn('overflow-hidden transition-all duration-300', isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0')}>
//         <div className="mt-3 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-800">
//           {/* Contact Info */}
//           <div>
//             <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Contact Info</div>
//             <div className="text-sm text-gray-900 dark:text-gray-100">
//               {order.userHandle} • {order.userEmail}
//             </div>
//           </div>

//           {/* Order Items */}
//           <div>
//             <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Items</div>
//             <ul className="space-y-2">
//               {order.items.map((item) => (
//                 <li key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
//                   <span className="text-sm">
//                     <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">{item.quantity}×</span>
//                     <span className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
//                   </span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Special Instructions */}
//           {order.notes && (
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Special Instructions</div>
//               <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 italic dark:bg-gray-800 dark:text-gray-100">{order.notes}</div>
//             </div>
//           )}

//           {/* Payment Type */}
//           {order.paymentType && (
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Payment Type</div>
//               <div className="text-sm text-gray-900 dark:text-gray-100">💳 Pay Later</div>
//             </div>
//           )}

//           {/* Order Total */}
//           <div>
//             <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Order Total</div>
//             <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${order.totalCost.toFixed(2)}</div>
//           </div>

//           {/* Completed/Canceled Time */}
//           {order.completedAt && (
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">
//                 {order.status === 'canceled' ? 'Canceled At' : 'Completed At'}
//               </div>
//               <div className="text-sm text-gray-900 dark:text-gray-100">{order.completedAt}</div>
//             </div>
//           )}

//           {/* Preorder Status */}
//           {order.isPreorder && order.status === 'pending' && (
//             <div>
//               <div className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Status</div>
//               <div className="text-sm text-gray-900 dark:text-gray-100">⏳ Waiting for check-in</div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           {order.status !== 'paid' && order.status !== 'canceled' && (
//             <div className="grid grid-cols-2 gap-2 pt-2">
//               {order.status === 'sent' && (
//                 <>
//                   <Button
//                     onClick={(e) => handleAction(e, () => onAccept(order))}
//                     className="h-12 bg-blue-600 font-bold text-white transition-transform hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
//                   >
//                     ✓ Accept
//                   </Button>
//                   <Button
//                     onClick={(e) => handleAction(e, () => onCancel(order))}
//                     variant="destructive"
//                     className="h-12 font-bold transition-transform active:scale-95"
//                   >
//                     ✗ Decline
//                   </Button>
//                 </>
//               )}

//               {order.status === 'preparing' && (
//                 <>
//                   <Button
//                     onClick={(e) => handleAction(e, () => onDeliver(order))}
//                     className="h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
//                   >
//                     ✓ Delivered
//                   </Button>
//                   <Button
//                     onClick={(e) => handleAction(e, () => onCancel(order))}
//                     variant="destructive"
//                     className="h-12 font-bold transition-transform active:scale-95"
//                   >
//                     ✗ Cancel
//                   </Button>
//                 </>
//               )}

//               {order.status === 'waiting-payment' && (
//                 <Button
//                   onClick={(e) => handleAction(e, () => onMarkPaid(order))}
//                   className="col-span-2 h-12 bg-green-600 font-bold text-white transition-transform hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
//                 >
//                   ✓ Mark as Paid
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
