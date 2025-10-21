// 'use client';

// import ButtonLoading from '@/components/common/button-loading';
// import { RHFSelectField, RHFTextField } from '@/components/rhf';
// import RHFDate from '@/components/rhf/rhf-date';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';
// import { CalendarIcon, Clock, Plus } from 'lucide-react';
// import {
//   checkboxItems,
//   currencyOptions,
//   salesChannelOptions,
//   ticketOptionsData,
//   ticketTypeOptions,
//   timeOptions,
// } from './constants';
// import type { StepThreeProps } from './types';

// const StepThree = ({
//   // methods,
//   // watch,
//   // setValue,
//   // userType,
//   // version,
//   // setVersion,
//   loading,
//   isAddingEvent,
//   isUpdatingEvent,
//   // router,
//   setStep,
// }: StepThreeProps) => {
//   return (
//     <div>
//       <div className="w-full items-center justify-start md:flex">
//         <div className="flex flex-wrap gap-4">
//           {checkboxItems.map((item, index) => (
//             <div
//               key={index}
//               className="flex w-full items-center gap-2 sm:w-auto"
//             >
//               <Input type="checkbox" className="h-4 w-4 cursor-pointer" />
//               <span className="text-foreground text-sm">{item}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* FIRST PART */}
//       <h1 className="my-5 text-[16px] leading-5 font-medium">
//         General Information
//       </h1>
//       <div className="flex flex-wrap items-center gap-2 md:gap-4">
//         {ticketTypeOptions.map((item, index) => (
//           <div key={index} className="flex w-full items-center gap-2 sm:w-auto">
//             <Button
//               variant={'outline'}
//               onClick={() => setVersion(index + 1)}
//               className={`cursor-pointer rounded-2xl bg-transparent px-10 py-5 transition-all md:max-w-[140px] md:min-w-[140px] ${
//                 version === index + 1
//                   ? 'border-blue-700 text-blue-700 dark:border-blue-600 dark:text-blue-400'
//                   : ''
//               }`}
//             >
//               {item}
//             </Button>
//           </div>
//         ))}
//       </div>

//       <div className="relative mt-5 w-full md:w-[66%]">
//         <RHFTextField
//           name="name_"
//           placeholder="General Admission"
//           className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium dark:border-zinc-600 dark:hover:border-zinc-500"
//         />
//       </div>
//       <div className="mt-4 grid w-full grid-cols-12 gap-4">
//         <div className="col-span-12 md:col-span-8">
//           <RHFTextField
//             name="description_"
//             multiline
//             rows={4}
//             placeholder="Type Ticket Description"
//             className="border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium md:min-h-[132px] dark:border-zinc-600 dark:hover:border-zinc-500"
//           />
//         </div>
//         <div className="col-span-12 md:col-span-4">
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//               AVAILABLE QUANTITY
//             </label>
//             <RHFTextField
//               name="quantity"
//               placeholder="100"
//               type="number"
//               className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium dark:border-zinc-600 dark:hover:border-zinc-500"
//             />
//           </div>
//           <div className="mt-3 flex items-end gap-4">
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//                 PRICE
//               </label>
//               <RHFTextField
//                 name="price"
//                 placeholder="0.00"
//                 type="number"
//                 className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium dark:border-zinc-600 dark:hover:border-zinc-500"
//               />
//             </div>
//             <RHFSelectField
//               name="currency"
//               placeholder="USD"
//               options={currencyOptions}
//               className="cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium dark:border-zinc-600 dark:hover:border-zinc-500"
//             />
//           </div>
//         </div>
//       </div>

//       <Separator className="my-4 md:my-8" />

//       {/* SECOND PART */}
//       <h1 className="my-5 text-[16px] leading-5 font-medium">
//         Set up sale start date and time
//       </h1>
//       <div className="w-full md:w-[60%]">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//               <CalendarIcon className="h-4 w-4" />
//               START DATE
//             </label>
//             <RHFDate
//               name="fromDate_"
//               className="w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//               <Clock className="h-4 w-4" />
//               START TIME
//             </label>
//             <input
//               title="Select Start Time"
//               type="time"
//               step="1800"
//               className="w-25 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
//             />
//           </div>
//         </div>
//       </div>

