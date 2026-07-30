'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, QrCode, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { DELIVERY_OPTION_STATUS_CONFIG, DELIVERY_OPTION_TYPE_CONFIG } from './constants';
import { DeliveryOption } from './types';

interface DeliveryOptionRowProps {
  item: DeliveryOption;
  handleEdit?: (option: DeliveryOption) => void;
  handleGenerateQrCode?: (option: DeliveryOption) => void;
  handleDelete?: (option: DeliveryOption) => void;
  disabled?: boolean;
}

const DeliveryOptionRow: FC<DeliveryOptionRowProps> = ({ item, handleEdit, handleGenerateQrCode, handleDelete, disabled = false }) => {
  const typeConfig = DELIVERY_OPTION_TYPE_CONFIG[item.type];
  const statusConfig = DELIVERY_OPTION_STATUS_CONFIG[item.status];

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left">{item?.name || '-'}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={typeConfig.variant} className="normal-case">
          {typeConfig.label}
        </CustomBadge>
      </TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={statusConfig.variant}>{statusConfig.label}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Edit Delivery Option"
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Generate QR Code"
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateQrCode?.(item);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <QrCode className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Delete Delivery Option"
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item);
            }}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DeliveryOptionRow;
