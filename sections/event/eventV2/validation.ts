import * as Yup from 'yup';

export const eventValidationSchema = Yup.object().shape({
  mediaUrl: Yup.string().required('Event media is required'),
  mediaType: Yup.string().optional(),
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  venue: Yup.string(),
  categories: Yup.array().of(Yup.string()),
  tags: Yup.array().of(Yup.string()),
  organization: Yup.string().required('Organization is required'),
  partnerOrganization: Yup.string(),
  partnerOrganizers: Yup.array().of(Yup.string()),
  fromDate: Yup.date().nullable().required('Start date is required'),
  fromTime: Yup.string().required('Start time is required'),
  endDate: Yup.date().nullable().required('End date is required'),
  endTime: Yup.string().required('End time is required'),
  eventType: Yup.string().oneOf(['oneTime']),
  recurring: Yup.boolean(),
  recurringType: Yup.string().oneOf(['weekly', 'monthly', 'daily']),
  recurringInterval: Yup.mixed().test('is-valid', 'Recurring interval must be at least 1', (value) => {
    if (value === '' || value === null || value === undefined) return true;
    return typeof value === 'number' && value >= 1;
  }),
  recurringDays: Yup.array().of(Yup.string()),
  recurringEnd: Yup.string().oneOf(['never', 'onDate', 'afterOccurrences']),
  recurringEndDate: Yup.date().nullable(),
  recurringEndCount: Yup.number().min(1),
  daysOfWeek: Yup.array().of(Yup.string()),

  // Step 3 - Ticketing validation with proper empty string handling
  ticketing: Yup.object()
    .shape({
      title: Yup.string(),
      quantity: Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('timingSlots.enabled', {
          is: false,
          then: (schema) => schema.min(0),
          otherwise: (schema) => schema,
        }),
      price: Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .min(0),
      taxPercentage: Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .min(0),
      publishSettings: Yup.object().shape({
        publishType: Yup.string().oneOf(['instant', 'scheduled', 'manual']),
        scheduledDate: Yup.string().when('publishType', {
          is: 'scheduled',
          then: (schema) => schema.required('Scheduled date is required'),
          otherwise: (schema) => schema,
        }),
      }),
      timingSlots: Yup.object().shape({
        enabled: Yup.boolean(),
        dateTimeSlots: Yup.array().when('enabled', {
          is: true,
          then: (schema) => schema.min(1, 'At least one time slot required'),
          otherwise: (schema) => schema,
        }),
      }),
      repeatable: Yup.object().shape({
        isRepeatable: Yup.boolean(),
        visits: Yup.number()
          .transform((value, originalValue) => (originalValue === '' ? undefined : value))
          .when('isRepeatable', {
            is: true,
            then: (schema) => schema.min(1).required(),
            otherwise: (schema) => schema,
          }),
      }),
      resaleProtection: Yup.string(),
      transferFee: Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .nullable(),
      timeSensitivePricing: Yup.object().shape({
        earlyBird: Yup.object().shape({
          enabled: Yup.boolean(),
          endDate: Yup.string().when('enabled', {
            is: true,
            then: (schema) => schema.required('Early bird end date required'),
            otherwise: (schema) => schema,
          }),
          discountedPrice: Yup.number()
            .transform((value, originalValue) => (originalValue === '' ? 0 : value))
            .when('enabled', {
              is: true,
              then: (schema) => schema.min(0).required('Early bird price required'),
              otherwise: (schema) => schema,
            }),
        }),
        lastMinute: Yup.object().shape({
          enabled: Yup.boolean(),
          startDate: Yup.string().when('enabled', {
            is: true,
            then: (schema) => schema.required('Last minute start date required'),
            otherwise: (schema) => schema,
          }),
          discountedPrice: Yup.number()
            .transform((value, originalValue) => (originalValue === '' ? 0 : value))
            .when('enabled', {
              is: true,
              then: (schema) => schema.min(0).required('Last minute price required'),
              otherwise: (schema) => schema,
            }),
        }),
      }),
      fastTrackEntry: Yup.object().shape({
        enabled: Yup.boolean(),
        quantity: Yup.number().transform((value, originalValue) => (originalValue === '' ? 0 : value)),
        extraPrice: Yup.number().transform((value, originalValue) => (originalValue === '' ? 0 : value)),
      }),
      requiresReservation: Yup.object().shape({
        enabled: Yup.boolean(),
        type: Yup.string(),
      }),
    })
    .optional(),
});

