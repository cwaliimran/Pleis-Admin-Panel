import { ModeToggle } from '@/components/atoms/mode-toggle'
import React from 'react'
import Profile from './profile'

const Superadminheader = () => {
    return (
        <div className='flex-1 dark:bg-[#1e1e2d]  md:min-h-[70px] min-h-[60px] mt-0'>
            <div className='flex items-center justify-end md:px-6 px-2 pt-3 gap-4 '>
                <ModeToggle />
                <Profile />
            </div>

        </div>
    )
}

export default Superadminheader