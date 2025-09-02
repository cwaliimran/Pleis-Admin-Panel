// helpers.ts
import { PhoneNumber } from './types';

// export const formatDobDMY = (date: Date): string => {
//   return date.toLocaleDateString('en-GB'); // e.g., DD/MM/YYYY
// };

export const splitPhoneByDial = (phone: string, dialCode: string): PhoneNumber => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const code = dialCode || '+92'; // Default to Pakistan code
  const number = cleanPhone.replace(new RegExp(`^${code.replace('+', '')}`), '').trim();
  return { code, number };
};

export const formatDobDMY = (date: any) => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}