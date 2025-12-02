import { Trash2 } from 'lucide-react';
import { MenuItemData, ReservationData, TicketData } from './bundle-modal.types';
import { getItemName, getItemPrice } from './helpers';
import React, { useState } from 'react';

type BundleItemsListProps = {
  items: any[];
  type: 'ticket' | 'reservation' | 'preorder';
  data: TicketData[] | ReservationData[] | MenuItemData[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
};

const BundleItemsList = ({ items, type, data, onRemove, onUpdateQuantity }: BundleItemsListProps) => {
  // Track local input state for each item
  const [inputValues, setInputValues] = useState<string[]>(() => items.map((item) => (item.quantity > 0 ? String(item.quantity) : '')));

  React.useEffect(() => {
    setInputValues(items.map((item) => (item.quantity > 0 ? String(item.quantity) : '')));
  }, [items]);
  const getIdFromItem = (item: any) => {
    if (type === 'ticket') return item.ticketId;
    if (type === 'reservation') return item.reservationId;
    return item.menuItemId;
  };

  const getCapacity = (id: string) => {
    if (type === 'reservation') {
      return (data as ReservationData[]).find((r) => r._id === id)?.maxCapacityPerReservation;
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {items.map((item: any, index: number) => {
        const itemId = getIdFromItem(item);
        const capacity = getCapacity(itemId);

        return (
          <div
            key={index}
            className="rounded-lg border-2 border-gray-200 bg-white p-4 transition hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {getItemName(itemId, type, data as any, data as any, data as any)}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  €{getItemPrice(itemId, type, data as any, data as any, data as any)} per{' '}
                  {type === 'ticket' ? 'ticket' : type === 'reservation' ? 'reservation' : 'item'}
                  {capacity && ` • Max ${capacity} guests`}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Qty:</label>
                  <input
                    type="number"
                    value={inputValues[index] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInputValues((prev) => {
                        const next = [...prev];
                        next[index] = val;
                        return next;
                      });
                      if (/^\d+$/.test(val) && val !== '') {
                        onUpdateQuantity(index, parseInt(val, 10));
                      }
                    }}
                    placeholder="Qty"
                    min="1"
                    className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    title={`${type} quantity`}
                    aria-label={`${type} quantity`}
                  />
                </div>
                <div className="min-w-20 text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Subtotal</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    €{getItemPrice(itemId, type, data as any, data as any, data as any) * item.quantity}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label={`Remove ${type}`}
                  title={`Remove ${type}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BundleItemsList;
