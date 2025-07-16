import TableHeadCustom from '@/components/table/table-head-custom'
import { Table, TableBody } from '@/components/ui/table'
import React from 'react'
import { TransactionHistoryData } from './data'
import TransactionHitoryTableRow from './transactionHistoryRow'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
const headLabel = [
    { id: "user", label: "User", align: 'left' },
    { id: 'contact', label: 'Contact', align: 'left' },
    { id: "invoice", label: "Invoice", align: 'left' },
    { id: 'organizer', label: 'Organizer', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'total', label: 'Total' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: '' },
]

const TransactionHistory = () => {
    return (
        <div>
            <div className='border rounded-lg m-4 '>
                <Table className="w-full">
                    <TableHeadCustom headLabel={headLabel} />
                    <TableBody>
                        {TransactionHistoryData.map((item: any, index: number) => (
                            <TransactionHitoryTableRow key={index} item={item} />
                        ))}
                    </TableBody>
                </Table>
                <div >
                </div>
                <Pagination className='w-full flex justify-end mt-2'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default TransactionHistory