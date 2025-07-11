import Link from 'next/link';
import React, { FC } from 'react'

interface PageProps {
    item: any; // Define the type of item as needed
}
const CustomBreadCrums: FC<PageProps> = ({ item }) => {
    return (
        <div className='md:ml-6'>
            <h1 className='text-md font-bold mt-5'>{item.heading}</h1>
            <div className='flex'>
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
        </div>
    )
}

export default CustomBreadCrums