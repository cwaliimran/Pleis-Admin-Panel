// Anchor price (PLEIS Legal spec section 2 — legal requirement from 1 October).
// Optional organizer-entered reference price + its date on menu items, tickets and
// reservations. Both or neither. Shown as "20,00 € (10.09.2026.)".
import * as Yup from 'yup';

export interface AnchorPriceSource {
  anchorPrice?: number | string | null;
  anchorPriceDate?: string | Date | null;
}

/** API date (UTC midnight ISO) → value for <input type="date"> ("YYYY-MM-DD"). */
export const toDateInputValue = (d?: string | Date | null): string => {
  if (!d) return '';
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

/** Form values for edit mode. */
export const anchorPriceFormValues = (src?: AnchorPriceSource | null) => ({
  anchorPrice: src?.anchorPrice != null && src.anchorPrice !== '' ? String(src.anchorPrice) : '',
  anchorPriceDate: toDateInputValue(src?.anchorPriceDate),
});

/** API payload: both values, or both null to clear. */
export const anchorPricePayload = (values: { anchorPrice?: string | number | null; anchorPriceDate?: string | null }) => {
  const hasPrice = values.anchorPrice !== undefined && values.anchorPrice !== null && String(values.anchorPrice).trim() !== '';
  const hasDate = !!values.anchorPriceDate;
  return {
    anchorPrice: hasPrice ? Number(values.anchorPrice) : null,
    anchorPriceDate: hasDate ? values.anchorPriceDate : null,
  };
};

/** Display format required by the spec: "20,00 € (10.09.2026.)" — empty when incomplete. */
export const formatAnchorPrice = (src?: AnchorPriceSource | null): string => {
  if (!src || src.anchorPrice == null || src.anchorPrice === '' || !src.anchorPriceDate) return '';
  const n = Number(src.anchorPrice);
  const d = new Date(src.anchorPriceDate);
  if (!Number.isFinite(n) || Number.isNaN(d.getTime())) return '';
  const price = n.toFixed(2).replace('.', ',');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${price} € (${dd}.${mm}.${d.getUTCFullYear()}.)`;
};

/** Yup rules: optional, ≥ 0, and never one without the other. */
export const anchorPriceSchema = {
  anchorPrice: Yup.string()
    .nullable()
    .optional()
    .test('anchor-number', 'Enter a valid amount (0 or more)', (v) => !v || (Number.isFinite(Number(v)) && Number(v) >= 0))
    .test('anchor-pair', 'Anchor price is required when an anchor price date is set', function (v) {
      return !!(v && String(v).trim()) || !this.parent.anchorPriceDate;
    }),
  anchorPriceDate: Yup.string()
    .nullable()
    .optional()
    .test('anchor-date-pair', 'Anchor price date is required when an anchor price is set', function (v) {
      const p = this.parent.anchorPrice;
      return !!v || !(p !== undefined && p !== null && String(p).trim() !== '');
    }),
};
