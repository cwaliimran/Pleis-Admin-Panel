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

export interface NotificationFormValues {
  title: string;
  message: string;
  image: any; // Changed from optional to required
  destinationType: DestinationType;
  destinationId: string;
  destinationName: string;
  sendTime: 'immediate' | 'scheduled';
  scheduledDateTime: string | Date;

  // Targeting
  locationEnabled: boolean;
  locationName: string;
  locationRadius: number;

  ageRangeEnabled: boolean;
  ageMin: number;
  ageMax: number;

  genderEnabled: boolean;
  genderValue: Gender;

  interestsEnabled: boolean;
  selectedInterests: string[];
}

export interface NotificationStats {
  totalSent: number;
  totalScheduled: number;
  totalReach: number;
  activeFilters: number;
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