//       {/* End Date and Time row */}
//       <div className="w-full md:mt-6 md:w-[60%]">
//         <div className="grid grid-cols-1 gap-6 gap-y-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
//               <CalendarIcon className="h-4 w-4" />
//               END DATE
//             </label>
//             <RHFDate
//               name="endDate_"
//               className="w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//               <Clock className="h-4 w-4" />
//               END TIME
//             </label>
//             <input
//               title="Select End Time"
//               type="time"
//               step="1800"
//               className="w-25 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
//             />
//           </div>
//         </div>
//         <div className="mt-6 w-full space-y-2 md:w-[60%]">
//           <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//             TICKET OPTIONS
//           </label>
//           <RHFSelectField
//             name="ticketOptions"
//             placeholder="Select Ticket Options"
//             options={ticketOptionsData}
//             className="w-full cursor-pointer rounded-4xl border-gray-200 dark:border-zinc-600 dark:hover:border-zinc-500"
//           />
//         </div>
//       </div>

//       <Separator className="my-4 md:my-8" />

//       {/* THIRD PART */}
//       <Button
//         type="button"
//         className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2"
//       >
//         <Plus className="h-4 w-4" /> Add Date
//       </Button>

//       <h1 className="text-foreground my-5 text-[14px] leading-5 font-medium">
//         <span className="text-primary cursor-pointer dark:text-blue-400">
//           + Create a section
//         </span>{' '}
//         if you want to sell multiple ticket types that share the same inventory.
//       </h1>
//       <div className="mt-6 w-full space-y-2 md:w-[60%]">
//         <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//           CHOOSE A SECTION
//         </label>
//         <RHFSelectField
//           name="time"
//           options={timeOptions}
//           className="w-full cursor-pointer rounded-4xl border-gray-200 dark:border-zinc-600 dark:hover:border-zinc-500"
//         />
//       </div>

//       <Separator className="my-4 md:my-8" />

//       <div className="flex items-center-safe gap-2">
//         <h1 className="flex-wrap text-[16px] leading-5 font-medium">
//           Advanced settings
//         </h1>
//         {/* <ChevronDown className="h-4 w-4 cursor-pointer" /> */}
//       </div>
//       <div className="mt-6 w-full space-y-2 md:w-[60%]">
//         <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//           TICKETS PER ORDER
//         </label>
//         <div className="items-center gap-3 md:flex">
//           <RHFTextField
//             name="minQuantity"
//             placeholder="Minimum quantity"
//             type="number"
//             className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium dark:border-zinc-600 dark:hover:border-zinc-500"
//           />
//           <RHFTextField
//             name="maxQuantity"
//             placeholder="Maximum quantity"
//             type="number"
//             className="mt-3 rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium md:mt-0 dark:border-zinc-600 dark:hover:border-zinc-500"
//           />
//         </div>
//         <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
//           SALES CHANNEL
//         </label>
//         <RHFSelectField
//           name="salesChannel"
//           placeholder="Select Sales Channel"
//           options={salesChannelOptions}
//           className="w-full cursor-pointer rounded-4xl border-gray-200 dark:border-zinc-600 dark:hover:border-zinc-500"
//         />
//       </div>

//       <Separator className="my-4 md:my-8" />

//       <div className="flex flex-wrap gap-3">
//         <Button
//           type="button"
//           className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2"
//         >
//           <Plus className="h-4 w-4" /> Add tickets
//         </Button>

//         <Button
//           type="button"
//           className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2"
//         >
//           <Plus className="h-4 w-4" />
//           Import Tickets
//         </Button>
//       </div>

//       <Separator className="my-4 md:my-8" />

//       {/* FORTH PART */}
//       <h1 className="text-primary my-5 cursor-pointer flex-wrap text-[16px] leading-5 font-medium dark:text-blue-400">
//         + Add package
//       </h1>

//       <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => setStep(2)}
//           className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
//         >
//           Back
//         </Button>

//         <Button
//           type="button"
//           variant="outline"
//           // onClick={() => router.push(`/${userType}/events/1`)}
//           className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
//         >
//           Skip
//         </Button>

//         {loading || isAddingEvent || isUpdatingEvent ? (
//           <Button
//             type="button"
//             disabled
//             className="bg-primary hover:bg-primary cursor-not-allowed rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
//           >
//             <ButtonLoading title="Publishing" />
//           </Button>
//         ) : (
//           <Button
//             type="submit"
//             className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
//           >
//             Publish
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StepThree;
