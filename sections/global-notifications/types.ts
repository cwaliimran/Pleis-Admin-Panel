export type NotificationStatus = 'sent' | 'scheduled';

export type DestinationType = 'none' | 'home' | 'organization' | 'event';

export type Gender = 'all' | 'male' | 'female' | 'other';

export interface LocationTargeting {
  name: string;
  radius: number;
}

export interface AgeRangeTargeting {
  min: number;
  max: number;
}

export interface NotificationTargeting {
  location?: LocationTargeting;
  ageRange?: AgeRangeTargeting;
  gender?: Gender;
  interests?: string[];
}

export interface NotificationDestination {
  type: DestinationType;
  id?: string;
  name?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  image?: string;
  destination: NotificationDestination;
  sendTime: string;
  status: NotificationStatus;
  targeting: NotificationTargeting;
  estimatedReach: number;
  actualReach?: number;
  createdAt?: string;
  updatedAt?: string;
}

// export type DestinationType = 'home' | 'organization' | 'event';
export type SendTiming = 'immediately' | 'schedule';
// export type Gender = 'all' | 'male' | 'female' | 'other';

// export interface NotificationFormValues {
//   title: string;
//   message: string;
//   image: any; // Changed from optional to required
//   destinationType: DestinationType;
//   destinationId: string;
//   destinationName: string;
//   sendTime: 'immediate' | 'scheduled';
//   scheduledDateTime: string | Date;

//   // Targeting
//   locationEnabled: boolean;
//   locationName: string;
//   locationRadius: number;

//   ageRangeEnabled: boolean;
//   ageMin: number;
//   ageMax: number;

//   genderEnabled: boolean;
//   genderValue: Gender;

//   interestsEnabled: boolean;
//   selectedInterests: string[];
// }

// types.ts - Update the form values type
export interface NotificationFormValues {
  title: string;
  message: string;
  image: any;
  destinationType: DestinationType;
  organizationId: string;
  eventId: string;
  sendTiming: SendTiming;
  scheduledDateTime: string | Date;

  // Location (using Google Places API)
  locationEnabled: boolean;
  locationFullAddress: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  locationLat: number;
  locationLong: number;
  locationRadius: number;

  // Age Range
  ageRangeEnabled: boolean;
  ageMin: number;
  ageMax: number;

  // Gender
  genderEnabled: boolean;
  genderValue: Gender;

  // Interests
  interestsEnabled: boolean;
  selectedInterests: string[];
}

export interface NotificationStats {
  sent: number;
  scheduled: number;
  totalReached: number;
  activeFilters: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

// For dropdown options
export interface OrganizationOption {
  _id: string;
  name: string;
}

export interface EventOption {
  _id: string;
  title: string;
}
