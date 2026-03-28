import TableHeadCustom from '@/components/table/table-head-custom'
import { Table, TableBody } from '@/components/ui/table'
import React from 'react'
import TopPerformaningEventTableRow from './topPerformaningEventTableRow';

const headLabel = [
    { id: 'eventName', label: 'Event Name' },
    { id: 'revenue', label: 'Revenue ($)', align: 'center' },
    // { id: 'roi', label: 'ROI (%)' },
    { id: 'engagement', label: 'Engagement (%)', align: 'center' }
];

interface TopPerformaningEventsProps {
    data?: any[];
}

const TopPerformaningEvents = ({ data = [] }: TopPerformaningEventsProps) => {
    return (
        <div className='border rounded-lg m-4 p-4'>
            {data.length > 0 ? (
                <Table className="w-full">
                    <TableHeadCustom headLabel={headLabel} />
                    <TableBody>
                        {data.map((item: any, index: number) => (
                            <TopPerformaningEventTableRow key={index} item={item} />
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="flex h-full items-center justify-center py-10">
                    <p className="text-muted-foreground text-sm">No data available</p>
                </div>
            )}
        </div>
    )
}

export default TopPerformaningEvents


