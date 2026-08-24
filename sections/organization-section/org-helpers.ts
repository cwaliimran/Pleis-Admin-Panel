import { uploadFileToAzure } from '@/utils/fileUpload';
import { to24HourTime } from '@/utils/time';
import * as Yup from 'yup';

import { ALLOWED_IMAGE_TYPES, DAYS_OF_WEEK, MAX_IMAGE_SIZE } from './constants';
import type { FormValues, OperatingHours } from './types';

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const operatingHoursSchema = Yup.object().shape({
  from: Yup.string()
    .required('Required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be in HH:mm format'),
  to: Yup.string()
    .required('Required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be in HH:mm format'),
  isOpen: Yup.string().required('Required'),
});

const normalizeTo24Hour = (value?: string): string => {
  if (!value) return '00:00';

  const trimmed = value.trim();
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed)) {
    return trimmed;
  }

  const converted = to24HourTime(trimmed.toUpperCase());
  return converted || '00:00';
};

export const otherDetailsSchema = Yup.object().shape({
  description: Yup.string().required('Description is required').max(500, 'Description must be at most 500 characters'),
  minAge: Yup.string()
    .optional()
    .test('max-age', 'Age cannot exceed 110', (value) => {
      if (!value || value === '') return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue <= 110;
    })
    .test('min-age', 'Age must be at least 0', (value) => {
      if (!value || value === '') return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0;
    }),
  tags: Yup.array().of(Yup.string()).min(0),
  categories: Yup.array().of(Yup.string()).min(1, 'At least one category is required').max(5, 'Maximum 5 categories allowed'),
  galleryImages: Yup.mixed().nullable(),
  existingGallery: Yup.array().of(Yup.string()),
  venue: Yup.string().required('Venue is required'),
  monday: operatingHoursSchema,
  tuesday: operatingHoursSchema,
  wednesday: operatingHoursSchema,
  thursday: operatingHoursSchema,
  friday: operatingHoursSchema,
  saturday: operatingHoursSchema,
  sunday: operatingHoursSchema,
  location: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string(),
    country: Yup.string().required('Country is required'),
    coordinates: Yup.array().of(Yup.number()).length(2, 'Coordinates must be an array of 2 numbers'),
  }),
});

// ============================================================
// OPERATING HOURS HELPERS
// ============================================================

export const getOperatingHoursFromData = (data: any, dayKey: string): OperatingHours => ({
  from: normalizeTo24Hour(data?.operatingHours?.[dayKey]?.from),
  to: normalizeTo24Hour(data?.operatingHours?.[dayKey]?.to),
  isOpen: data?.operatingHours?.[dayKey]?.isOpen ? 'true' : 'false',
});

export const buildOperatingHoursPayload = (formData: FormValues) => {
  const result: Record<string, any> = {};

  DAYS_OF_WEEK.forEach(({ dayKey }) => {
    const dayData = formData[dayKey] as OperatingHours;
    result[dayKey] =
      dayData.isOpen === 'true'
        ? {
            from: dayData.from,
            to: dayData.to,
            isOpen: true,
          }
        : { from: '00:00', to: '00:00', isOpen: false };
  });

  return result;
};

// ============================================================
// IMAGE UPLOAD HELPERS
// ============================================================

export const validateAndUploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Only JPEG, PNG, GIF, or WEBP images are allowed.');
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Image size must be less than 5MB.');
    }
    return await uploadFileToAzure(file);
  });

  return Promise.all(uploadPromises);
};

// ============================================================
// URL & FILENAME HELPERS
// ============================================================

/**
 * Extracts filename from a URL or returns the string if it's already a filename
 * Example: "https://example.com/container/abc123.jpg" -> "abc123.jpg"
 */
export const extractFilenameFromUrl = (urlOrFilename: string): string => {
  if (!urlOrFilename) return '';

  // If it's already just a filename (no slashes or protocol), return as is
  if (!urlOrFilename.includes('/') && !urlOrFilename.includes('http')) {
    return urlOrFilename;
  }

  try {
    // Try to parse as URL and get the last segment
    const url = new URL(urlOrFilename);
    const pathname = url.pathname;
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || urlOrFilename;
  } catch {
    // If URL parsing fails, try to get last segment after splitting by '/'
    const segments = urlOrFilename.split('/').filter(Boolean);
    return segments[segments.length - 1] || urlOrFilename;
  }
};

// ============================================================
// GALLERY CHANGE DETECTION
// ============================================================

/**
 * Checks if gallery has changed by comparing initial and current state
 */
export const hasGalleryChanged = (initialGallery: string[], currentExisting: string[], newFiles: File[]): boolean => {
  // If there are new files, gallery has changed
  if (newFiles.length > 0) {
    return true;
  }

  // If counts differ, gallery has changed
  if (initialGallery.length !== currentExisting.length) {
    return true;
  }

  // Check if all initial items are still present
  const sortedInitial = [...initialGallery].sort();
  const sortedCurrent = [...currentExisting].sort();

  return !sortedInitial.every((item, index) => item === sortedCurrent[index]);
};

