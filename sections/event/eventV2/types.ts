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
  toggleRecurringDay: (day: string) => void;
  setStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  isEditMode?: boolean;
  loading?: boolean;
  isAddingEvent?: boolean;
  isUpdatingEvent?: boolean;
}

// export interface EventFormValues {
//   image: File | null;
//   mediaUrl: string;
//   mediaType: 'image' | 'video';
//   name: string;
//   venue: string;
//   categories: string[];
//   tags: string[];
//   organizers: string[];
//   partnerOrganizers: string[];
//   fromDate: Date | null;
//   fromTime: string;
//   endDate: Date | null;
//   endTime: string;
//   description: string;
//   eventType: 'oneTime';
//   recurring: boolean;
//   recurringType: 'daily' | 'weekly' | 'monthly';
//   recurringInterval: number;
//   recurringDays: string[];
//   recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
//   recurringEndDate: Date | null;
//   recurringEndCount: number;
//   categoryInput?: string;
//   tagInput?: string;
//   organizerInput?: string;
//   partnerOrganizerInput?: string;
//   organization: string;
//   partnerOrganization: string;
//   daysOfWeek?: string[];

//   // Ticketing fields (nested structure matching API)
//   ticketing?: {
//     title?: string;
//     quantity?: number;
//     price?: number;
//     taxPercentage?: number;

//     timingSlots?: {
//       enabled?: boolean;
//       dateTimeSlots?: Array<{
//         date: string;
//         timeSlots: Array<{
//           quantity: string;
//           startTime: string;
//           endTime: string;
//         }>;
//       }>;
//     };

//     repeatable?: {
//       isRepeatable?: boolean;
//       visits?: number;
//     };

//     resaleProtection?: 'none' | 'nameSurname' | 'nameSurnamePid';

//     transferFee?: number | null;

//     timeSensitivePricing?: {
//       earlyBird?: {
//         enabled?: boolean;
//         endDate?: string;
//         discountedPrice?: number;
//       };
//       lastMinute?: {
//         enabled?: boolean;
//         startDate?: string;
//         discountedPrice?: number;
//       };
//     };

//     fastTrackEntry?: {
//       enabled?: boolean;
//       quantity?: number;
//       extraPrice?: number;
//     };

//     requiresReservation?: {
//       enabled?: boolean;
//       type?: string;
//     };

//     publishSettings?: {
//       publishType?: 'instant' | 'scheduled' | 'manual';
//       scheduledDate?: string;
//     };
//   };
// }

// export interface CreateEventViewProps {
//   title?: string;
//   userType: string;
// }

// export interface StepOneProps {
//   methods: any;
//   watch: any;
//   setValue: any;
//   organizations: any[];
//   orgLoading: boolean;
//   venues: any[];
//   venuesLoading: boolean;
//   categoriesData: any[];
//   categoriesLoading: boolean;
//   tagsd: any[];
//   tagsLoading: boolean;
//   file: File | null;
//   setFile: (file: File | null) => void;
//   showPartnerOrganizer: boolean;
//   setShowPartnerOrganizer: React.Dispatch<React.SetStateAction<boolean>>;
//   removePartnerOrganizer: (val: string) => void;
//   setVenueModal: (show: boolean) => void;
//   router: any;
//   setStep: (step: number) => void;
//   isStepValid: (step: number) => boolean;
// }

// export interface StepTwoProps {
//   methods: any;
//   watch: any;
//   setValue: any;
//   recurring: boolean;
//   recurringDays: string[];
//   recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
//   toggleRecurringDay: (day: string) => void;
//   setStep: (step: number) => void;
//   isStepValid: (step: number) => boolean;
//   isEditMode?: boolean;
//   loading?: boolean;
//   isUpdatingEvent?: boolean;
// }

// export interface StepThreeProps {
//   methods: any;
//   watch: any;
//   setValue: any;
//   loading: boolean;
//   isAddingEvent: boolean;
//   isUpdatingEvent: boolean;
//   router: any;
//   setStep: (step: number) => void;
//   onSubmit?: (data: EventFormValues) => void;
//   handleSkipTicketing?: () => void;
// }

// // // types.ts
// // export interface EventFormValues {
// //   image: File | null;
// //   mediaUrl: string;
// //   mediaType: 'image' | 'video';
// //   name: string;
// //   venue: string;
// //   categories: string[];
// //   tags: string[];
// //   organizers: string[];
// //   partnerOrganizers: string[];
// //   fromDate: Date | null;
// //   fromTime: string;
// //   endDate: Date | null;
// //   endTime: string;
// //   description: string;
// //   eventType: 'oneTime';
// //   recurring: boolean;
// //   recurringType: 'daily' | 'weekly' | 'monthly';
// //   recurringInterval: number;
// //   recurringDays: string[];
// //   recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
// //   recurringEndDate: Date | null;
// //   recurringEndCount: number;
// //   categoryInput?: string;
// //   tagInput?: string;
// //   organizerInput?: string;
// //   partnerOrganizerInput?: string;
// //   organization: string;
// //   partnerOrganization: string;
// //   daysOfWeek?: string[];

// //   // Step 3 - Ticketing fields
// //   type?: string;
// //   quantity?: number;
// //   price?: number;
// //   tax?: string;
// //   publishSettings?: {
// //     publishType: 'instant' | 'scheduled' | 'manual';
// //     scheduledDate?: string;
// //   };
// //   features?: {
// //     timeslot?: boolean;
// //     timeSlotConfig?: any;
// //     repeatable?: boolean;
// //     repeatableVisits?: string;
// //     resale?: 'none' | 'name' | 'full';
// //     earlyBirdEnabled?: boolean;
// //     earlyBirdDate?: string;
// //     earlyBirdPrice?: string;
// //     lastMinuteEnabled?: boolean;
// //     lastMinuteDate?: string;
// //     lastMinutePrice?: string;
// //     fasttrack?: boolean;
// //     fasttrackQuantity?: string;
// //     fasttrackPrice?: string;
// //     reservation?: boolean;
// //     reservationType?: string;
// //     transfer?: boolean;
// //     transferFee?: string;
// //   };
// // }

