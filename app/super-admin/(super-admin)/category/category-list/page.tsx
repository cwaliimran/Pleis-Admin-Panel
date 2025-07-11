"use client"
import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import TableHeadCustom from '@/components/table/table-head-custom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table } from '@/components/ui/table'
import { CategoryTableRow } from '@/sections/category'
import { organizerData, UserTableRow } from '@/sections/users'
import { useRouter } from 'next/navigation'
import React from 'react'

const headLabel = [
    { id: "sr", label: "Sr No#", align: "center" },
    { id: 'icon', label: "Icon", align: "center" },
    { id: 'name', label: "Name", align: "center" },
    { id: 'type', label: "Type", align: "center" },
    { id: "actions", label: "Action", align: "end" },
]
const Page = () => {
    const router = useRouter();
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Categories List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Categories List', name: '/category/category-list' }
                    ]
                }}
            />
            <Card className='md:mx-5 mx-2 mt-5 md:p-4 p-2'>
                <div className='flex justify-between items-center mx-4'>
                    <div>
                        <Input className='rounded-2xl md:w-[300px] w-full' placeholder='Search' />
                    </div>
                    <div>
                        <Button className='bg-[#FF7722] cursor-pointer' onClick={() => router.push('/super-admin/category/create-category')}>Add Category</Button>
                    </div>
                </div>
                <Table className='w-full   '>
                    <TableHeadCustom headLabel={headLabel} />
                    {organizerData.map((user, index) => (
                        <CategoryTableRow
                            key={index}
                            item={user}
                        />
                    ))}
                </Table>


            </Card>
        </div>
    )
}

export default Page