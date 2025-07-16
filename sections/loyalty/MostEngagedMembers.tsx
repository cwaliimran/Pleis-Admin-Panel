import TableHeadCustom from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
import React from 'react'
import { engagedMembers } from './data';
import MostEngagedMemberTableRow from './mostEngagedMemberTableRow';


const headLabel = [{
    id: 'member',
    label: 'MEMBER',
    align:"left"
}, {
    id: 'points',
    label: 'POINTS',
    align:"center"
}, {
    id: 'level',
    label: 'LEVEL',
    align:"center"
}, {
    id: 'tier',
    label: 'TIER',
    align:"center"
},
{
    id: "lifeTimeValue",
    label: 'LIFETIME VALUE',
    align: "right"
}
];


const MostEngagedMembers = () => {

    return (
        <>
            <div className='border rounded-lg m-4  '>
                <Table className="w-full">
                    <TableHeadCustom headLabel={headLabel} />
                    {engagedMembers.map((item: any,index) => (
                        <MostEngagedMemberTableRow key={index} item={item} />
                    ))}
                </Table>
            </div>
        </>
    )
}

export default MostEngagedMembers