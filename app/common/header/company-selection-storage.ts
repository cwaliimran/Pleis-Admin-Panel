import { StoredCompany, StoredOrganization } from './types';

const STORAGE_KEYS = {
  COMPANY: 'selectedCompany',
  ORGANIZATION: 'selectedOrganization',
} as const;

const EVENTS = {
  COMPANY_CHANGED: 'companyChanged',
  ORGANIZATION_CHANGED: 'organizationChanged',
  SELECTION_CHANGED: 'selectionChanged',
} as const;

/**
 * Safe JSON parse with type checking
 */
function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Check if code is running on client side
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

export class CompanySelectionStorage {
  /**
   * Get the currently selected company
   */
  static getSelectedCompany(): StoredCompany | null {
    if (!isClient()) return null;

    const stored = localStorage.getItem(STORAGE_KEYS.COMPANY);
    const parsed = safeParse<StoredCompany>(stored);

    // Validate structure
    if (parsed && typeof parsed === 'object' && 'value' in parsed && 'label' in parsed) {
      return parsed;
    }

    return null;
  }

  /**
   * Set the selected company and dispatch event
   */
  static setSelectedCompany(company: StoredCompany | null): void {
    if (!isClient()) return;

    if (!company) {
      localStorage.removeItem(STORAGE_KEYS.COMPANY);
      // Clear organization when company is cleared
      this.setSelectedOrganization(null);
    } else {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    }

    this.dispatchCompanyChangeEvent();
    this.dispatchSelectionChangeEvent();
  }

  /**
   * Get the currently selected organization
   */
  static getSelectedOrganization(): StoredOrganization | null {
    if (!isClient()) return null;

    const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATION);
    const parsed = safeParse<StoredOrganization>(stored);

    // Validate structure
    if (parsed && typeof parsed === 'object' && 'value' in parsed && 'label' in parsed && 'companyId' in parsed) {
      return parsed;
    }

    return null;
  }

  /**
   * Set the selected organization and dispatch event
   */
  static setSelectedOrganization(organization: StoredOrganization | null): void {
    if (!isClient()) return;

    if (!organization) {
      localStorage.removeItem(STORAGE_KEYS.ORGANIZATION);
    } else {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(organization));
    }

    this.dispatchOrganizationChangeEvent();
    this.dispatchSelectionChangeEvent();
  }

  /**
   * Validate that the selected organization belongs to the current company
   */
  static validateOrganizationCompanyMatch(): boolean {
    const company = this.getSelectedCompany();
    const organization = this.getSelectedOrganization();

    if (!company || !organization) return true;

    return organization.companyId === company.value;
  }

  /**
   * Clear organization if it doesn't match the current company
   */
  static clearOrganizationIfMismatch(): void {
    if (!this.validateOrganizationCompanyMatch()) {
      this.setSelectedOrganization(null);
    }
  }

  /**
   * Clear all selections
   */
  static clearAll(): void {
    this.setSelectedCompany(null);
    this.setSelectedOrganization(null);
  }

  /**
   * Get company ID from stored company
   */
  static getCompanyId(): string | null {
    const company = this.getSelectedCompany();
    return company?.value ?? null;
  }

  /**
   * Get organization ID from stored organization
   */
  static getOrganizationId(): string | null {
    const organization = this.getSelectedOrganization();
    return organization?.value ?? null;
  }

  /**
   * Dispatch company change event
   */
  private static dispatchCompanyChangeEvent(): void {
    if (!isClient()) return;
    window.dispatchEvent(new Event(EVENTS.COMPANY_CHANGED));
  }

  /**
   * Dispatch organization change event
   */
  private static dispatchOrganizationChangeEvent(): void {
    if (!isClient()) return;
    window.dispatchEvent(new Event(EVENTS.ORGANIZATION_CHANGED));
  }

  /**
   * Dispatch unified selection change event with current state
   */
  private static dispatchSelectionChangeEvent(): void {
    if (!isClient()) return;

    const event = new CustomEvent(EVENTS.SELECTION_CHANGED, {
      detail: {
        companyId: this.getCompanyId(),
        organizationId: this.getOrganizationId(),
      },
    });

    window.dispatchEvent(event);
  }

  /**
   * Subscribe to company changes
   */
  static onCompanyChange(callback: () => void): () => void {
    if (!isClient()) return () => {};

    window.addEventListener(EVENTS.COMPANY_CHANGED, callback);
    return () => window.removeEventListener(EVENTS.COMPANY_CHANGED, callback);
  }

  /**
   * Subscribe to organization changes
   */
  static onOrganizationChange(callback: () => void): () => void {
    if (!isClient()) return () => {};

    window.addEventListener(EVENTS.ORGANIZATION_CHANGED, callback);
    return () => window.removeEventListener(EVENTS.ORGANIZATION_CHANGED, callback);
  }

  /**
   * Subscribe to any selection changes (company or organization)
   */
  static onSelectionChange(callback: (event: CustomEvent<{ companyId: string | null; organizationId: string | null }>) => void): () => void {
    if (!isClient()) return () => {};

    const handler = (e: Event) => callback(e as CustomEvent);
    window.addEventListener(EVENTS.SELECTION_CHANGED, handler);
    return () => window.removeEventListener(EVENTS.SELECTION_CHANGED, handler);
  }
}

/**
 * React hook for company selection
 */
export function useCompanySelection() {
  if (!isClient()) {
    return {
      company: null,
      organization: null,
      companyId: null,
      organizationId: null,
    };
  }

  return {
    company: CompanySelectionStorage.getSelectedCompany(),
    organization: CompanySelectionStorage.getSelectedOrganization(),
    companyId: CompanySelectionStorage.getCompanyId(),
    organizationId: CompanySelectionStorage.getOrganizationId(),
  };
}
