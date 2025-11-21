export interface EventFormValues {
  image: File | null;
  mediaUrl: string;
  mediaType: 'image' | 'video';
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
  eventType: 'oneTime';
  recurring: boolean;
  recurringType: 'daily' | 'weekly' | 'monthly';
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
  partnerOrganization: string;
  daysOfWeek?: string[];

  // Step 3 - Ticketing fields
  ticketing?: {
    title: string;
    quantity?: number;
    price: number;
    taxPercentage: number;
    publishSettings: {
      publishType: 'instant' | 'scheduled' | 'manual';
      scheduledDate: string;
    };
    timingSlots: {
      enabled: boolean;
      dateTimeSlots: any[];
    };
    repeatable: {
      isRepeatable: boolean;
      visits: number;
    };
    resaleProtection: string;
    transferFee: number | null;
    timeSensitivePricing: {
      earlyBird: {
        enabled: boolean;
        endDate: string;
        discountedPrice: number;
      };
      lastMinute: {
        enabled: boolean;
        startDate: string;
        discountedPrice: number;
      };
    };
    fastTrackEntry: {
      enabled: boolean;
      quantity: number;
      extraPrice: number;
    };
    requiresReservation: {
      enabled: boolean;
      type: string;
    };
  };
}

export interface CreateEventViewProps {
  title?: string;
  userType: any;
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
  toggleRecurringDay: (day: string) => void;
  setStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  isEditMode?: boolean;
  loading?: boolean;
  isAddingEvent?: boolean;
  isUpdatingEvent?: boolean;
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
  onSubmit: any;
  handleSkipTicketing: () => void;
}
