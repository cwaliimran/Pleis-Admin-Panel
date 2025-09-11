// Utility to format date as 'dd-MM-yyyy, h:mm:ss AM/PM'
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}
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
    suspended: 'error',
    pending: 'warning',
    scheduled: 'info',
  } as const;
  return variants[status as keyof typeof variants] ?? 'default';
};