// // export interface CreateEventViewProps {
// //   title?: string;
// //   userType: string;
// // }

// // export interface StepOneProps {
// //   methods: any;
// //   watch: any;
// //   setValue: any;
// //   organizations: any[];
// //   orgLoading: boolean;
// //   venues: any[];
// //   venuesLoading: boolean;
// //   categoriesData: any[];
// //   categoriesLoading: boolean;
// //   tagsd: any[];
// //   tagsLoading: boolean;
// //   file: File | null;
// //   setFile: (file: File | null) => void;
// //   showPartnerOrganizer: boolean;
// //   setShowPartnerOrganizer: React.Dispatch<React.SetStateAction<boolean>>;
// //   removePartnerOrganizer: (val: string) => void;
// //   setVenueModal: (show: boolean) => void;
// //   router: any;
// //   setStep: (step: number) => void;
// //   isStepValid: (step: number) => boolean;
// // }

// // export interface StepTwoProps {
// //   methods: any;
// //   watch: any;
// //   setValue: any;
// //   recurring: boolean;
// //   recurringDays: string[];
// //   recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
// //   toggleRecurringDay: (day: string) => void;
// //   setStep: (step: number) => void;
// //   isStepValid: (step: number) => boolean;
// // }

// // export interface StepThreeProps {
// //   methods: any;
// //   watch: any;
// //   setValue: any;
// //   loading: boolean;
// //   isAddingEvent: boolean;
// //   isUpdatingEvent: boolean;
// //   router: any;
// //   setStep: (step: number) => void;
// //   eventData: any;
// //   onSubmitWithTicketing: (skipTicketing: boolean) => Promise<void>;
// // }

// // // export interface EventFormValues {
// // //   image: File | null;
// // //   mediaUrl: string;
// // //   mediaType: 'image' | 'video';
// // //   name: string;
// // //   venue: string;
// // //   categories: string[];
// // //   tags: string[];
// // //   organizers: string[];
// // //   partnerOrganizers: string[];
// // //   fromDate: Date | null;
// // //   fromTime: string;
// // //   endDate: Date | null;
// // //   endTime: string;
// // //   description: string;
// // //   eventType: 'oneTime';
// // //   recurring: boolean;
// // //   recurringType: 'daily' | 'weekly' | 'monthly';
// // //   recurringInterval: number;
// // //   recurringDays: string[];
// // //   recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
// // //   recurringEndDate: Date | null;
// // //   recurringEndCount: number;
// // //   categoryInput?: string;
// // //   tagInput?: string;
// // //   organizerInput?: string;
// // //   partnerOrganizerInput?: string;
// // //   organization: string;
// // //   partnerOrganization: string;
// // //   daysOfWeek?: string[];
// // //   // Ticketing fields
// // //   type?: string;
// // //   quantity?: number;
// // //   price?: number;
// // //   tax?: string;
// // //   number?: number;
// // //   transferPrice?: number;
// // //   features?: {
// // //     timeslot?: boolean;
// // //     repeatable?: boolean;
// // //     resale?: 'none' | 'name' | 'full';
// // //     earlyBirdEnabled?: boolean;
// // //     earlyBirdDate?: string;
// // //     earlyBirdPrice?: number;
// // //     lastMinuteEnabled?: boolean;
// // //     lastMinuteDate?: string;
// // //     lastMinutePrice?: number;
// // //     fasttrack?: boolean;
// // //     fasttrackQuantity?: number;
// // //     fasttrackPrice?: number;
// // //     reservation?: boolean;
// // //     reservationType?: string;
// // //     transfer?: boolean;
// // //   };
// // // }

// // // export interface CreateEventViewProps {
// // //   title?: string;
// // //   userType: string;
// // // }

// // // export interface StepOneProps {
// // //   methods: any;
// // //   watch: any;
// // //   setValue: any;
// // //   organizations: any[];
// // //   orgLoading: boolean;
// // //   venues: any[];
// // //   venuesLoading: boolean;
// // //   categoriesData: any[];
// // //   categoriesLoading: boolean;
// // //   tagsd: any[];
// // //   tagsLoading: boolean;
// // //   file: File | null;
// // //   setFile: (file: File | null) => void;
// // //   showPartnerOrganizer: boolean;
// // //   setShowPartnerOrganizer: React.Dispatch<React.SetStateAction<boolean>>;
// // //   removePartnerOrganizer: (val: string) => void;
// // //   setVenueModal: (show: boolean) => void;
// // //   router: any;
// // //   setStep: (step: number) => void;
// // //   isStepValid: (step: number) => boolean;
// // // }

// // // export interface StepTwoProps {
// // //   methods: any;
// // //   watch: any;
// // //   setValue: any;
// // //   recurring: boolean;
// // //   recurringDays: string[];
// // //   recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
// // //   toggleRecurringDay: (day: string) => void;
// // //   setStep: (step: number) => void;
// // //   isStepValid: (step: number) => boolean;
// // // }

// // // export interface StepThreeProps {
// // //   methods: any;
// // //   watch: any;
// // //   setValue: any;
// // //   loading: boolean;
// // //   isAddingEvent: boolean;
// // //   isUpdatingEvent: boolean;
// // //   router: any;
// // //   setStep: (step: number) => void;
// // // }
