export const formatEuro = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return `€${value.toFixed(2)}`;
};

export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return `${value.toFixed(2)} %`;
};

export const formatSignedEuro = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return value < 0 ? `−€${Math.abs(value).toFixed(2)}` : `€${value.toFixed(2)}`;
};
