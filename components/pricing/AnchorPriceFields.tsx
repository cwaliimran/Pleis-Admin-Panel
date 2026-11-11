'use client';

import { RHFTextField } from '@/components/rhf';
import { formatAnchorPrice } from '@/utils/anchor-price';
import { useFormContext } from 'react-hook-form';

/**
 * Anchor price + anchor price date (Legal spec section 2). Optional, but always both or
 * neither. Must be used inside the form's FormProvider. Shows a live preview of how the
 * app will display it.
 */
export default function AnchorPriceFields({ disabled = false, className = '' }: { disabled?: boolean; className?: string }) {
  const { watch } = useFormContext();
  const preview = formatAnchorPrice({ anchorPrice: watch('anchorPrice'), anchorPriceDate: watch('anchorPriceDate') });

  return (
    <div className={`grid w-full grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
      <RHFTextField name="anchorPrice" label="Anchor price (€)" type="number" placeholder="Optional, e.g. 20.00" step="0.01" min="0" disabled={disabled} />
      <RHFTextField name="anchorPriceDate" label="Anchor price date" type="date" disabled={disabled} />
      <p className="text-muted-foreground -mt-2 text-xs md:col-span-2">
        Optional. Fill in both or leave both empty — shown in the app below the current price
        {preview ? (
          <>
            : <span className="text-foreground font-medium">{preview}</span>
          </>
        ) : (
          '.'
        )}
      </p>
    </div>
  );
}
