import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes for theme detection; adjust if using another library
import { useEffect, useState } from 'react';

export default function ReservationGrid({ setClick }: any) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  const timeSlots = Array.from({ length: (21 - 9) * 4 + 1 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
  });

  const reservationTypes = [
    'Regular',
    'VIP',
    'Outdoor',
    'Private',
    'Bar',
    'Window',
  ];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 0, 15)); // Default to Jan 15, 2025

  const getTimeIndex = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    const totalMinutes = hour24 * 60 + minute;
    const startMinutes = 9 * 60;
    return Math.floor((totalMinutes - startMinutes) / 15);
  };

  // Helper to get end time by adding 15 min increments
  const addMinutesToTime = (timeStr: string, minutes: number) => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    const totalMinutes = hour24 * 60 + minute + minutes;
    const newHour24 = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;
    const newAmpm = newHour24 < 12 ? 'AM' : 'PM';
    const newDisplayHour = newHour24 % 12 === 0 ? 12 : newHour24 % 12;
    const newDisplayMinute = newMinute.toString().padStart(2, '0');
    return `${newDisplayHour}:${newDisplayMinute} ${newAmpm}`;
  };

  // Generate dummy requests for the selected date across types
  const generateDummyRequests = () => {
    const requests: any = [];

    // Dummy requests only for the selected date
    const typeRequests = {
      Regular: [
        {
          startTime: '09:15 AM',
          durationSlots: 3,
          bookingId: 'BK001',
          pendingCount: 2,
          bookedCount: 5,
          table: 'T101',
          size: 2,
        },
        {
          startTime: '10:30 AM',
          durationSlots: 4,
          bookingId: 'BK002',
          pendingCount: 0,
          bookedCount: 3,
          table: 'T102',
          size: 4,
        },
      ],
      VIP: [
        {
          startTime: '11:00 AM',
          durationSlots: 5,
          bookingId: 'BK003',
          pendingCount: 1,
          bookedCount: 4,
          table: 'V1',
          size: 6,
        },
      ],
      Outdoor: [
        {
          startTime: '12:00 PM',
          durationSlots: 4,
          bookingId: 'BK004',
          pendingCount: 3,
          bookedCount: 2,
          table: 'O1',
          size: 5,
        },
      ],
      Private: [
        {
          startTime: '02:00 PM',
          durationSlots: 6,
          bookingId: 'BK005',
          pendingCount: 0,
          bookedCount: 8,
          table: 'P1',
          size: 10,
        },
      ],
      Bar: [
        {
          startTime: '05:00 PM',
          durationSlots: 2,
          bookingId: 'BK006',
          pendingCount: 1,
          bookedCount: 1,
          table: 'B1',
          size: 3,
        },
      ],
      Window: [
        {
          startTime: '06:30 PM',
          durationSlots: 3,
          bookingId: 'BK007',
          pendingCount: 4,
          bookedCount: 2,
          table: 'W1',
          size: 2,
        },
      ],
    };

    Object.entries(typeRequests).forEach(([type, reqs]) => {
      reqs.forEach((req) => {
        requests.push({
          type,
          startTime: req.startTime,
          endTime: addMinutesToTime(req.startTime, req.durationSlots * 15),
          bookingId: req.bookingId,
          pendingCount: req.pendingCount,
          bookedCount: req.bookedCount,
          table: req.table,
          size: req.size,
        });
      });
    });

    return requests;
  };

  const allRequests = generateDummyRequests();

  const getRequestAtSlot = (type: string, timeIdx: number) => {
    return allRequests.find((request: any) => {
      if (request.type !== type) return false;
      const startIdx = getTimeIndex(request.startTime);
      const endIdx = getTimeIndex(request.endTime);
      return timeIdx >= startIdx && timeIdx < endIdx;
    });
  };

  const isRequestStart = (type: string, timeIdx: number) => {
    const request = getRequestAtSlot(type, timeIdx);
    if (!request) return false;
    return getTimeIndex(request.startTime) === timeIdx;
  };

  const getRequestSpan = (type: string, timeIdx: number) => {
    const request = getRequestAtSlot(type, timeIdx);
    if (!request) return 0;
    const startIdx = getTimeIndex(request.startTime);
    const endIdx = getTimeIndex(request.endTime);
    return endIdx - startIdx;
  };

  if (!mounted) {
    return null; // Or a placeholder to avoid mismatch
  }

  return (
    <div
      className={
        isDark ? 'w-full bg-black text-white' : 'w-full bg-white text-black'
      }
    >
      <Card
        className={
          isDark
            ? 'mb-4 border-zinc-700 bg-zinc-900'
            : 'mb-4 border-gray-300 bg-gray-100'
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={
                      isDark
                        ? 'border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700'
                        : 'border-gray-300 bg-gray-200 text-black hover:bg-gray-300'
                    }
                  >
                    {format(selectedDate, 'dd MMMM yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={
                    isDark
                      ? 'w-auto border-zinc-700 bg-zinc-800 p-0'
                      : 'w-auto border-gray-300 bg-white p-0'
                  }
                >
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={isDark ? 'text-white' : 'text-black'}
                  />
                </PopoverContent>
              </Popover>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-full">
        <div
          className={
            isDark
              ? 'max-h-[600px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900'
              : 'max-h-[600px] overflow-auto rounded-lg border border-gray-300 bg-gray-100'
          }
        >
          <table className="w-full border-collapse text-sm">
            <thead
              className={
                isDark
                  ? 'sticky top-0 z-10 bg-zinc-800'
                  : 'sticky top-0 z-10 bg-gray-200'
              }
            >
              <tr>
                <th
                  className={`sticky left-0 z-20 min-w-[80px] border ${isDark ? 'border-zinc-700 bg-zinc-800' : 'border-gray-300 bg-gray-200'} p-2 text-left`}
                >
                  Type
                </th>
                {timeSlots?.map((time, i) => (
                  <th
                    key={i}
                    className={`min-w-[90px] border ${isDark ? 'border-zinc-700' : 'border-gray-300'} p-2 font-medium`}
                  >
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reservationTypes.map((type) => (
                <tr key={type}>
                  <td
                    className={`sticky left-0 z-10 h-14 border ${isDark ? 'border-zinc-700 bg-zinc-800' : 'border-gray-300 bg-gray-200'} p-2 font-medium`}
                  >
                    {type}
                  </td>
                  {timeSlots?.map((_, timeIdx) => {
                    const request = getRequestAtSlot(type, timeIdx);
                    const isStart = isRequestStart(type, timeIdx);
                    const span = getRequestSpan(type, timeIdx);

                    if (request && !isStart) {
                      return <td key={timeIdx} className="hidden"></td>;
                    }

                    return (
                      <td
                        key={timeIdx}
                        colSpan={isStart ? span : 1}
                        className={`border ${isDark ? 'border-zinc-700 bg-zinc-950' : 'border-gray-300 bg-white'} p-2`}
                      >
                        {request && isStart && (
                          <div
                            onClick={() => setClick(true)}
                            className={`h-full cursor-pointer rounded border p-2 ${
                              isDark
                                ? 'border-green-700 bg-green-900/50'
                                : 'border-green-500 bg-green-100/50'
                            }`}
                          >
                            <div className="text-xs font-semibold">
                              {request.bookingId}
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <span>
                                {request.pendingCount}/{request.bookedCount}{' '}
                                Booked
                              </span>
                              <Badge
                                className={`size-5 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} text-[12px]`}
                              >
                                {request.size}
                              </Badge>
                            </div>
                            <div
                              className={`mt-1 text-[10px] ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}
                            >
                              {request.startTime} - {request.endTime}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Card
        className={
          isDark
            ? 'mt-4 border-zinc-700 bg-zinc-900'
            : 'mt-4 border-gray-300 bg-gray-100'
        }
      >
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div
                className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}
              >
                Total Covers
              </div>
              <div className="text-2xl font-bold">127</div>
            </div>
            <div>
              <div
                className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}
              >
                Avg Party Size
              </div>
              <div className="text-2xl font-bold">3.8</div>
            </div>
            <div>
              <div
                className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}
              >
                Walk-ins
              </div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div>
              <div
                className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}
              >
                DNR Rate
              </div>
              <div className="text-2xl font-bold">2.4%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Calendar as CalendarPicker } from '@/components/ui/calendar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { format } from 'date-fns';
// import { Calendar } from 'lucide-react';
// import { useState } from 'react';

// export default function ReservationGrid({ setClick }: any) {
//   const timeSlots = Array.from({ length: (21 - 9) * 4 + 1 }, (_, i) => {
//     const totalMinutes = 9 * 60 + i * 15;
//     const hour = Math.floor(totalMinutes / 60);
//     const minute = totalMinutes % 60;
//     const ampm = hour < 12 ? 'AM' : 'PM';
//     const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//     const displayMinute = minute.toString().padStart(2, '0');
//     return `${displayHour}:${displayMinute} ${ampm}`;
//   });

//   const reservationTypes = [
//     'Regular',
//     'VIP',
//     'Outdoor',
//     'Private',
//     'Bar',
//     'Window',
//   ];

//   const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 0, 15)); // Default to Jan 15, 2025

//   const getTimeIndex = (timeStr: string) => {
//     const [time, period] = timeStr.split(' ');
//     const [hour, minute] = time.split(':').map(Number);
//     let hour24 = hour;
//     if (period === 'PM' && hour !== 12) hour24 += 12;
//     if (period === 'AM' && hour === 12) hour24 = 0;
//     const totalMinutes = hour24 * 60 + minute;
//     const startMinutes = 9 * 60;
//     return Math.floor((totalMinutes - startMinutes) / 15);
//   };

//   // Helper to get end time by adding 15 min increments
//   const addMinutesToTime = (timeStr: string, minutes: number) => {
//     const [time, period] = timeStr.split(' ');
//     const [hour, minute] = time.split(':').map(Number);
//     let hour24 = hour;
//     if (period === 'PM' && hour !== 12) hour24 += 12;
//     if (period === 'AM' && hour === 12) hour24 = 0;
//     const totalMinutes = hour24 * 60 + minute + minutes;
//     const newHour24 = Math.floor(totalMinutes / 60) % 24;
//     const newMinute = totalMinutes % 60;
//     const newAmpm = newHour24 < 12 ? 'AM' : 'PM';
//     const newDisplayHour = newHour24 % 12 === 0 ? 12 : newHour24 % 12;
//     const newDisplayMinute = newMinute.toString().padStart(2, '0');
//     return `${newDisplayHour}:${newDisplayMinute} ${newAmpm}`;
//   };

//   // Generate dummy requests for the selected date across types
//   const generateDummyRequests = () => {
//     const requests: any = [];

//     // Dummy requests only for the selected date
//     const typeRequests = {
//       Regular: [
//         {
//           startTime: '09:15 AM',
//           durationSlots: 3,
//           bookingId: 'BK001',
//           pendingCount: 2,
//           bookedCount: 5,
//           table: 'T101',
//           size: 2,
//         },
//         {
//           startTime: '10:30 AM',
//           durationSlots: 4,
//           bookingId: 'BK002',
//           pendingCount: 0,
//           bookedCount: 3,
//           table: 'T102',
//           size: 4,
//         },
//       ],
//       VIP: [
//         {
//           startTime: '11:00 AM',
//           durationSlots: 5,
//           bookingId: 'BK003',
//           pendingCount: 1,
//           bookedCount: 4,
//           table: 'V1',
//           size: 6,
//         },
//       ],
//       Outdoor: [
//         {
//           startTime: '12:00 PM',
//           durationSlots: 4,
//           bookingId: 'BK004',
//           pendingCount: 3,
//           bookedCount: 2,
//           table: 'O1',
//           size: 5,
//         },
//       ],
//       Private: [
//         {
//           startTime: '02:00 PM',
//           durationSlots: 6,
//           bookingId: 'BK005',
//           pendingCount: 0,
//           bookedCount: 8,
//           table: 'P1',
//           size: 10,
//         },
//       ],
//       Bar: [
//         {
//           startTime: '05:00 PM',
//           durationSlots: 2,
//           bookingId: 'BK006',
//           pendingCount: 1,
//           bookedCount: 1,
//           table: 'B1',
//           size: 3,
//         },
//       ],
//       Window: [
//         {
//           startTime: '06:30 PM',
//           durationSlots: 3,
//           bookingId: 'BK007',
//           pendingCount: 4,
//           bookedCount: 2,
//           table: 'W1',
//           size: 2,
//         },
//       ],
//     };

//     Object.entries(typeRequests).forEach(([type, reqs]) => {
//       reqs.forEach((req) => {
//         requests.push({
//           type,
//           startTime: req.startTime,
//           endTime: addMinutesToTime(req.startTime, req.durationSlots * 15),
//           bookingId: req.bookingId,
//           pendingCount: req.pendingCount,
//           bookedCount: req.bookedCount,
//           table: req.table,
//           size: req.size,
//         });
//       });
//     });

//     return requests;
//   };

//   const allRequests = generateDummyRequests();

//   const getRequestAtSlot = (type: string, timeIdx: number) => {
//     return allRequests.find((request: any) => {
//       if (request.type !== type) return false;
//       const startIdx = getTimeIndex(request.startTime);
//       const endIdx = getTimeIndex(request.endTime);
//       return timeIdx >= startIdx && timeIdx < endIdx;
//     });
//   };

//   const isRequestStart = (type: string, timeIdx: number) => {
//     const request = getRequestAtSlot(type, timeIdx);
//     if (!request) return false;
//     return getTimeIndex(request.startTime) === timeIdx;
//   };

//   const getRequestSpan = (type: string, timeIdx: number) => {
//     const request = getRequestAtSlot(type, timeIdx);
//     if (!request) return 0;
//     const startIdx = getTimeIndex(request.startTime);
//     const endIdx = getTimeIndex(request.endTime);
//     return endIdx - startIdx;
//   };

//   return (
//     <div className="w-full bg-black text-white">
//       <Card className="mb-4 border-zinc-700 bg-zinc-900">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
//                   >
//                     {format(selectedDate, 'dd MMMM yyyy')}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto border-zinc-700 bg-zinc-800 p-0">
//                   <CalendarPicker
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(date) => date && setSelectedDate(date)}
//                     initialFocus
//                     className="text-white"
//                   />
//                 </PopoverContent>
//               </Popover>
//             </CardTitle>
//           </div>
//         </CardHeader>
//       </Card>

//       <div className="max-w-full">
//         <div className="max-h-[600px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900">
//           <table className="w-full border-collapse text-sm">
//             <thead className="sticky top-0 z-10 bg-zinc-800">
//               <tr>
//                 <th className="sticky left-0 z-20 min-w-[80px] border border-zinc-700 bg-zinc-800 p-2 text-left">
//                   Type
//                 </th>
//                 {timeSlots?.map((time, i) => (
//                   <th
//                     key={i}
//                     className="min-w-[90px] border border-zinc-700 p-2 font-medium"
//                   >
//                     {time}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {reservationTypes.map((type) => (
//                 <tr key={type}>
//                   <td className="sticky left-0 z-10 h-14 border border-zinc-700 bg-zinc-800 p-2 font-medium">
//                     {type}
//                   </td>
//                   {timeSlots?.map((_, timeIdx) => {
//                     const request = getRequestAtSlot(type, timeIdx);
//                     const isStart = isRequestStart(type, timeIdx);
//                     const span = getRequestSpan(type, timeIdx);

//                     if (request && !isStart) {
//                       return <td key={timeIdx} className="hidden"></td>;
//                     }

//                     return (
//                       <td
//                         key={timeIdx}
//                         colSpan={isStart ? span : 1}
//                         className="border border-zinc-700 bg-zinc-950 p-2"
//                       >
//                         {request && isStart && (
//                           <div
//                             onClick={() => setClick(true)}
//                             className="h-full cursor-pointer rounded border border-green-700 bg-green-900/50 p-2"
//                           >
//                             <div className="text-xs font-semibold">
//                               {request.bookingId}
//                             </div>
//                             <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-300">
//                               <span>
//                                 {request.pendingCount}/{request.bookedCount}{' '}
//                                 Booked
//                               </span>
//                               <Badge className="size-5 bg-white text-[12px] text-black">
//                                 {request.size}
//                               </Badge>
//                             </div>
//                             <div className="mt-1 text-[10px] text-zinc-300">
//                               {request.startTime} - {request.endTime}
//                             </div>
//                           </div>
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Card className="mt-4 border-zinc-700 bg-zinc-900">
//         <CardContent className="p-4">
//           <div className="grid grid-cols-4 gap-4">
//             <div>
//               <div className="text-xs text-zinc-500">Total Covers</div>
//               <div className="text-2xl font-bold">127</div>
//             </div>
//             <div>
//               <div className="text-xs text-zinc-500">Avg Party Size</div>
//               <div className="text-2xl font-bold">3.8</div>
//             </div>
//             <div>
//               <div className="text-xs text-zinc-500">Walk-ins</div>
//               <div className="text-2xl font-bold">8</div>
//             </div>
//             <div>
//               <div className="text-xs text-zinc-500">DNR Rate</div>
//               <div className="text-2xl font-bold">2.4%</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
