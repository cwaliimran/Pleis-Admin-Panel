import Link from 'next/link';
import React, { FC } from 'react'
import { Button } from '../ui/button';

interface PageProps {
    item: any; // Define the type of item as needed
    fromSuperAdmin?: boolean; // Optional prop to indicate if it's from SuperAdmin
}
const CustomBreadCrums: FC<PageProps> = ({ item, fromSuperAdmin }) => {
    console.log(item)
    return (
        <div className='md:ml-6'>
            <h1 className='text-md font-bold mt-5'>{item.heading}</h1>
            <div className='flex justify-between items-center '>
                <div className='flex items-center '>
                    {item.links.map((link: any, index: number) => (
                        <span key={link.name} className="flex items-center">
                            <Link
                                href={link.name}
                                className={`text-[12px] text-gray-400 ${index !== item.links.length - 1 ? "cursor-pointer" : ""
                                    }`}
                            >
                                {link.title}
                            </Link>
                            {index !== item.links.length - 1 && <span className="mx-1">-</span>}
                        </span>
                    ))}
                </div>
                {fromSuperAdmin && (
                    <Button className='bg-[#FF7722] hover:bg-[#FF7722] cursor-pointer md:mr-5 mr-2'>Enable two factor</Button>
                )}
            </div>
        </div>
    )
}

export default CustomBreadCrums