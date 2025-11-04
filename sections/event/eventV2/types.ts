export interface EventFormValues {
  image: File | null;
  mediaUrl: string;
  mediaType: string;
  name: string;
  venue: string;
  categories: string[];
  tags: string[];
  organizers: string[];
  partnerOrganizers: string[];
  fromDate: Date | null;
  fromTime: string;
  endDate: Date | null;
  endTime: string;
  description: string;
  eventType: 'oneTime' | 'slots';
  recurring: boolean;
  recurringType: string;
  recurringInterval: number;
  recurringDays: string[];
  recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
  recurringEndDate: Date | null;
  recurringEndCount: number;
  categoryInput?: string;
  tagInput?: string;
  organizerInput?: string;
  partnerOrganizerInput?: string;
  organization: string;
  startDateTime?: Date;
  endDateTime?: Date;
  daysOfWeek?: string[];
  endOnDate?: string;
  // Ticketing fields
  type?: string;
  quantity?: number;
  price?: number;
  tax?: string;
  number?: number;
  transferPrice?: number;
  features?: {
    timeslot?: boolean;
    repeatable?: boolean;
    resale?: 'none' | 'name' | 'full';
    earlyBirdEnabled?: boolean;
    earlyBirdDate?: string;
    earlyBirdPrice?: number;
    lastMinuteEnabled?: boolean;
    lastMinuteDate?: string;
    lastMinutePrice?: number;
    fasttrack?: boolean;
    fasttrackQuantity?: number;
    fasttrackPrice?: number;
    reservation?: boolean;
    reservationType?: string;
    transfer?: boolean;
  };
}

export interface CreateEventViewProps {
  title?: string;
  userType: string;
}

export interface StepOneProps {
  methods: any;
  watch: any;
  setValue: any;
  organizations: any[];
  orgLoading: boolean;
  venues: any[];
  venuesLoading: boolean;
  categoriesData: any[];
  categoriesLoading: boolean;
  tagsd: any[];
  tagsLoading: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
  showPartnerOrganizer: boolean;
  setShowPartnerOrganizer: React.Dispatch<React.SetStateAction<boolean>>;
  removePartnerOrganizer: (val: string) => void;
  setVenueModal: (show: boolean) => void;
  router: any;
  setStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
}

export interface StepTwoProps {
  methods: any;
  watch: any;
  setValue: any;
  recurring: boolean;
  recurringDays: string[];
  recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
  eventType: 'oneTime' | 'slots';
  toggleRecurringDay: (day: string) => void;
  setStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
}

export interface StepThreeProps {
  methods: any;
  watch: any;
  setValue: any;
  loading: boolean;
  isAddingEvent: boolean;
  isUpdatingEvent: boolean;
  router: any;
  setStep: (step: number) => void;
}
