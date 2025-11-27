export type QRCodeType = 'organizer-page' | 'event-page' | 'loyalty-page' | 'checkin-ordering' | 'checkin-table';

export type QRCodeFormat = 'png' | 'jpg' | 'svg';

export type QRCodeSize = 512 | 1024 | 2048 | 4096;

export interface QRTypeConfig {
  icon: string;
  title: string;
  subtitle: string;
  fields: FormField[];
  generateUrl: (data: Record<string, string>) => string;
}

export interface FormField {
  type: 'text' | 'select';
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  text: string;
}

export interface SavedQRCode {
  id: string;
  type: QRCodeType;
  name: string;
  url: string;
  date: string;
  color: string;
  bgColor: string;
  size: QRCodeSize;
}

export interface QRCodeFormData {
  label: string;
  color: string;
  bgColor: string;
  size: QRCodeSize;
  [key: string]: string | number;
}
