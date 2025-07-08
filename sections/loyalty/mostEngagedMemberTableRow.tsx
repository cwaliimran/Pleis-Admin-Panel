import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import React, { FC } from 'react'

interface PageProps {
    item:any
}
const MostEngagedMemberTableRow:FC<PageProps> = ({item}) => {
  return (
    <>
         <TableRow className="h-14">
            <TableCell className='bordder border-red-600'>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
                    </Avatar>
                    {item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
                </div>
            </TableCell>
            <TableCell className="text-center">{item.points}</TableCell>
            <TableCell className="text-center">{item.level}</TableCell>
            <TableCell className="text-center">{item.tier}</TableCell>
            <TableCell className="text-center">{item.lifeTimeValue}</TableCell>
          
        </TableRow>
    </>
  )
}

export default MostEngagedMemberTableRow