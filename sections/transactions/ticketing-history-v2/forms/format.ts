export const formatEuro = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return `€${value.toFixed(2)}`;
};

export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return `${value.toFixed(2)} %`;
};