/**
 * Gets the list of removed gallery items
 */
export const getRemovedGalleryItems = (initialGallery: string[], currentExisting: string[]): string[] => {
  return initialGallery.filter((item) => !currentExisting.includes(item));
};

// ============================================================
// FORM DEFAULT VALUES BUILDER
// ============================================================

// export const buildFormDefaultValues = (organization: any, initialGalleryMedia: string[]): FormValues => {
//   if (!organization?.otherInfo) {
//     return {
//       description: '',
//       minAge: '',
//       tags: [],
//       categories: [],
//       galleryImages: [],
//       existingGallery: [],
//       venue: '',
//       monday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       tuesday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       wednesday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       thursday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       friday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       saturday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       sunday: { from: '00:00', to: '00:00', isOpen: 'false' },
//       status: 'active',
//       location: {
//         address: '',
//         city: '',
//         postalCode: '',
//         country: '',
//         coordinates: [0, 0],
//       },
//     };
//   }

//   return {
//     description: organization.otherInfo.description || '',
//     minAge: String(organization.otherInfo.minAge ?? ''),
//     tags: organization.otherInfo.tags?.map((tag: any) => tag.id) || [],
//     categories: organization.otherInfo.categories?.map((cat: any) => cat._id) || [],
//     galleryImages: [],
//     existingGallery: initialGalleryMedia,
//     venue: organization.venue?._id || '',
//     monday: getOperatingHoursFromData(organization, 'monday'),
//     tuesday: getOperatingHoursFromData(organization, 'tuesday'),
//     wednesday: getOperatingHoursFromData(organization, 'wednesday'),
//     thursday: getOperatingHoursFromData(organization, 'thursday'),
//     friday: getOperatingHoursFromData(organization, 'friday'),
//     saturday: getOperatingHoursFromData(organization, 'saturday'),
//     sunday: getOperatingHoursFromData(organization, 'sunday'),
//     status: organization.status || 'active',
//     location: {
//       address: organization.location?.fullAddress || '',
//       city: organization.location?.city || '',
//       postalCode: organization.location?.postalCode || '',
//       country: organization.location?.country || '',
//       coordinates: organization.location?.coordinates || [0, 0],
//     },
//   };
// };

export const buildFormDefaultValues = (organization: any, initialGalleryMedia: string[]): FormValues => {
  if (!organization?.otherInfo) {
    return {
      description: '',
      minAge: '',
      tags: [],
      categories: [],
      galleryImages: [],
      existingGallery: [],
      venue: '',
      monday: { from: '00:00', to: '00:00', isOpen: 'false' },
      tuesday: { from: '00:00', to: '00:00', isOpen: 'false' },
      wednesday: { from: '00:00', to: '00:00', isOpen: 'false' },
      thursday: { from: '00:00', to: '00:00', isOpen: 'false' },
      friday: { from: '00:00', to: '00:00', isOpen: 'false' },
      saturday: { from: '00:00', to: '00:00', isOpen: 'false' },
      sunday: { from: '00:00', to: '00:00', isOpen: 'false' },
      location: {
        address: '',
        city: '',
        postalCode: '',
        country: '',
        coordinates: [0, 0],
      },
    };
  }

  // Location priority:
  // 1. organization.location (already saved location)
  // 2. organization.venue.location (fallback from populated venue object)
  const location = organization.location?.fullAddress ? organization.location : organization.venue?.location;

  return {
    description: organization.otherInfo.description || '',
    minAge: String(organization.otherInfo.minAge ?? ''),
    tags: organization.otherInfo.tags?.map((tag: any) => tag.id) || [],
    categories: organization.otherInfo.categories?.map((cat: any) => cat._id) || [],
    galleryImages: [],
    existingGallery: initialGalleryMedia,
    venue: organization.venue?._id || '',
    monday: getOperatingHoursFromData(organization, 'monday'),
    tuesday: getOperatingHoursFromData(organization, 'tuesday'),
    wednesday: getOperatingHoursFromData(organization, 'wednesday'),
    thursday: getOperatingHoursFromData(organization, 'thursday'),
    friday: getOperatingHoursFromData(organization, 'friday'),
    saturday: getOperatingHoursFromData(organization, 'saturday'),
    sunday: getOperatingHoursFromData(organization, 'sunday'),
    location: {
      address: location?.fullAddress || '',
      city: location?.city || '',
      postalCode: location?.postalCode || '',
      country: location?.country || '',
      coordinates: location?.coordinates || [0, 0],
    },
  };
};

// ============================================================
// OPTIONS BUILDERS
// ============================================================

export const buildVenueOptions = (venueList: any[], venueData: any) =>
  (venueList && venueList.length > 0
    ? venueList.map((venue: any) => ({
        label: venue?.title,
        value: venue?._id,
      }))
    : venueData?.data?.map((venue: any) => ({
        label: venue?.title,
        value: venue?._id,
      }))) || [];

