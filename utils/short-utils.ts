export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function safeTrim(value?: string | null): string {
  return value?.trim() || '';
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getStatusVariant = (
  status?: string
): 'success' | 'error' | 'info' | 'warning' | 'default' | undefined => {
  const variants = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
    scheduled: 'info',
  } as const;
  return variants[status as keyof typeof variants] ?? 'default';
};
