import { FC, MouseEvent } from 'react';
import { Order } from './types';
import { OrderDetails } from './order-details';

interface Props {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onAccept?: () => void;
  onDelivered?: () => void;
  onPaid?: () => void;
  onCancel?: () => void;
}

export const OrderCard: FC<Props> = ({ order, expanded, onToggle, onAccept, onDelivered, onPaid, onCancel }) => {
  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <article onClick={onToggle} className="transform cursor-pointer rounded-xl bg-white p-4 shadow-sm transition active:scale-98">
      {/* Header */}
      <header className="mb-3 flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span>{order.deliveryIcon}</span>
            <span>{order.deliveryLabel}</span>
          </div>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-500">{order.summary}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${order.status === 'preparing' && 'bg-orange-100 text-orange-800'} ${order.status === 'sent' && 'bg-yellow-100 text-yellow-800'} ${order.status === 'waiting-payment' && 'bg-blue-100 text-blue-800'} ${order.status === 'paid' && 'bg-gray-200 text-gray-700'} ${order.status === 'canceled' && 'bg-red-100 text-red-800'} `}
          >
            {order.status.replace('-', ' ')}
          </span>

          {order.isVip && (
            <span className="rounded bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-0.5 text-xs font-bold text-gray-900">Star VIP</span>
          )}
          {order.isPreorder && <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">Preorder</span>}
        </div>
      </header>

      {/* Expanded Details */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1200px]' : 'max-h-0'}`}>
        <OrderDetails order={order} onAccept={onAccept} onDelivered={onDelivered} onPaid={onPaid} onCancel={onCancel} stopPropagation={stop} />
      </div>
    </article>
  );
};
