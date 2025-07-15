import { Card, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import React, { FC } from 'react'

interface InvoiceCardProps {
    item: {
        id: string;
        title: string;
        amount: number;
        status: string;
        raise?: string;
        menu?: boolean
    };
}
const InvoiceCard: FC<InvoiceCardProps> = ({ item }) => {
    return (
        <Card className='rounded-[8px] dark:bg-[#171717]'>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">{item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}</h3>
                    </div>
                    <div>
                        {item.menu && <Select defaultValue='all'>
                            <SelectTrigger className=' rounded-3xl '>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className='w-auto'>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="perday">Per Day</SelectItem>
                                    <SelectItem value="overall">Overall</SelectItem>
                                    <SelectItem value="upcoming">UpComing</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>}
                    </div>
                </div>
                {item.amount && <div className="flex justify-between items-center mt-2">
                    <p className="text-3xl font-bold">{item?.amount?.toFixed(0)}</p>
                    {item.raise && <div className='flex items-center bg-[#79D48B] text-white px-3 py-1 rounded-full text-xs font-semibold'>
                        <TrendingUp />
                        <p>{item.raise}</p>
                    </div>}
                </div>}

            </CardHeader>
        </Card>
    )
}

export default InvoiceCard