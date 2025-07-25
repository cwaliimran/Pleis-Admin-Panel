
import TableHeadCustom from '@/components/table/table-head-custom'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody } from '@/components/ui/table'
import React, { FC, useState } from 'react'
import { Card } from '@/components/ui/card'
import { usersList } from './data'
import UserListTableRow from './userListTableRow'
import FilterDropdown from '@/components/filter-dropdown/FilterDropdown'

type Option = { id: string; label: string };
interface PageProps {
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
    handlePending?: (id: string) => void;
    pendingUser?: boolean;
}
const UserTable: FC<PageProps> = ({ handleDelete, handleEdit, pendingUser, handlePending }) => {
    const [filterField, setFilterField] = useState<string[]>([]);

    const headLabel = [
        { id: "image", label: "Image", align: "left" },
        { id: "fname", label: "First Name", align: "left" },
        { id: "lname", label: "Last Name", align: "left" },
        pendingUser && { id: "organization", label: "Organization", align: "left" },
        !pendingUser && { id: "username", label: "Username", align: "left" },
        pendingUser && { id: 'phone', label: "Phone", align: "left" },
        !pendingUser && { id: "role", label: "Role", align: "left" },
        !pendingUser && { id: "status", label: "Global Status", align: "left" },
        !pendingUser && { id: "totalPoints", label: "Points Earned", align: "left" },
        !pendingUser && { id: "toatlRevenue", label: " User's Revenue", align: "left" },
        !pendingUser && { id: "region", label: "Region", align: "left" },
        !pendingUser && { id: "action", label: "Action", align: "left" },
        { id: "actions", label: "", align: "right" }
    ].filter(
        (item): item is { id: string; label: string; align: string } => Boolean(item)
    );

    const options: Option[] = [
        { id: "fname", label: "First Name" },
        { id: "lname", label: "Last Name" },
        pendingUser ? { id: "organization", label: "Organization" } : null,
        !pendingUser ? { id: "username", label: "Username" } : null,
        pendingUser ? { id: "phone", label: "Phone" } : null,
        !pendingUser ? { id: "role", label: "Role" } : null,
        !pendingUser ? { id: "status", label: "Status" } : null,
        !pendingUser ? { id: "totalPoints", label: "Total Points Earned" } : null,
        !pendingUser ? { id: "totalRevenue", label: "Total Revenue From User" } : null,
        !pendingUser ? { id: "region", label: "Region" } : null,
    ].filter((opt): opt is Option => Boolean(opt));
    return (
        <div>
            <div className='grid grid-cols-12 '>
                <Card className='mt-5 shadow-md col-span-12 lg:col-span-12  md:px-8 px-2  mb-5  dark:bg-secondary'>
                    <div className='flex md:justify-between md:items-center flex-col md:flex-row gap-4'>
                        <h3 className='text-xl font-semibold md:ml-0 ml-2'>{pendingUser ? "Pending User List" : "User List"}</h3>
                        <div>
                            <div className='flex flex-col md:items-center items-end'>

                                <FilterDropdown
                                    options={options}
                                    selectedOptions={filterField}
                                    onSelectOption={setFilterField}
                                />
                            </div>

                        </div>
                    </div>
                    <div className='w-full '>
                        <Input
                            placeholder="Search User"
                            // value={globalFilter}
                            // onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full  h-10 "
                        />
                    </div>
                    <div className='border rounded-lg  '>
                        <Table className='w-full rounded-md border  '>
                            <TableHeadCustom headLabel={headLabel} />
                            <TableBody>
                                {usersList.map((item: any, index: number) => (
                                    <UserListTableRow
                                        key={index}
                                        item={item}
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit}
                                        pendingUser={pendingUser}
                                        handlePending={handlePending}
                                    />
                                ))}
                            </TableBody>
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

        </div>
    )
}

export default UserTable