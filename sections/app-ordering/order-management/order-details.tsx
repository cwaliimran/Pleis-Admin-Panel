import { FC, MouseEvent } from 'react';
import { Order } from './types';

interface Props {
  order: Order;
  onAccept?: () => void;
  onDelivered?: () => void;
  onPaid?: () => void;
  onCancel?: () => void;
  stopPropagation: (e: MouseEvent) => void;
}

export const OrderDetails: FC<Props> = ({ order, onAccept, onDelivered, onPaid, onCancel, stopPropagation }) => {
  return (
    <div className="mt-3 border-t border-gray-200 pt-4">
      {/* Contact */}
      <section className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase">Contact Info</p>
        <p className="text-sm">
          {order.contact.handle} • {order.contact.email}
        </p>
      </section>

      {/* Items */}
      <section className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase">Order Items</p>
        <ul className="space-y-2">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between border-b border-gray-100 py-1 last:border-0">
              <span>
                <span className="font-bold text-blue-600">{it.quantity}×</span> <span className="font-medium">{it.name}</span>
              </span>
              <span className="text-gray-600">${it.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Notes */}
      {order.notes && (
        <section className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Special Instructions</p>
          <p className="rounded-lg bg-gray-50 p-3 text-sm italic">{order.notes}</p>
        </section>
      )}

      {/* Total */}
      <section className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase">Order Total</p>
        <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
      </section>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        {order.status === 'sent' && (
          <>
            <button
              onClick={(e) => {
                stopPropagation(e);
                onAccept?.();
              }}
              className="rounded-xl bg-blue-600 py-3 font-bold text-white active:bg-blue-800"
            >
              Accept
            </button>
            <button
              onClick={(e) => {
                stopPropagation(e);
                onCancel?.();
              }}
              className="rounded-xl bg-red-600 py-3 font-bold text-white active:bg-red-800"
            >
              Decline
            </button>
          </>
        )}

        {(order.status === 'preparing' || order.status === 'waiting-payment') && (
          <>
            <button
              onClick={(e) => {
                stopPropagation(e);
                onDelivered?.();
              }}
              className="rounded-xl bg-green-600 py-3 font-bold text-white active:bg-green-800"
            >
              Delivered
            </button>
            <button
              onClick={(e) => {
                stopPropagation(e);
                onCancel?.();
              }}
              className="rounded-xl bg-red-600 py-3 font-bold text-white active:bg-red-800"
            >
              Cancel
            </button>
          </>
        )}

        {order.status === 'waiting-payment' && (
          <button
            onClick={(e) => {
              stopPropagation(e);
              onPaid?.();
            }}
            className="col-span-2 rounded-xl bg-green-600 py-3 font-bold text-white active:bg-green-800"
          >
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
};
