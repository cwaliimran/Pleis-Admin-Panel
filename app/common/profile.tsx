import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Account = () => {
  return (
    <div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Account