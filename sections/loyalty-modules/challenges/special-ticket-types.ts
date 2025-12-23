// Special Ticket Feature Types

export interface Company {
  _id: string;
  companyDetails?: {
    name?: string;
  };
}

export interface CompanyOption {
  label: string;
  value: string;
}

export interface Organization {
  _id: string;
  basicInfo?: {
    name?: string;
  };
}

export interface OrganizationOption {
  label: string;
  value: string;
  companyId: string;
}

export interface Event {
  _id: string;
  basicInfo?: {
    title?: string;
  };
}

export interface EventOption {
  label: string;
  value: string;
}

export interface Ticket {
  _id: string;
  title: string;
  amount: number;
}

export interface TicketOption {
  label: string;
  value: string;
  price: number;
}