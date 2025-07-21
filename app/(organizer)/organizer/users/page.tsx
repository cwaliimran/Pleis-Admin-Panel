"use client"
import React, { useState } from 'react'
import Header from '../../../common/header'
import TableHeadCustom from '@/components/table/table-head-custom'
import { Table } from '@/components/ui/table'
import { organizerData, UserTableRow } from '@/sections/users'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Plus, Settings2, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { organizerTabs, tabsData } from '@/sections/users/data'
import { Badge } from '@/components/ui/badge'
import { useBoolean } from '@/hooks/useBoolean'
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog'


const headLabel = [
    { id: "user", label: "User", align: "left" },
    { id: 'totalrevenue', label: "Total Revenue", align: "center" },
    { id: "views", label: "Views", align: "center" },
    { id: "tickets", label: "Tickets Sold", align: "center" },
    { id: 'date', label: "Date", align: "center" },
    { id: 'commission', label: "Commission", align: "center" },
    { id: 'status', label: "Status", align: "center" },
    { id: "actions", label: "", align: "end" },
]
const Page = () => {

    const openModal = useBoolean();
    const [active, setActive] = useState("all");

    return (
        <div className=''>
            <Header
                links={[
                    { name: "Dashboard", href: "/organizer/dashboard" },
                    { name: "Organizers" },
                ]}
            />
            <div className='flex justify-between mt-10'>
                <div></div>
                <div >
                    <Button className='bg-primary text-white rounded-3xl cursor-pointer  transition-colors flex items-center gap-2 px-4 py-2'
                        onClick={openModal.onTrue}>
                        <Plus />
                        Add Organizer
                    </Button>
                </div>
            </div>
            <div className='grid grid-cols-12 '>
                <Card className='mt-5 shadow-md col-span-12 lg:col-span-12  md:px-8 px-2 '>
                    <div className='flex md:justify-between md:items-center flex-col md:flex-row gap-4'>
                        <h3 className='text-xl font-semibold md:ml-0 ml-2'>Organizer List</h3>
                        <div>
                            <Tabs value={active} onValueChange={setActive} className="w-full">
                                <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">

                                    <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1">
                                        {organizerTabs.map((tab: any,index:number) => (
                                            <TabsTrigger
                                                key={index}
                                                value={tab.value}
                                                className={`text-md font-semibold relative rounded-full px-4 py-2 transition-colors
                                         ${active === tab.value
                                                        ? "text-primary"
                                                        : "text-muted-foreground"}`}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {tab.label}
                                                    {tab.icon && <tab.icon className="h-4 w-4" />}
                                                </span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </Tabs>
                        </div>
                        <div className='flex flex-col md:items-center items-end'>

                            <Badge className="bg-white text-black shadow-md px-3 py-1 rounded-2xl text-md flex items-center gap-2 w-fit">
                                <Settings2 className="w-10 h-10" />
                                <span className="whitespace-nowrap cursor-pointer ">By Profile</span>

                            </Badge>
                        </div>
                    </div>
                    <div className='w-full '>
                        <Input
                            placeholder="Search Organizer"
                            // value={globalFilter}
                            // onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full  rounded-2xl h-10 "
                        />
                    </div>
                    <div className='border rounded-lg  '>
                        <Table className='w-full rounded-md border  '>
                            <TableHeadCustom headLabel={headLabel} />
                            {organizerData.map((user, index) => (
                                <UserTableRow
                                    key={index}
                                    item={user}
                                />
                            ))}
                        </Table>
                    </div>

                    <Pagination className="flex flex-wrap items-center justify-end gap-4 mt-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Rows per page:</span>
                            <Select defaultValue="10">
                                <SelectTrigger className="w-[70px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Page info */}
                        <div className="text-muted-foreground">Page 1 of 1</div>

                        {/* Pagination controls */}
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
            <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
                <DialogOverlay
                    className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center">
                    <DialogContent>
                        <DialogTitle>Update User Information </DialogTitle>
                        <div className='flex flex-col gap-4'>
                            <input type="text" placeholder="Organizer Name" className='shadow-md z-10 p-2 rounded-md' />
                            <input type="email" placeholder="Email" className='shadow-md z-10 p-2 rounded-md' />
                            <input type="tel" placeholder="Phone Number" className='shadow-md z-10 p-2 rounded-md' />
                            <input type="text" placeholder="Address" className='shadow-md z-10 p-2 rounded-md' />
                        </div>
                        <div className='flex justify-end mt-4'>
                            <Button onClick={openModal.onFalse} variant={"outline"} className='mr-2  cursor-pointer'>Cancel</Button>
                            <Button onClick={openModal.onFalse} className='cursor-pointer'>Update User</Button>
                        </div>
                    </DialogContent>
                </DialogOverlay>
            </Dialog>

        </div>
    )
}

export default Page