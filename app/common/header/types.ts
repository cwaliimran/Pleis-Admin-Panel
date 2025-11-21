export interface CompanyOption {
  label: string;
  value: string;
}

export interface OrganizationOption {
  label: string;
  value: string;
  companyId: string;
}

export interface StoredCompany {
  label: string;
  value: string;
}

export interface StoredOrganization {
  label: string;
  value: string;
  companyId: string;
}

export type CompanySelectionEvent = CustomEvent<{
  companyId: string | null;
  organizationId: string | null;
}>;
