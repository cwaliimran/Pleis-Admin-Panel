'use client';

import { fDate } from '@/utils/format-time';
import { ChefHat, Package, Receipt, Tag } from 'lucide-react';
import { FC } from 'react';
import { InfoRow, PriceBreakdown, Section } from './shared-components';
import { MenuOrderData, MenuOrderItem } from './types';

// ─── Single Menu Item Row ───────────────────────────────────────

const MenuItemRow: FC<{ item: MenuOrderItem }> = ({ item }) => {
  const snap = item.menuItemSnapShot;
  const hasSale = !!snap?.sale;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
      {snap?.image ? (
        <img src={snap.image} alt={snap.title} className="h-14 w-14 rounded-lg border object-cover" />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
          <ChefHat className="h-5 w-5 text-gray-400" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{snap?.title || 'Unknown Item'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {snap?.type} {snap?.category?.title ? `• ${snap.category.title}` : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">€{item.finalPrice?.toFixed(2)}</p>
            <p className="text-xs text-gray-400">x{item.quantity}</p>
          </div>
        </div>

        {hasSale && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Tag className="h-3 w-3 text-red-500" />
            <span className="text-xs text-red-500">
              {snap.sale!.title} ({snap.saleDiscountType === 'fixed' ? `€${snap.saleDiscountValue}` : `${snap.saleDiscountValue}%`} off)
            </span>
            <span className="text-xs text-gray-400 line-through">€{snap.basePrice?.toFixed(2)}</span>
          </div>
        )}

        {item.isdelivered && (
          <span className="mt-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Delivered
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Menu Orders Detail ─────────────────────────────────────────

const MenuOrdersDetail: FC<{ orderData: MenuOrderData; userTier?: string }> = ({ orderData, userTier }) => {
  if (!orderData) return null;

  const breakdown = orderData.priceBreakdown;
  const priceItems = [
    { label: 'Items Subtotal', value: breakdown?.itemsTotal || 0 },
    ...(breakdown?.saleDiscount ? [{ label: 'Sale Discount', value: breakdown.saleDiscount, isDiscount: true }] : []),
    ...(breakdown?.promoDiscount ? [{ label: 'Promo Discount', value: breakdown.promoDiscount, isDiscount: true }] : []),
    ...(breakdown?.tax ? [{ label: 'Tax', value: breakdown.tax }] : []),
    { label: 'Total', value: breakdown?.finalTotal || 0, isBold: true },
  ];

  return (
    <div className="space-y-3">
      {/* Order Info */}
      <Section title="Order Details" icon={<Package className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-0.5">
          <InfoRow label="Order Number" value={orderData.orderNumber} />
          <InfoRow label="Status" value={<span className="capitalize">{orderData.status}</span>} />
          <InfoRow label="Order Type" value={<span className="capitalize">{orderData.orderType}</span>} />
          <InfoRow label="Pickup Type" value={<span className="capitalize">{orderData.pickupType}</span>} />
          <InfoRow label="Tier Status" value={userTier ? <span className="capitalize">{userTier}</span> : undefined} />
          <InfoRow label="Payment Method" value={<span className="capitalize">{orderData.paymentMethod}</span>} />
          <InfoRow label="Paid At" value={orderData.paidAt ? fDate(orderData.paidAt, 'DD/MM/YYYY HH:mm') : undefined} />
          {orderData.notes && <InfoRow label="Notes" value={orderData.notes} />}
        </div>
      </Section>

      {/* Menu Items */}
      <Section title={`Items (${orderData.items?.length || 0})`} icon={<ChefHat className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-2">
          {orderData.items?.map((item) => (
            <MenuItemRow key={item._id} item={item} />
          ))}
        </div>
      </Section>

      {/* Price Breakdown */}
      <Section title="Price Breakdown" icon={<Receipt className="h-4 w-4 text-gray-500" />}>
        <PriceBreakdown items={priceItems} />
        {breakdown?.promoCode && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
            <Tag className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Promo: {breakdown.promoCode}</span>
          </div>
        )}
      </Section>
    </div>
  );
};

export default MenuOrdersDetail;
