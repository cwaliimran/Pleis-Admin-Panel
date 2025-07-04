import { Card, CardHeader } from '@/components/ui/card'
import React, { FC } from 'react'

interface InvoiceCardProps {
    item: {
        id: string;
        title: string;
        status: string;
        value: number;
        total?: number;
    };
}
const UserCard: FC<InvoiceCardProps> = ({ item }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center ">
                    <div>
                        <h3 className="text-lg font-bold">{item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}</h3>
                    </div>
                    <div>
                        <div className='flex items-center bg-[#79D48B] text-white  rounded-full text-sm w-[80px] h-[30px]  justify-center font-semibold'>
                            <p>{item.status}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center mt-2 text-4xl font-bold">
                    {item.value}
                   {item.total && <sub className="ml-1 text-base font-medium ">
                        / {item.total}k
                    </sub>}
                </div>
            </CardHeader>
        </Card>
    )
}

export default UserCard