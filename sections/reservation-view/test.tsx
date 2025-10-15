import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function ReservationGrid({ setClick }: any) {
  const timeSlots = Array.from({ length: (21 - 9) * 4 + 1 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
  });

  const dates = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    label: `Jan ${i + 1}`,
  }));

  const sampleBookings = [
    {
      day: 1,
      startTime: '09:15 AM',
      endTime: '11:30 PM',
      name: 'Johnson S.',
      table: 'T202',
      size: 4,
    },
    {
      day: 3,
      startTime: '10:15 AM',
      endTime: '11:45 AM',
      name: 'Martinez F.',
      table: 'T101',
      size: 4,
    },
    {
      day: 4,
      startTime: '10:30 AM',
      endTime: '1:00 PM',
      name: 'Williams R.',
      table: 'T104',
      size: 8,
    },
    {
      day: 10,
      startTime: '1:00 PM',
      endTime: '3:15 PM',
      name: 'Green M.',
      table: 'T204',
      size: 4,
    },
    {
      day: 11,
      startTime: '11:00 AM',
      endTime: '2:30 PM',
      name: 'Turner M.',
      table: 'T201',
      size: 7,
    },
    {
      day: 15,
      startTime: '6:00 PM',
      endTime: '8:45 PM',
      name: 'Collins B.',
      table: 'T207',
      size: 2,
    },
  ];

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

  const getBookingAtSlot = (day: number, timeIdx: number) => {
    return sampleBookings.find((booking) => {
      if (booking.day !== day) return false;
      const startIdx = getTimeIndex(booking.startTime);
      const endIdx = getTimeIndex(booking.endTime);
      return timeIdx >= startIdx && timeIdx < endIdx;
    });
  };

  const isBookingStart = (day: number, timeIdx: number) => {
    const booking = getBookingAtSlot(day, timeIdx);
    if (!booking) return false;
    return getTimeIndex(booking.startTime) === timeIdx;
  };

  const getBookingSpan = (day: number, timeIdx: number) => {
    const booking = getBookingAtSlot(day, timeIdx);
    if (!booking) return 0;
    const startIdx = getTimeIndex(booking.startTime);
    const endIdx = getTimeIndex(booking.endTime);
    return endIdx - startIdx;
  };

  return (
    <div className="w-full bg-black text-white">
      <Card className="mb-4 border-zinc-700 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              January 2025
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-full">
        <div className="max-h-[600px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-zinc-800">
              <tr>
                <th className="sticky left-0 z-20 min-w-[80px] border border-zinc-700 bg-zinc-800 p-2 text-left">
                  Date
                </th>
                {timeSlots?.map((time, i) => (
                  <th
                    key={i}
                    className="min-w-[90px] border border-zinc-700 p-2 font-medium"
                  >
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dates.map((date) => (
                <tr key={date.day}>
                  <td className="sticky left-0 z-10 h-14 border border-zinc-700 bg-zinc-800 p-2 font-medium">
                    {date.label}
                  </td>
                  {timeSlots?.map((_, timeIdx) => {
                    const booking = getBookingAtSlot(date.day, timeIdx);
                    const isStart = isBookingStart(date.day, timeIdx);
                    const span = getBookingSpan(date.day, timeIdx);

                    if (booking && !isStart) {
                      return <td key={timeIdx} className="hidden"></td>;
                    }

                    return (
                      <td
                        key={timeIdx}
                        colSpan={isStart ? span : 1}
                        className="border border-zinc-700 bg-zinc-950 p-2"
                      >
                        {booking && isStart && (
                          <div
                            onClick={() => setClick(true)}
                            className="h-full cursor-pointer rounded border border-green-700 bg-green-900/50 p-2"
                          >
                            <div className="text-xs font-semibold">
                              {booking.name}
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                              <span>{booking.table}</span>
                              <Badge className="h-4 bg-zinc-700 text-[8px]">
                                {booking.size}
                              </Badge>
                            </div>
                            <div className="mt-1 text-[9px] text-zinc-500">
                              {booking.startTime} - {booking.endTime}
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

      <Card className="mt-4 border-zinc-700 bg-zinc-900">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-zinc-500">Total Covers</div>
              <div className="text-2xl font-bold">127</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Avg Party Size</div>
              <div className="text-2xl font-bold">3.8</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Walk-ins</div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">DNR Rate</div>
              <div className="text-2xl font-bold">2.4%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Calendar } from 'lucide-react';

// export default function ReservationGrid() {
//   const timeSlots = Array.from({ length: (21 - 9) * 4 + 1 }, (_, i) => {
//     const totalMinutes = 9 * 60 + i * 15;
//     const hour = Math.floor(totalMinutes / 60);
//     const minute = totalMinutes % 60;
//     const ampm = hour < 12 ? 'AM' : 'PM';
//     const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//     const displayMinute = minute.toString().padStart(2, '0');
//     return `${displayHour}:${displayMinute} ${ampm}`;
//   });

//   const dates = Array.from({ length: 30 }, (_, i) => ({
//     day: i + 1,
//     label: `Jan ${i + 1}`,
//   }));

//   const sampleBookings = {
//     '1-6': [{ name: 'Johnson S.', table: 'T202', size: 4 }],
//     '3-5': [{ name: 'Martinez F.', table: 'T101', size: 4 }],
//     '4-6': [{ name: 'Williams R.', table: 'T104', size: 8 }],
//     '10-5': [{ name: 'Green M.', table: 'T204', size: 4 }],
//     '11-7': [{ name: 'Turner M.', table: 'T201', size: 7 }],
//     '15-6': [{ name: 'Collins B.', table: 'T207', size: 2 }],
//   };

//   const getBooking = (day: any, timeIdx: any) =>
//     sampleBookings[`${day}-${timeIdx}`] || [];

//   return (
//     <div className="w-full bg-black text-white">
//       <Card className="mb-4 border-zinc-700 bg-zinc-900">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               January 2025
//             </CardTitle>

//             {/* <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="border-zinc-700 bg-zinc-800"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="border-zinc-700 bg-zinc-800"
//               >
//                 Today
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="border-zinc-700 bg-zinc-800"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div> */}
//           </div>
//         </CardHeader>
//       </Card>

//       <div className="max-w-5xl">
//         <div className="max-h-[600px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900">
//           <table className="w-full border-collapse text-sm">
//             <thead className="sticky top-0 z-10 bg-zinc-800">
//               <tr>
//                 <th className="sticky left-0 z-20 min-w-[100px] border border-zinc-700 bg-zinc-800 p-2 text-left">
//                   Date
//                 </th>
//                 {timeSlots?.map((time, i) => (
//                   <th
//                     key={i}
//                     className="min-w-[120px] border border-zinc-700 p-2"
//                   >
//                     {time}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {dates.map((date) => (
//                 <tr key={date.day}>
//                   <td className="sticky left-0 z-10 h-14 border border-zinc-700 bg-zinc-800 p-2 font-medium">
//                     {date.label}
//                   </td>
//                   {timeSlots?.map((_, timeIdx) => {
//                     const bookings = getBooking(date.day, timeIdx);
//                     return (
//                       <td
//                         key={timeIdx}
//                         className="border border-zinc-700 bg-zinc-950 p-2"
//                       >
//                         {bookings.map((booking: any, idx: number) => (
//                           <div
//                             key={idx}
//                             className="mb-1 rounded border border-green-700 bg-green-900/50 p-2"
//                           >
//                             <div className="text-xs font-semibold">
//                               {booking.name}
//                             </div>
//                             <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
//                               <span>{booking.table}</span>
//                               <Badge className="h-4 bg-zinc-700 text-[8px]">
//                                 {booking.size}
//                               </Badge>
//                             </div>
//                           </div>
//                         ))}
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