// import * as Yup from 'yup';

// export const eventValidationSchema = Yup.object().shape({
//   mediaUrl: Yup.string().required('Event media is required'),
//   mediaType: Yup.string().optional(),
//   name: Yup.string().required('Name is required'),
//   description: Yup.string(),
//   venue: Yup.string(),
//   categories: Yup.array().of(Yup.string()),
//   tags: Yup.array().of(Yup.string()),
//   organization: Yup.string().required('Organization is required'),
//   partnerOrganization: Yup.string(),
//   partnerOrganizers: Yup.array().of(Yup.string()),
//   fromDate: Yup.date().nullable().required('Start date is required'),
//   fromTime: Yup.string().required('Start time is required'),
//   endDate: Yup.date().nullable().required('End date is required'),
//   endTime: Yup.string().required('End time is required'),
//   eventType: Yup.string().oneOf(['oneTime']),
//   recurring: Yup.boolean(),
//   recurringType: Yup.string().oneOf(['weekly', 'monthly', 'daily']),
//   recurringInterval: Yup.mixed().test('is-valid', 'Recurring interval must be at least 1', (value) => {
//     if (value === '' || value === null || value === undefined) return true;
//     return typeof value === 'number' && value >= 1;
//   }),
//   recurringDays: Yup.array().of(Yup.string()),
//   recurringEnd: Yup.string().oneOf(['never', 'onDate', 'afterOccurrences']),
//   recurringEndDate: Yup.date().nullable(),
//   recurringEndCount: Yup.number().min(1),
//   daysOfWeek: Yup.array().of(Yup.string()),

//   // Step 3 - Ticketing validation
//   ticketing: Yup.object()
//     .shape({
//       title: Yup.string(),
//       quantity: Yup.number().when('timingSlots.enabled', {
//         is: false,
//         then: (schema) => schema.min(0),
//         otherwise: (schema) => schema,
//       }),
//       price: Yup.number().min(0),
//       taxPercentage: Yup.number().min(0),
//       publishSettings: Yup.object().shape({
//         publishType: Yup.string().oneOf(['instant', 'scheduled', 'manual']),
//         scheduledDate: Yup.string().when('publishType', {
//           is: 'scheduled',
//           then: (schema) => schema.required('Scheduled date is required'),
//           otherwise: (schema) => schema,
//         }),
//       }),
//       timingSlots: Yup.object().shape({
//         enabled: Yup.boolean(),
//         dateTimeSlots: Yup.array().when('enabled', {
//           is: true,
//           then: (schema) => schema.min(1, 'At least one time slot required'),
//           otherwise: (schema) => schema,
//         }),
//       }),
//       repeatable: Yup.object().shape({
//         isRepeatable: Yup.boolean(),
//         visits: Yup.number().when('isRepeatable', {
//           is: true,
//           then: (schema) => schema.min(1).required(),
//           otherwise: (schema) => schema,
//         }),
//       }),
//       resaleProtection: Yup.string(),
//       transferFee: Yup.number().nullable(),
//       timeSensitivePricing: Yup.object().shape({
//         earlyBird: Yup.object().shape({
//           enabled: Yup.boolean(),
//           endDate: Yup.string().when('enabled', {
//             is: true,
//             then: (schema) => schema.required('Early bird end date required'),
//             otherwise: (schema) => schema,
//           }),
//           discountedPrice: Yup.number().when('enabled', {
//             is: true,
//             then: (schema) => schema.min(0).required('Early bird price required'),
//             otherwise: (schema) => schema,
//           }),
//         }),
//         lastMinute: Yup.object().shape({
//           enabled: Yup.boolean(),
//           startDate: Yup.string().when('enabled', {
//             is: true,
//             then: (schema) => schema.required('Last minute start date required'),
//             otherwise: (schema) => schema,
//           }),
//           discountedPrice: Yup.number().when('enabled', {
//             is: true,
//             then: (schema) => schema.min(0).required('Last minute price required'),
//             otherwise: (schema) => schema,
//           }),
//         }),
//       }),
//       fastTrackEntry: Yup.object().shape({
//         enabled: Yup.boolean(),
//         quantity: Yup.number(),
//         extraPrice: Yup.number(),
//       }),
//       requiresReservation: Yup.object().shape({
//         enabled: Yup.boolean(),
//         type: Yup.string(),
//       }),
//     })
//     .optional(),
// });
