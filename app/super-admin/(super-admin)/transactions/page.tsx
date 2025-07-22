"use client"
import Header from '@/app/common/header'
import FilterDropdown from '@/components/filter-dropdown/FilterDropdown'
import TableHeadCustom from '@/components/table/table-head-custom'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TransactionHistoryData } from '@/sections/invoices/data'
import TransactionHitoryTableRow from '@/sections/invoices/transactionHistoryRow'
import React from 'react'
const headLabel = [
    { id: "user", label: "User", align: 'left' },
    { id: 'contact', label: 'Contact', align: 'left' },
    { id: "invoice", label: "Invoice", align: 'left' },
    { id: 'organizer', label: 'Organizer', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'total', label: 'Total' },
    { id: "transactionType", label: "Transaction Type", align: 'center' },
    { id: 'status', label: 'Status', align: "center" },
    { id: 'action', label: '' },
]


const Page = () => {
    const [active, setActive] = React.useState("all");
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    return (
        <>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Transaction", href: "" },
                ]}
            />
            <div className='grid grid-cols-12 '>
                <Card className='mt-5 shadow-md col-span-12 lg:col-span-12  md:px-8 px-2  mb-5  dark:bg-secondary '>

                    <div className='flex md:justify-between md:items-center flex-col md:flex-row '>
                        <h3 className='text-xl font-semibold'>Transaction History</h3>
                        <div>
                            <Tabs value={active} onValueChange={setActive} defaultValue="all" className='w-full '>
                                <TabsList className='flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1'>
                                    <TabsTrigger value="all" className={cn(
                                        "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer ",
                                    )}>All</TabsTrigger>
                                    <TabsTrigger value="transactions" className={cn(
                                        "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                                    )}>Transactions</TabsTrigger>
                                    <TabsTrigger value="refunds" className={cn(
                                        "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                                    )}>Refunds</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <div className='flex flex-col md:items-center items-end'>
                            <FilterDropdown
                                selectedOptions={selectedOptions}
                                onSelectOption={setSelectedOptions}
                                options={[
                                    { id: "user", label: "User" },
                                    { id: 'contact', label: 'Contact' },
                                    { id: "invoice", label: "Invoice" },
                                    { id: 'organizer', label: 'Organizer ' },
                                    { id: 'date', label: 'Date' },
                                    { id: 'total', label: 'Total' },
                                    { id: "transactionType", label: "Transaction Type" },
                                    { id: 'status', label: 'Status' },
                                ]}
                            />
                        </div>
                    </div>
                    <Input
                        placeholder="Search Transaction"
                        // value={globalFilter}
                        // onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full h-10 "
                    />
                    <div className='border rounded-lg  '>
                        <Table className="w-full rounded-md border ">
                            <TableHeadCustom headLabel={headLabel} />
                            <TableBody>
                                {TransactionHistoryData.map((item: any, index: number) => (
                                    <TransactionHitoryTableRow key={index} item={item} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
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
                </Card>
            </div>
        </>
    )
}

export default Page