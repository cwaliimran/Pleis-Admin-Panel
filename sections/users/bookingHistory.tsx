import React from 'react'
import TableHeadCustom from '@/components/table/table-head-custom'
import { TableRow, TableCell, TableBody,Table } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const BookingHistory = () => {
    return (
        <>
            <Table>

                <TableHeadCustom headLabel={[
                    { id: "type", label: "Type", align: "left" },
                    { id: "venue", label: "Venue/Event", align: "left" },
                    { id: "time", label: "Time Slot", align: "left" },
                    { id: "status", label: "Status", align: "left" }
                ]}
                />
                <TableBody>
                    {[
                        { type: "Table", venue: "Ocean View Lounge", time: "8:00 PM - 10:00 PM", status: "Confirmed" },
                        { type: "Experience", venue: "Wine Tasting Night", time: "6:00 PM", status: "Pending" },
                        { type: "Event", venue: "Jazz Concert", time: "7:30 PM - 9:30 PM", status: "Cancelled" },
                        { type: "Workshop", venue: "Art & Craft", time: "5:00 PM - 7:00 PM", status: "Confirmed" }
                    ].map((b, i) => (
                        <TableRow key={i}>
                            <TableCell>{b.type}</TableCell>
                            <TableCell>{b.venue}</TableCell>
                            <TableCell>{b.time}</TableCell>
                            <TableCell><Badge className={`
                                                ${b.status === "Confirmed" ? "bg-green-100 text-green-800"
                                    : b.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"} rounded-full px-3 py-1`
                            }>{b.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default BookingHistory