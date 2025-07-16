import TableHeadCustom from '@/components/table/table-head-custom'
import { Table, TableBody } from '@/components/ui/table'
import React from 'react'
import { topPerformaningEventsData } from './data';
import TopPerformaningEventTableRow from './topPerformaningEventTableRow';

const headLabel = [
    { id: 'oragnizerName', label: 'Organizer name' },
    { id: 'revenue', label: 'Revenue ($)' },
    { id: 'roi', label: 'ROI (%)' },
    { id: 'engagement', label: 'Engagement (%)' }
];
const TopPerformaningEvents = () => {
    return (
        <div className='border rounded-lg m-4 p-4'>
            <Table className="w-full">
                <TableHeadCustom headLabel={headLabel} />
                <TableBody>
                    {topPerformaningEventsData.map((item: any, index: number) => (
                        <TopPerformaningEventTableRow key={index} item={item} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TopPerformaningEvents


