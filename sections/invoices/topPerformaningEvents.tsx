import TableHeadCustom from '@/components/table/table-head-custom'
import { Table } from '@/components/ui/table'
import React from 'react'
import { topPerformaningEventsData } from './data';
import TopPerformaningEventTableRow from './topPerformaningEventTableRow';

const headLabel = [{
    id: 'oragnizerName',
    label: 'Organizer name',
}, {
    id: 'revenue',
    label: 'Revenue ($)',
}, {
    id: 'roi',
    label: 'ROI (%)',
}, {
    id: 'engagement',
    label: 'Engagement (%)',
}
];
const TopPerformaningEvents = () => {
    return (
        <div className='border rounded-lg m-4 p-4'>  
            <Table className="w-full">
                <TableHeadCustom headLabel={headLabel} />
                {topPerformaningEventsData.map((item:any)=>(
                    <TopPerformaningEventTableRow key={item._id} item={item} />
                ))}

            </Table>
        </div>
    )
}

export default TopPerformaningEvents


