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
  fromDate: Yup.date().nullable(),
  fromTime: Yup.string().required('Start time is required'),
  endDate: Yup.date().nullable(),
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
});

// import * as Yup from 'yup';

// export const eventValidationSchema = Yup.object().shape({
//   mediaUrl: Yup.string().required('Event media is required'),
//   mediaType: Yup.string(),
//   name: Yup.string().required('Name is required'),
//   description: Yup.string(),
//   venue: Yup.string(),
//   categories: Yup.array().of(Yup.string()),
//   tags: Yup.array().of(Yup.string()),
//   organization: Yup.string().required('Organization is required'),
//   partnerOrganizers: Yup.array().of(Yup.string()),
//   fromDate: Yup.date().nullable(),
//   fromTime: Yup.string().required('Start time is required'),
//   endDate: Yup.date().nullable(),
//   endTime: Yup.string().required('End time is required'),
//   eventType: Yup.string().oneOf(['oneTime', 'slots']),
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
//   endOnDate: Yup.string(),
// });
