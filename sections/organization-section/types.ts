import { FieldValues } from 'react-hook-form';

// ============================================================
// LOCATION & OPERATING HOURS
// ============================================================

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: [number, number];
}

export interface OperatingHours {
  from: string;
  to: string;
  isOpen: string;
}

// ============================================================
// FORM VALUES
// ============================================================

export interface FormValues extends FieldValues {
  description: string;
  minAge: string;
  tags: string[];
  categories: string[];
  galleryImages: File[];
  existingGallery: string[];
  venue: string;
  monday: OperatingHours;
  tuesday: OperatingHours;
  wednesday: OperatingHours;
  thursday: OperatingHours;
  friday: OperatingHours;
  saturday: OperatingHours;
  sunday: OperatingHours;
  status: string;
  location: Location;
}

// ============================================================
// GALLERY
// ============================================================

export interface GalleryItem {
  url: string;
  key: string;
  file?: File;
  name?: string;
}

export interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  initialExisting: string[];
  initialNewFiles: File[];
  onSave: (keptExisting: string[], newFiles: File[]) => void;
}

// ============================================================
// MODAL PROPS
// ============================================================

export interface AddOtherDetailsModalProps {
  newOrganization?: any;
  onClose: () => void;
  open: boolean;
  venueList: any[];
}

// ============================================================
// OPTIONS
// ============================================================

export interface SelectOption {
  label: string;
  value: string;
}
